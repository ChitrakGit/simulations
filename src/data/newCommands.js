// Additional Docker Commands sourced from:
// 1. doc/docker volums.md
// 2. doc/docker cpu and memory.md
// 3. doc/Docker-Cheat-Sheet.pdf

export const NEW_DOCKER_COMMANDS = [
  // ==================== NEW BASIC COMMANDS ====================
  {
    id: 'docker-create',
    name: 'Create Container Without Starting',
    command: 'docker create --name web-nginx nginx:alpine',
    category: 'basic',
    tags: ['Containers', 'Lifecycle', 'Images'],
    summary: 'Provisions container configuration, OverlayFS rootfs, and metadata on disk without initiating process execution.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'create', type: 'subcommand', desc: 'Create a new container' },
      { text: '--name web-nginx', type: 'flag', desc: 'Assigns unique memorable container name' },
      { text: 'nginx:alpine', type: 'image', desc: 'Base container image' }
    ],
    detailedDescription: 'Useful for multi-stage setup workflows where you need to inspect or populate container volumes, copy configurations, or configure network rules prior to starting PID 1.',
    flagsBreakdown: [
      { flag: '--name', desc: 'Assign container name', default: 'generated' },
      { flag: '-p, --publish', desc: 'Publish container ports', default: 'none' },
      { flag: '-v, --volume', desc: 'Bind mount a volume', default: 'none' }
    ],
    sampleOutput: `4e918bcae31720f1883aa3d81b95fcae1378d381ba9377a892b1cd0912ab8e11`,
    tips: ['Combine with `docker start` when container setup requires pre-populating files before execution.'],
    simulation: {
      type: 'lifecycle-create',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'POST /containers/create Request',
          description: 'Client formats JSON payload and sends it over Unix domain socket `/var/run/docker.sock`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/create?name=web-nginx HTTP/1.1...", 310) = 310',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'POST /create'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (dockerd & containerd)',
          title: 'Prepare OCI Runtime Bundle on Disk',
          description: 'dockerd verifies image layers, creates writeable layer in OverlayFS, and writes `config.json` bundle.',
          kernelLogs: '[dockerd] msg="container created" id=4e918bcae3\n[containerd] msg="bundle prepared in /run/containerd/"',
          hardwareActivity: 'NVMe write config.json.',
          statusBadge: 'Bundle Written'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware Layer',
          title: 'NVMe Flash Sector Inode Allocation',
          description: 'Host storage controller allocates inode for container state directory. No CPU runtime threads spawned.',
          kernelLogs: '[nvme] write 4096 bytes to /var/lib/docker/containers/4e918bcae3',
          hardwareActivity: 'SSD flash write cycle.',
          statusBadge: 'Zero CPU Running'
        },
        {
          stepNumber: 4,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Return Full 64-char Container ID',
          description: 'Prints container hash ID. Container state remains "Created" with zero memory usage.',
          kernelLogs: '[strace] write(1, "4e918bcae31720f1883aa3d81b95fcae1378d381ba93...\\n", 65) = 65',
          hardwareActivity: 'Stdout print.',
          statusBadge: 'Created'
        }
      ]
    }
  },
  {
    id: 'docker-unpause',
    name: 'Unpause Container Processes',
    command: 'docker unpause web-nginx',
    category: 'basic',
    tags: ['Containers', 'Cgroups', 'Lifecycle'],
    summary: 'Resumes all frozen processes within a container by clearing the cgroups freezer flag.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'unpause', type: 'subcommand', desc: 'Unpause all processes within one or more containers' },
      { text: 'web-nginx', type: 'argument', desc: 'Target paused container' }
    ],
    detailedDescription: 'Opposite of `docker pause`. Writes `0` to the cgroup freezer controller (`cgroup.freeze` in cgroups v2). The kernel immediately re-adds the container\'s processes back onto the CPU runqueue without any restart overhead.',
    flagsBreakdown: [],
    sampleOutput: `web-nginx`,
    tips: ['Resuming is instantaneous because all process memory pages remained locked in RAM while paused.'],
    simulation: {
      type: 'cgroups-unpause',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Unpause API Call',
          description: 'Sends POST request to `/v1.43/containers/web-nginx/unpause`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/web-nginx/unpause HTTP/1.1...", 185) = 185',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /unpause'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Write 0 to cgroup.freeze Controller',
          description: 'dockerd locates `/sys/fs/cgroup/docker/[id]/cgroup.freeze` and writes `0`.',
          kernelLogs: '[dockerd] write /sys/fs/cgroup/docker/b8f9/cgroup.freeze "0"',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'cgroup.freeze=0'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'CFS Scheduler Re-queues Tasks',
          description: 'Kernel transitions task state from `TASK_FROZEN` to `TASK_RUNNING` and re-inserts PIDs into the CPU CFS scheduling queue.',
          kernelLogs: '[kernel] cgroup_unfreeze_task: PID 14820 state updated to TASK_RUNNING\n[kernel] sched: task 14820 enqueued on CPU #2 CFS runqueue',
          hardwareActivity: 'CPU Core #2 context restores task registers.',
          statusBadge: 'CFS Enqueued'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Application Processes Resume Execution',
          description: 'Container processes resume executing exactly where they were paused, draining queued TCP receive buffers.',
          kernelLogs: '[nginx] epoll_wait returned 2 ready network events',
          hardwareActivity: 'CPU cycles resume.',
          statusBadge: 'Running'
        }
      ]
    }
  },
  {
    id: 'docker-tag',
    name: 'Tag Image for Registry Repository',
    command: 'docker tag nginx:alpine myregistry.com/my-nginx:v1.0',
    category: 'basic',
    tags: ['Images', 'Registry'],
    summary: 'Creates a new repository/tag pointer referencing an existing local image layer digest without duplicating data.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'tag', type: 'subcommand', desc: 'Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE' },
      { text: 'nginx:alpine', type: 'image', desc: 'Source image name or image ID' },
      { text: 'myregistry.com/my-nginx:v1.0', type: 'image', desc: 'Target repository and tag' }
    ],
    detailedDescription: 'Images in Docker are indexed by their SHA256 layer chain digest. `docker tag` simply inserts a new symbolic name pointer in `/var/lib/docker/image/overlay2/repositories.json`, consuming virtually 0 disk space.',
    flagsBreakdown: [],
    sampleOutput: `(Returns 0 exit code on success)`,
    tips: ['Tagging with your registry host prefix is mandatory before running `docker push`.'],
    simulation: {
      type: 'image-tag',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Tag API Request',
          description: 'Sends `POST /v1.43/images/nginx:alpine/tag?repo=myregistry.com/my-nginx&tag=v1.0`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/images/nginx:alpine/tag?repo=...", 220) = 220',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /tag'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Update Reference Store Pointer in RAM',
          description: 'dockerd maps `myregistry.com/my-nginx:v1.0` to the existing SHA256 digest `904b8cb1e405`.',
          kernelLogs: '[dockerd] image reference store: mapped tag to sha256:904b8cb1e405',
          hardwareActivity: 'RAM dictionary update.',
          statusBadge: 'Pointer Created'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'Atomic Write to repositories.json',
          description: 'Saves updated JSON configuration to host NVMe storage via `fsync()`.',
          kernelLogs: '[kernel] fdatasync(4) flushed repositories.json to disk sector 0x881230',
          hardwareActivity: 'Sub-millisecond NVMe write.',
          statusBadge: 'Saved to Disk'
        }
      ]
    }
  },
  {
    id: 'docker-search',
    name: 'Search Docker Hub Registry',
    command: 'docker search nginx --filter is-official=true',
    category: 'basic',
    tags: ['Registry', 'Images', 'Networking'],
    summary: 'Queries Docker Hub public registry catalog via HTTPS API for matching images, official badges, and star ratings.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'search', type: 'subcommand', desc: 'Search the Docker Hub for images' },
      { text: 'nginx', type: 'argument', desc: 'Search term or keywords' },
      { text: '--filter is-official=true', type: 'flag', desc: 'Filter results to only certified official images' }
    ],
    detailedDescription: 'Docker CLI connects over HTTPS to Docker Hub API, queries image names, descriptions, stars, and official certification status, and formats output as a terminal table.',
    flagsBreakdown: [
      { flag: '--filter', desc: 'Filter search results (e.g. stars=100, is-official=true)', default: 'none' },
      { flag: '--limit', desc: 'Max number of search results (default 25)', default: '25' }
    ],
    sampleOutput: `NAME      DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
nginx     Official build of Nginx.                        19842     [OK]       
unit      Official build of NGINX Unit                    34        [OK]`,
    tips: ['Prioritize images with `[OK]` under OFFICIAL for production to ensure regular CVE security patching.'],
    simulation: {
      type: 'registry-search',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Client Dispatches Hub Search',
          description: 'Client parses flags and sends GET `/v1.43/images/search?term=nginx&filters=...`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/images/search?term=nginx HTTP/1.1...", 180) = 180',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'GET /images/search'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (NIC)',
          title: 'Outbound TLS 1.3 Packets via Physical NIC',
          description: 'Host network adapter dispatches TLS queries across WAN to Docker Hub API servers.',
          kernelLogs: '[nic] eth0: TX ring buffer sent 540 bytes to 52.204.12.98:443',
          hardwareActivity: 'NIC DMA transfer to ethernet PHY.',
          statusBadge: 'HTTPS Registry Query'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Format Ranked Results Table',
          description: 'Client receives JSON array and renders formatted table with STARS and OFFICIAL badges.',
          kernelLogs: '[strace] write(1, "NAME      DESCRIPTION...", 260) = 260',
          hardwareActivity: 'Stdout render.',
          statusBadge: 'Table Output'
        }
      ]
    }
  },
  {
    id: 'docker-login',
    name: 'Authenticate with Docker Registry',
    command: 'docker login --username myuser',
    category: 'basic',
    tags: ['Security', 'Registry', 'Authentication'],
    summary: 'Authenticates with Docker Hub or private OCI registry, storing base64 credentials in ~/.docker/config.json.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'login', type: 'subcommand', desc: 'Log in to a Docker registry' },
      { text: '--username myuser', type: 'flag', desc: 'Registry login username' }
    ],
    detailedDescription: 'Prompts securely for password, initiates HTTPS POST to registry endpoint, receives auth token, and saves it to local credentials store.',
    flagsBreakdown: [
      { flag: '-u, --username', desc: 'Username for authentication', default: 'none' },
      { flag: '-p, --password', desc: 'Password string', default: 'none' }
    ],
    sampleOutput: `Password: 
Login Succeeded`,
    tips: ['In CI/CD, pipe passwords via stdin: `echo "$TOKEN" | docker login -u "$USER" --password-stdin`.'],
    simulation: {
      type: 'auth-login',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Terminal Raw Mode Password Capture',
          description: 'CLI disables terminal echo to mask password entry.',
          kernelLogs: '[strace] ioctl(0, TCSETSW, {c_lflag &= ~ECHO}) = 0',
          hardwareActivity: 'Keyboard input masked.',
          statusBadge: 'Hidden Password Input'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (NIC)',
          title: 'OAuth Bearer Token Exchange via TLS',
          description: 'Physical NIC sends encrypted auth challenge to registry auth server.',
          kernelLogs: '[nic] eth0: TLS 1.3 handshake completed; HTTP 200 OK Token Received',
          hardwareActivity: 'NIC packet stream.',
          statusBadge: 'Token 200 OK'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'Write Auth Token to ~/.docker/config.json',
          description: 'Saves auth token into host user directory with secure file permissions (0600).',
          kernelLogs: '[kernel] openat(AT_FDCWD, "/root/.docker/config.json", O_WRONLY|O_CREAT, 0600) = 4',
          hardwareActivity: 'NVMe sector write.',
          statusBadge: 'Auth Token Stored'
        }
      ]
    }
  },
  {
    id: 'docker-system-df',
    name: 'Inspect System Storage Utilization',
    command: 'docker system df -v',
    category: 'basic',
    tags: ['System', 'Storage', 'Inspection', 'Volumes'],
    summary: 'Outputs detailed breakdown of host disk space consumed by images, containers, local volumes, and build cache.',
    syntaxTokens: [
      { text: 'docker system', type: 'subcommand', desc: 'Manage Docker system environment' },
      { text: 'df', type: 'subcommand', desc: 'Show docker disk usage' },
      { text: '-v', type: 'flag', desc: '--verbose: Show detailed information on individual image/volume sizes' }
    ],
    detailedDescription: 'Queries the Docker daemon graph driver and volume store, calculating exact byte sizes and reclaimable space across all 4 Docker storage domains.',
    flagsBreakdown: [
      { flag: '-v, --verbose', desc: 'Show detailed per-object usage breakdown', default: 'false' }
    ],
    sampleOutput: `TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          14        3         3.82GB    2.41GB (63%)
Containers      8         2         214MB     180MB (84%)
Local Volumes   6         2         1.24GB    850MB (68%)
Build Cache     42        0         4.12GB    4.12GB (100%)`,
    tips: ['Run `docker system df` regularly to spot when Build Cache or unattached volumes are consuming your host drive.'],
    simulation: {
      type: 'storage-df',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'System Disk Usage Query',
          description: 'Client calls `GET /v1.43/system/df`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/system/df HTTP/1.1...", 110) = 110',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /system/df'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Graph Driver & Volume Size Aggregation',
          description: 'dockerd sums layer sizes in `/var/lib/docker/overlay2/` and named volume directories.',
          kernelLogs: '[dockerd] statfs on storage pools -> 9.39 GB total Docker data',
          hardwareActivity: 'RAM sum calculation.',
          statusBadge: 'Size Calculation'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Display Tabular Disk Usage Matrix',
          description: 'Renders categorized storage table with reclaimable percentage calculations.',
          kernelLogs: '[strace] write(1, "TYPE            TOTAL     ACTIVE...", 280) = 280',
          hardwareActivity: 'Stdout render.',
          statusBadge: 'Report Rendered'
        }
      ]
    }
  },

  // ==================== NEW INTERMEDIATE COMMANDS ====================
  {
    id: 'docker-attach',
    name: 'Attach Terminal Streams to Running Container',
    command: 'docker attach web-nginx',
    category: 'intermediate',
    tags: ['Containers', 'Debugging', 'Terminal'],
    summary: 'Attaches local keyboard input and terminal output directly to the container\'s active PID 1 process.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'attach', type: 'subcommand', desc: 'Attach local standard input, output, and error streams to a running container' },
      { text: 'web-nginx', type: 'argument', desc: 'Target running container' }
    ],
    detailedDescription: 'Hooks your current terminal directly into the container\'s root process (PID 1). Warning: pressing Ctrl+C inside an attached container will send SIGINT to PID 1, stopping the container! Use `Ctrl+P, Ctrl+Q` to detach safely.',
    flagsBreakdown: [
      { flag: '--no-stdin', desc: 'Do not attach STDIN', default: 'false' },
      { flag: '--sig-proxy', desc: 'Proxy all received signals to the process', default: 'true' }
    ],
    sampleOutput: `172.17.0.1 - - [18/Oct/2026:00:12:00 +0000] "GET / HTTP/1.1" 200 615`,
    tips: ['To detach from a container without stopping it, press the escape sequence: Ctrl+P followed by Ctrl+Q!'],
    simulation: {
      type: 'terminal-attach',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Stream Hijack Request',
          description: 'Client sends `POST /v1.43/containers/web-nginx/attach?stdin=1&stdout=1&stderr=1&stream=1`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/web-nginx/attach?stream=1...", 240) = 240',
          hardwareActivity: 'Socket stream multiplexing.',
          statusBadge: 'Stream Hijacked'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (containerd-shim)',
          title: 'Direct FIFO Pipe Bridging',
          description: 'containerd-shim connects container PID 1 standard file descriptors (0, 1, 2) directly into the hijacked socket stream.',
          kernelLogs: '[containerd-shim] msg="attached client to FIFO pipes: stdin, stdout, stderr"',
          hardwareActivity: 'RAM FIFO pipe buffer copy.',
          statusBadge: 'Pipes Connected'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'PID 1 I/O Directly Mirrored to User',
          description: 'Container PID 1 outputs characters directly into user host terminal window.',
          kernelLogs: '[container] PID 1 write(1, "GET / HTTP/1.1 200\\n", 19) = 19',
          hardwareActivity: 'Direct user-mode stream mirroring.',
          statusBadge: 'Direct PID 1 Hook'
        }
      ]
    }
  },
  {
    id: 'docker-wait',
    name: 'Block Until Container Exits',
    command: 'docker wait web-nginx',
    category: 'intermediate',
    tags: ['Containers', 'Lifecycle', 'Automation'],
    summary: 'Blocks shell script execution until the target container terminates, then outputs its numerical exit code.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'wait', type: 'subcommand', desc: 'Block until one or more containers stop, then print their exit codes' },
      { text: 'web-nginx', type: 'argument', desc: 'Target container' }
    ],
    detailedDescription: 'Used heavily in CI/CD pipeline automation and bash test scripts. Waits synchronously for container task termination, reporting whether the task succeeded (0) or failed with non-zero exit code.',
    flagsBreakdown: [],
    sampleOutput: `0`,
    tips: ['Use in scripts: `docker start -a test-runner; code=$(docker wait test-runner); if [ $code -ne 0 ]; then exit 1; fi`.'],
    simulation: {
      type: 'lifecycle-wait',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Wait Request Socket Open',
          description: 'Sends `POST /v1.43/containers/web-nginx/wait`. Client thread blocks awaiting server response.',
          kernelLogs: '[strace] read(3, ... [blocking awaiting daemon response])',
          hardwareActivity: 'CLI thread sleeping in futex wait.',
          statusBadge: 'Thread Blocking'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'waitpid() Syscall Surveillance',
          description: 'Kernel monitors container task PID. When process calls `exit_group(0)`, kernel wakes up containerd listener.',
          kernelLogs: '[kernel] do_exit(0) called by PID 14820\n[kernel] wake_up_process for containerd listener',
          hardwareActivity: 'Kernel task cleanup.',
          statusBadge: 'exit_group(0)'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Wakeup & Output Numeric Exit Code',
          description: 'Client receives JSON exit code frame and prints integer to stdout.',
          kernelLogs: '[strace] write(1, "0\\n", 2) = 2',
          hardwareActivity: 'Terminal output rendered.',
          statusBadge: 'Exit Code 0'
        }
      ]
    }
  },
  {
    id: 'docker-export',
    name: 'Export Container Rootfs as Tarball',
    command: 'docker export -o web-nginx-fs.tar web-nginx',
    category: 'intermediate',
    tags: ['Storage', 'Images', 'Tar', 'Filesystem'],
    summary: 'Flattens container filesystem into a single unlayered tar archive, stripping away intermediate layer history.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'export', type: 'subcommand', desc: 'Export a container\'s filesystem as a tar archive' },
      { text: '-o web-nginx-fs.tar', type: 'flag', desc: 'Write tar output directly to file on host' },
      { text: 'web-nginx', type: 'argument', desc: 'Container to export' }
    ],
    detailedDescription: 'Dumps the flattened runtime view of the container rootfs into a plain tarball, ideal for building minimal scratch images or importing into LXC/chroot.',
    flagsBreakdown: [
      { flag: '-o, --output', desc: 'Write to a file, instead of STDOUT', default: 'STDOUT' }
    ],
    sampleOutput: `(Successfully exported flattened rootfs to web-nginx-fs.tar - 41.8 MB)`,
    tips: ['Import an exported tarball back as a clean single-layer base image: `docker import web-nginx-fs.tar my-base:v1`.'],
    simulation: {
      type: 'storage-export',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Export Stream Dispatch',
          description: 'Client calls `GET /v1.43/containers/web-nginx/export`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/web-nginx/export HTTP/1.1...", 165) = 165',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /export'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'OverlayFS Merged Rootfs Tar Archiver',
          description: 'dockerd opens `/var/lib/docker/overlay2/[id]/merged` and traverses VFS directory tree, writing tar headers.',
          kernelLogs: '[dockerd] archiving container rootfs -> 41.8MB tar stream',
          hardwareActivity: 'VFS directory walk in RAM.',
          statusBadge: 'Tar Archiving'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'NVMe Sequential Write to Destination File',
          description: 'Streams data across PCIe bus to `web-nginx-fs.tar` at sequential flash storage bandwidth.',
          kernelLogs: '[nvme] write 41.8MB to sector 0x948210',
          hardwareActivity: 'High-speed DMA write.',
          statusBadge: '41.8MB Written'
        }
      ]
    }
  },
  {
    id: 'docker-history',
    name: 'Inspect Image Layer History & Sizes',
    command: 'docker history nginx:alpine',
    category: 'intermediate',
    tags: ['Images', 'Build', 'Inspection'],
    summary: 'Displays chronological Dockerfile instructions, layer creation times, and disk sizes that compose an image.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'history', type: 'subcommand', desc: 'Show the history of an image' },
      { text: 'nginx:alpine', type: 'image', desc: 'Target image' }
    ],
    detailedDescription: 'Inspects the layer tree metadata stored in image configuration JSON. Shows each command executed, intermediate layer IDs, and disk consumption per layer.',
    flagsBreakdown: [
      { flag: '--no-trunc', desc: 'Do not truncate command strings', default: 'false' },
      { flag: '-q, --quiet', desc: 'Only show numeric layer IDs', default: 'false' }
    ],
    sampleOutput: `IMAGE          CREATED        CREATED BY                                      SIZE      COMMENT
904b8cb1e405   2 days ago     CMD ["nginx" "-g" "daemon off;"]                0B        
<missing>      2 days ago     RUN /bin/sh -c apk add --no-cache curl nginx    35.2MB    
<missing>      3 weeks ago    /bin/sh -c #(nop) ADD file:2b86 in /            7.38MB`,
    tips: ['Use `docker history` to identify bloated RUN commands adding unexpected megabytes to your production images.'],
    simulation: {
      type: 'image-history',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'History API Query',
          description: 'Sends `GET /v1.43/images/nginx:alpine/history`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/images/nginx:alpine/history HTTP/1.1...", 160) = 160',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /history'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Parse Image Config JSON Layer Tree',
          description: 'dockerd extracts history array and matches diff_ids to layer storage size cache.',
          kernelLogs: '[dockerd] history parsed: 5 layers (42.6MB virtual size)',
          hardwareActivity: 'RAM JSON read.',
          statusBadge: 'Layer Tree Read'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Render Formatted Layer Table',
          description: 'Prints layer history table with commands and sizes to terminal.',
          kernelLogs: '[strace] write(1, "IMAGE          CREATED        CREATED BY...", 310) = 310',
          hardwareActivity: 'Stdout render.',
          statusBadge: 'History Table'
        }
      ]
    }
  },
  {
    id: 'docker-publish-all',
    name: 'Publish All Exposed Ports Automatically',
    command: 'docker run -d -P --name web-nginx nginx:alpine',
    category: 'intermediate',
    tags: ['Networking', 'Ports'],
    summary: 'Maps all EXPOSE ports declared in the Dockerfile to random high-numbered ephemeral ports on the host.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run container in background' },
      { text: '-P', type: 'flag', desc: '--publish-all: Publish all exposed ports to random host ports' },
      { text: '--name web-nginx', type: 'flag', desc: 'Container name' },
      { text: 'nginx:alpine', type: 'image', desc: 'Target image' }
    ],
    detailedDescription: 'Capital `-P` reads the `EXPOSE 80/tcp` directive from the image manifest and automatically binds it to an available host port in the ephemeral range (usually 32768–60999).',
    flagsBreakdown: [
      { flag: '-P, --publish-all', desc: 'Publish all exposed ports to random high ports', default: 'false' }
    ],
    sampleOutput: `f8a1928bce3d1720f1883aa3d81b95fcae1378d381ba9377a892b1cd0912ab8e11`,
    tips: ['Check the assigned random port immediately with `docker port web-nginx`.'],
    simulation: {
      type: 'networking-publish-all',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'PublishAllPorts Flag Serialization',
          description: 'Sets `"PublishAllPorts": true` in HostConfig JSON sent to daemon.',
          kernelLogs: '[strace] "HostConfig": {"PublishAllPorts": true}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'PublishAllPorts: true'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (Ephemeral Port Allocation)',
          title: 'Kernel Allocates Random Ephemeral Host Port',
          description: 'Kernel selects free host port 49153 and creates iptables DNAT rule routing traffic to container 172.17.0.2:80.',
          kernelLogs: '[kernel] port 49153 allocated from ip_local_port_range\n[iptables] -A DOCKER -p tcp --dport 49153 -j DNAT --to-destination 172.17.0.2:80',
          hardwareActivity: 'Netfilter memory table update.',
          statusBadge: 'Port 49153 -> 80'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Traffic Accessible on Host Port 49153',
          description: 'Incoming requests on `http://localhost:49153` flow directly to container port 80.',
          kernelLogs: '[tcp] incoming connection on host port 49153 forwarded to container eth0',
          hardwareActivity: 'Port listening active.',
          statusBadge: 'Forwarding Active'
        }
      ]
    }
  },
  {
    id: 'docker-network-disconnect',
    name: 'Disconnect Container from Network',
    command: 'docker network disconnect my_net web-nginx',
    category: 'intermediate',
    tags: ['Networking', 'Lifecycle'],
    summary: 'Detaches a container from a network dynamically, unlinking its virtual interface and removing DNS entries.',
    syntaxTokens: [
      { text: 'docker network', type: 'subcommand', desc: 'Manage networks' },
      { text: 'disconnect', type: 'subcommand', desc: 'Disconnect a container from a network' },
      { text: 'my_net', type: 'argument', desc: 'Target network name' },
      { text: 'web-nginx', type: 'argument', desc: 'Target container' }
    ],
    detailedDescription: 'Dynamically unbinds virtual ethernet endpoints. Netlink removes the virtual interface inside the container netns and de-registers the container name from embedded DNS.',
    flagsBreakdown: [
      { flag: '-f, --force', desc: 'Force the container to disconnect from a network', default: 'false' }
    ],
    sampleOutput: `(Successfully disconnected web-nginx from my_net)`,
    tips: ['Allows testing application failover scenarios without stopping the container.'],
    simulation: {
      type: 'network-disconnect',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Disconnect Request Dispatch',
          description: 'Client calls `POST /v1.43/networks/my_net/disconnect` with container ID.',
          kernelLogs: '[strace] write(3, "POST /v1.43/networks/my_net/disconnect HTTP/1.1...", 190) = 190',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /disconnect'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (Netlink)',
          title: 'Kernel Netlink Destroys veth Interface',
          description: 'rtnetlink socket fires `RTM_DELLINK` on secondary container virtual NIC `eth1`.',
          kernelLogs: '[kernel] netlink: RTM_DELLINK eth1 in netns 14820\n[kernel] br_custom: port eth1 entered disabled state',
          hardwareActivity: 'Kernel networking table cleanup.',
          statusBadge: 'veth Destroyed'
        },
        {
          stepNumber: 3,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Embedded DNS De-registration',
          description: 'dockerd deletes `web-nginx` DNS record from 127.0.0.11 embedded DNS server.',
          kernelLogs: '[dockerd] dns: deleted record web-nginx.my_net from 127.0.0.11',
          hardwareActivity: 'DNS table updated.',
          statusBadge: 'DNS Purged'
        }
      ]
    }
  },
  {
    id: 'docker-network-static-ip',
    name: 'Assign Static IP Address to Container',
    command: 'docker run -d --name web --network my_net --ip 172.28.0.10 nginx',
    category: 'intermediate',
    tags: ['Networking', 'IP', 'Configuration'],
    summary: 'Assigns a fixed, deterministic static IPv4 address to the container within a user-defined subnet.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--name web', type: 'flag', desc: 'Container name' },
      { text: '--network my_net', type: 'flag', desc: 'Custom user-defined network' },
      { text: '--ip 172.28.0.10', type: 'flag', desc: 'Static IPv4 address in subnet range' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Requires a user-defined network with a defined subnet. Docker IPAM reserves `172.28.0.10` and assigns it directly to container interface `eth0`.',
    flagsBreakdown: [
      { flag: '--ip', desc: 'IPv4 address (e.g. 172.28.0.10)', default: 'auto-allocated' }
    ],
    sampleOutput: `09a1b8e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d4f81`,
    tips: ['Ensure the IP is within the network\'s subnet and doesn\'t collide with gateway or broadcast addresses.'],
    simulation: {
      type: 'networking-static-ip',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Static IP Parameter Formatting',
          description: 'Client puts `EndpointSettings.IPAMConfig.IPv4Address: "172.28.0.10"` in container create JSON.',
          kernelLogs: '[strace] "IPAMConfig": {"IPv4Address": "172.28.0.10"}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'IPAMConfig JSON'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (IPAM Driver)',
          title: 'IP Address Reservation in IPAM Pool',
          description: 'Docker IPAM marks `172.28.0.10` as allocated in local subnet bitmask.',
          kernelLogs: '[dockerd] ipam: assigned static 172.28.0.10 in network my_net',
          hardwareActivity: 'RAM bitmask update.',
          statusBadge: 'IP Reserved'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Netlink Programs IP on eth0',
          description: 'Kernel configures `eth0` with static address `172.28.0.10/16` and sets default gateway.',
          kernelLogs: '[kernel] ip addr add 172.28.0.10/16 dev eth0\n[kernel] ip route add default via 172.28.0.1 dev eth0',
          hardwareActivity: 'Kernel routing table programmed.',
          statusBadge: 'eth0 Configured'
        }
      ]
    }
  },
  {
    id: 'docker-volume-inspect',
    name: 'Inspect Volume Mountpoint & Metadata',
    command: 'docker volume inspect my_vol',
    category: 'intermediate',
    tags: ['Storage', 'Volumes', 'Inspection'],
    summary: 'Outputs JSON metadata for a volume, displaying its host directory mountpoint, driver, and labels.',
    syntaxTokens: [
      { text: 'docker volume', type: 'subcommand', desc: 'Manage volumes' },
      { text: 'inspect', type: 'subcommand', desc: 'Display detailed information on one or more volumes' },
      { text: 'my_vol', type: 'argument', desc: 'Name of the volume' }
    ],
    detailedDescription: 'Allows finding the physical host filesystem path (typically `/var/lib/docker/volumes/[name]/_data`) where persistent container data is actually saved on the host drive.',
    flagsBreakdown: [
      { flag: '-f, --format', desc: 'Format output using Go template', default: 'json' }
    ],
    sampleOutput: `[
  {
    "CreatedAt": "2026-10-18T00:15:00Z",
    "Driver": "local",
    "Mountpoint": "/var/lib/docker/volumes/my_vol/_data",
    "Name": "my_vol"
  }
]`,
    tips: ['Extract just the mountpoint path in scripts: `docker volume inspect --format "{{ .Mountpoint }}" my_vol`.'],
    simulation: {
      type: 'volume-inspect',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Volume Query Request',
          description: 'Client calls `GET /v1.43/volumes/my_vol`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/volumes/my_vol HTTP/1.1...", 140) = 140',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /volumes/my_vol'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Volume Store DB Lookup',
          description: 'dockerd queries local volume metadata database and validates path existence.',
          kernelLogs: '[dockerd] volume my_vol found at /var/lib/docker/volumes/my_vol/_data',
          hardwareActivity: 'RAM DB lookup.',
          statusBadge: 'Path Resolved'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Output Formatted JSON',
          description: 'Prints volume JSON struct to stdout.',
          kernelLogs: '[strace] write(1, "[\n  {\n    \"CreatedAt\": ...", 220) = 220',
          hardwareActivity: 'Terminal print.',
          statusBadge: 'JSON Output'
        }
      ]
    }
  },
  {
    id: 'docker-bind-mount',
    name: 'Mount Host Directory (--mount bind)',
    command: 'docker run -d --mount type=bind,source=/data/app,target=/app/data nginx',
    category: 'intermediate',
    tags: ['Storage', 'Bind Mounts', 'Host'],
    summary: 'Maps a specific host directory directly into container filesystem using modern strict --mount syntax.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--mount type=bind', type: 'flag', desc: 'Explicit bind mount type' },
      { text: 'source=/data/app', type: 'flag', desc: 'Absolute host path' },
      { text: 'target=/app/data', type: 'flag', desc: 'Destination path inside container' },
      { text: 'nginx', type: 'image', desc: 'Target image' }
    ],
    detailedDescription: 'The `--mount` syntax is stricter and safer than `-v`. If `/data/app` does not exist on the host, `--mount` throws an immediate fatal error rather than silently creating an empty folder owned by root.',
    flagsBreakdown: [
      { flag: 'readonly', desc: 'Mount directory as read-only', default: 'read-write' }
    ],
    sampleOutput: `b8f9e2193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d381ba93`,
    tips: ['In Docker Compose and modern scripts, prefer `--mount` over `-v` for predictability and clear error messages.'],
    simulation: {
      type: 'storage-bind-mount',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Mount Parameter Validation',
          description: 'Client formats Mounts array with `Type: "bind"`, validating syntax before dispatching.',
          kernelLogs: '[strace] "Mounts": [{"Type": "bind", "Source": "/data/app", "Target": "/app/data"}]',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Mounts JSON'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (mount syscall)',
          title: 'Kernel Executes MS_BIND Syscall',
          description: 'Kernel invokes `mount("/data/app", "/app/data", NULL, MS_BIND|MS_REC, NULL)` attaching host directory into container MNT namespace.',
          kernelLogs: '[kernel] mount("/data/app", "/run/containerd/.../rootfs/app/data", NULL, MS_BIND, NULL) = 0',
          hardwareActivity: 'Kernel VFS mount table inode reference added.',
          statusBadge: 'MS_BIND Syscall'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Host Directory Live Inside Container',
          description: 'Any file written inside `/app/data` is written immediately to host `/data/app` at bare-metal NVMe speeds without OverlayFS copy-up.',
          kernelLogs: '[container] file write bypasses OverlayFS -> direct host inode write',
          hardwareActivity: 'Direct disk read/write.',
          statusBadge: 'Direct Host Access'
        }
      ]
    }
  },
  {
    id: 'docker-volume-backup',
    name: 'Backup Volume to Compressed Tarball',
    command: 'docker run --rm -v my_vol:/data -v "$(pwd)":/backup alpine tar czf /backup/backup.tar.gz -C /data .',
    category: 'intermediate',
    tags: ['Volumes', 'Backup', 'Storage'],
    summary: 'Spawns an ephemeral container to package volume data into a compressed tarball in the current working directory.',
    syntaxTokens: [
      { text: 'docker run --rm', type: 'command', desc: 'Run container and automatically remove it upon exit' },
      { text: '-v my_vol:/data', type: 'flag', desc: 'Mount persistent source volume to /data' },
      { text: '-v "$(pwd)":/backup', type: 'flag', desc: 'Bind mount current host directory to /backup' },
      { text: 'alpine', type: 'image', desc: 'Minimal utility image' },
      { text: 'tar czf /backup/backup.tar.gz -C /data .', type: 'command', desc: 'Tar compression command' }
    ],
    detailedDescription: 'The standard idiomatic Docker pattern for backing up volumes without stopping host daemons. An ephemeral container mounts both the target volume and current host directory, streaming compressed tar bytes into `backup.tar.gz`.',
    flagsBreakdown: [
      { flag: '--rm', desc: 'Automatically remove container when it exits', default: 'false' }
    ],
    sampleOutput: `(backup.tar.gz created in current working directory)`,
    tips: ['To restore: `docker run --rm -v my_vol:/data -v "$(pwd)":/backup alpine tar xzf /backup/backup.tar.gz -C /data`.'],
    simulation: {
      type: 'volume-backup',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Assemble Dual-Mount Ephemeral Spec',
          description: 'Client binds volume `my_vol` and current host folder into container create spec.',
          kernelLogs: '[strace] "Binds": ["my_vol:/data", "/home/user:/backup"]',
          hardwareActivity: 'CLI argument expansion.',
          statusBadge: 'Dual Binds'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Spawn Ephemeral Alpine Container',
          description: 'dockerd creates temporary container task and executes `tar czf`.',
          kernelLogs: '[containerd] msg="ephemeral task started for backup"',
          hardwareActivity: 'Temporary RAM process table.',
          statusBadge: 'Tar Execution'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage & CPU)',
          title: 'Direct DMA Tar Streaming & NVMe Write',
          description: 'CPU executes hardware-accelerated gzip compression, streaming bytes directly to host NVMe drive.',
          kernelLogs: '[nvme] write 12.4MB compressed tarball to host directory',
          hardwareActivity: 'Hardware gzip compression & NVMe write.',
          statusBadge: 'Backup Written'
        },
        {
          stepNumber: 4,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Container Destroys Itself on Exit',
          description: 'Kernel terminates PID and cleans up temporary container layer immediately.',
          kernelLogs: '[kernel] do_exit(0); container layer destroyed',
          hardwareActivity: 'Memory freed.',
          statusBadge: 'Ephemeral Purged'
        }
      ]
    }
  },
  {
    id: 'docker-volume-readonly',
    name: 'Mount Volume in Read-Only Mode (:ro)',
    command: 'docker run -d -v my_vol:/app/data:ro nginx',
    category: 'intermediate',
    tags: ['Storage', 'Volumes', 'Security'],
    summary: 'Mounts a persistent volume with read-only enforcement (:ro), preventing container processes from modifying data.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '-v my_vol:/app/data:ro', type: 'flag', desc: 'Volume mount with read-only modifier (:ro)' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Instructs the Linux VFS layer to mount the volume with `MS_RDONLY`. Any process inside the container attempting to write, modify, or delete files receives an immediate `EROFS` (Read-only file system) kernel error.',
    flagsBreakdown: [
      { flag: ':ro', desc: 'Read-only mode modifier for volume bind', default: ':rw (read-write)' }
    ],
    sampleOutput: `09a1b8e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d4f81`,
    tips: ['Always use `:ro` when mounting certificates, public keys, or static configuration files.'],
    simulation: {
      type: 'volume-readonly',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Read-Only Flag Parse',
          description: 'Formats bind string with mode `ro`.',
          kernelLogs: '[strace] "Binds": ["my_vol:/app/data:ro"]',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Mode: ro'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (mount syscall)',
          title: 'Kernel mount() Syscall with MS_RDONLY Flag',
          description: 'Kernel mounts volume directory into container MNT namespace with `MS_RDONLY | MS_BIND`.',
          kernelLogs: '[kernel] mount("/var/lib/docker/volumes/my_vol/_data", ".../app/data", NULL, MS_BIND|MS_RDONLY, NULL) = 0',
          hardwareActivity: 'VFS mount table marked read-only.',
          statusBadge: 'MS_RDONLY Active'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Filesystem Writes Trapped & Denied',
          description: 'Application can read files freely; any write attempt returns `EROFS: Read-only file system`.',
          kernelLogs: '[container] open("/app/data/file.txt", O_WRONLY) = -1 EROFS (Read-only file system)',
          hardwareActivity: 'Safe protected reads.',
          statusBadge: 'EROFS Protection'
        }
      ]
    }
  },
  {
    id: 'docker-volumes-from',
    name: 'Share Volumes From Another Container',
    command: 'docker run -d --volumes-from web-nginx alpine',
    category: 'intermediate',
    tags: ['Storage', 'Volumes', 'Collaboration'],
    summary: 'Inherits and shares all volume and bind mounts from an existing container instance.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--volumes-from web-nginx', type: 'flag', desc: 'Mount volumes from the specified container(s)' },
      { text: 'alpine', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Copies mount point specifications from the source container (`web-nginx`) directly into the new container\'s mount namespace, enabling sidecar patterns such as log shippers or monitoring agents.',
    flagsBreakdown: [
      { flag: '--volumes-from', desc: 'Mount volumes from container (supports :ro / :rw modifier)', default: 'none' }
    ],
    sampleOutput: `b8f9e2193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d381ba93`,
    tips: ['Useful for running backup sidecars that need access to another container\'s active volume data.'],
    simulation: {
      type: 'volumes-from',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'VolumesFrom Array Format',
          description: 'Client passes `VolumesFrom: ["web-nginx"]` in HostConfig.',
          kernelLogs: '[strace] "VolumesFrom": ["web-nginx"]',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'VolumesFrom Array'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Clone Mount Descriptors in Daemon',
          description: 'dockerd inspects `web-nginx` mount points and replicates identical mount structures for the new container.',
          kernelLogs: '[dockerd] copying 2 mounts from web-nginx to new container',
          hardwareActivity: 'RAM mount metadata replication.',
          statusBadge: 'Mounts Cloned'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Shared Inode Kernel Binding',
          description: 'Both container namespaces mount the same host disk inodes.',
          kernelLogs: '[kernel] shared inode mount bound to child MNT namespace',
          hardwareActivity: 'Shared memory page cache.',
          statusBadge: 'Shared Mounts'
        }
      ]
    }
  },

  // ==================== NEW ADVANCED COMMANDS ====================
  {
    id: 'docker-cpuset-cpus',
    name: 'Hardware CPU Core Pinning & NUMA Affinity',
    command: 'docker run -d --cpuset-cpus="0,1" nginx:alpine',
    category: 'advanced',
    tags: ['CPU', 'Hardware', 'Performance', 'Cgroups'],
    summary: 'Pins container process execution exclusively to physical CPU hardware cores 0 and 1, avoiding thread migration latency.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--cpuset-cpus="0,1"', type: 'flag', desc: 'Hardware CPU cores allowed for execution' },
      { text: 'nginx:alpine', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Programs the Linux `cpuset` cgroup controller (`cpuset.cpus`). The kernel scheduler will NEVER schedule container threads onto any other physical cores. Critical for low-latency financial trading and high-throughput databases.',
    flagsBreakdown: [
      { flag: '--cpuset-cpus', desc: 'CPUs in which to allow execution (0-3, 0,1)', default: 'all host CPUs' }
    ],
    sampleOutput: `9b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d381ba93b8f9e219`,
    tips: ['Combine `--cpuset-cpus` with `--cpuset-mems` on multi-socket servers to optimize Non-Uniform Memory Access (NUMA) cache locality!'],
    simulation: {
      type: 'cpu-pinning',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'CpusetCpus Configuration Serialization',
          description: 'Client packages `CpusetCpus: "0,1"` in HostConfig JSON payload.',
          kernelLogs: '[strace] "HostConfig": {"CpusetCpus": "0,1"}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'CpusetCpus: "0,1"'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (runc)',
          title: 'Write cpuset.cpus in Cgroups Hierarchy',
          description: 'runc writes `"0,1"` to `/sys/fs/cgroup/docker/[id]/cpuset.cpus`.',
          kernelLogs: '[runc] write /sys/fs/cgroup/docker/9b21/cpuset.cpus "0,1"',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'cpuset.cpus Programmed'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Physical CPU Cores)',
          title: 'Hardware Execution Affinity Lock',
          description: 'Kernel CFS scheduler locks thread execution strictly to CPU Core #0 and Core #1.',
          kernelLogs: '[kernel/sched] task 14820 affinity mask set to 0x00000003 (CPUs 0, 1)',
          hardwareActivity: 'Physical CPU Cores 0 and 1 execute instructions; Cores 2-15 untouched.',
          statusBadge: 'Cores 0 & 1 Locked'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Zero Cache Eviction Latency Execution',
          description: 'Nginx worker processes run with optimal hardware instruction pipelining and predictable low latency.',
          kernelLogs: '[nginx] worker processes running on CPU cores 0 and 1',
          hardwareActivity: 'Zero cross-core migration latency.',
          statusBadge: 'Peak Hardware Efficiency'
        }
      ]
    }
  },
  {
    id: 'docker-cpu-shares',
    name: 'Proportional CFS CPU Weight (--cpu-shares)',
    command: 'docker run -d --cpu-shares=512 nginx:alpine',
    category: 'advanced',
    tags: ['CPU', 'Cgroups', 'Performance'],
    summary: 'Assigns relative CPU execution priority (512 vs standard 1024) during periods of host CPU saturation.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--cpu-shares=512', type: 'flag', desc: 'CFS CPU shares weight (default 1024)' },
      { text: 'nginx:alpine', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Sets `cpu.weight` in cgroups v2. When the host CPU is idle, the container can use 100% of CPU cycles. However, during CPU contention, a container with 512 shares receives half the CPU clock cycles of a container with 1024 shares.',
    flagsBreakdown: [
      { flag: '-c, --cpu-shares', desc: 'CPU shares (relative weight)', default: '1024' }
    ],
    sampleOutput: `09a1b8e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d4f81`,
    tips: ['Use lower CPU shares (e.g. 256) for background batch workers and higher shares (2048) for user-facing web servers.'],
    simulation: {
      type: 'cpu-shares',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'CpuShares JSON Payload Format',
          description: 'Client writes `CpuShares: 512` in HostConfig.',
          kernelLogs: '[strace] "HostConfig": {"CpuShares": 512}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'CpuShares: 512'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups v2 cpu.weight)',
          title: 'Kernel CFS Scheduler Weight Re-calculation',
          description: 'Kernel writes weight `50` to `cpu.weight` (cgroups v2 scale 1-10000).',
          kernelLogs: '[kernel/cgroup] cpu.weight set to 50 (proportional 512/1024)',
          hardwareActivity: 'CFS scheduler weight recalculation.',
          statusBadge: 'cpu.weight: 50'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (CPU Timeslices)',
          title: 'Fair Hardware Timeslice Partitioning',
          description: 'CPU timer interrupts allocate 1:2 timeslice distribution when multiple containers compete for cores.',
          kernelLogs: '[cpu] hardware timer interrupt tick enforces CFS proportional timeslices',
          hardwareActivity: 'Proportional clock cycles executed.',
          statusBadge: 'Proportional CFS'
        }
      ]
    }
  },
  {
    id: 'docker-memory-swap',
    name: 'Memory + Swap Combined Ceiling',
    command: 'docker run -d --memory="1g" --memory-swap="2g" nginx:alpine',
    category: 'advanced',
    tags: ['Memory', 'Cgroups', 'Swap'],
    summary: 'Constrains container to 1GB physical RAM plus 1GB swap space (total 2GB virtual memory envelope).',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--memory="1g"', type: 'flag', desc: 'Hard physical RAM ceiling (1073741824 bytes)' },
      { text: '--memory-swap="2g"', type: 'flag', desc: 'Total memory + swap ceiling (2147483648 bytes)' },
      { text: 'nginx:alpine', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Configures `memory.max` (1GB) and `memory.swap.max` (1GB) in cgroups v2. When the container allocates >1GB RAM, the Linux kernel paging daemon swaps inactive pages out to host swap space on disk without triggering OOM-kill until total virtual memory hits 2GB.',
    flagsBreakdown: [
      { flag: '-m, --memory', desc: 'Memory limit', default: 'unlimited' },
      { flag: '--memory-swap', desc: 'Swap limit equal to memory plus swap, -1 for unlimited', default: '2x memory' }
    ],
    sampleOutput: `d81ba9377a892b1cd0912ab8e11b8f9e2193b2184a4504193ec881c6d1720f18`,
    tips: ['Set `--memory-swap` equal to `--memory` (e.g. `-m 1g --memory-swap 1g`) to disable swap entirely for predictable latency!'],
    simulation: {
      type: 'memory-swap',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Memory Swap Byte Calculations',
          description: 'Converts 1g to 1073741824 and 2g to 2147483648 bytes.',
          kernelLogs: '[strace] "Memory": 1073741824, "MemorySwap": 2147483648',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Memory & Swap JSON'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups v2 memory.swap.max)',
          title: 'Kernel Memory Controller Programs Limits',
          description: 'Writes limits into `/sys/fs/cgroup/memory.max` and `memory.swap.max`.',
          kernelLogs: '[kernel] write memory.max "1073741824"\n[kernel] write memory.swap.max "1073741824"',
          hardwareActivity: 'Memory controller limit registers set.',
          statusBadge: 'Limits Written'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (RAM & NVMe Swap)',
          title: 'Kernel Pager Swaps Inactive Pages to NVMe',
          description: 'When RAM exceeds 1GB, kernel kswapd thread writes inactive anonymous memory pages to host NVMe swap partition.',
          kernelLogs: '[kernel/swap] kswapd0: paged out 128 MB anonymous pages to swapfile',
          hardwareActivity: 'NVMe swap write cycle; RAM freed.',
          statusBadge: 'Paging to Swap'
        }
      ]
    }
  },
  {
    id: 'docker-memory-reservation',
    name: 'Soft Memory Reservation (--memory-reservation)',
    command: 'docker run -d --memory-reservation="500m" --memory="1g" nginx:alpine',
    category: 'advanced',
    tags: ['Memory', 'Cgroups', 'Resilience'],
    summary: 'Sets a soft memory reservation (500MB) alongside a hard ceiling (1GB), triggering proactive reclamation under host memory pressure.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--memory-reservation="500m"', type: 'flag', desc: 'Soft memory threshold (triggers early reclamation)' },
      { text: '--memory="1g"', type: 'flag', desc: 'Hard limit (triggers OOM-kill if exceeded)' },
      { text: 'nginx:alpine', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Programs `memory.low` or `memory.high` in cgroups v2. Container can freely use up to 1GB RAM during normal operation. When the host encounters low memory conditions, the kernel aggressively trims page caches of containers exceeding their 500MB reservation.',
    flagsBreakdown: [
      { flag: '--memory-reservation', desc: 'Memory soft limit (format: <number>[<unit>])', default: 'none' }
    ],
    sampleOutput: `b8f9e2193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d381ba93`,
    tips: ['Crucial for multi-tenant servers to guarantee essential containers maintain their reserved RAM while allowing elastic burst usage.'],
    simulation: {
      type: 'memory-reservation',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'MemoryReservation JSON Serialization',
          description: 'Client writes `MemoryReservation: 524288000` in HostConfig.',
          kernelLogs: '[strace] "MemoryReservation": 524288000, "Memory": 1073741824',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Soft 500M / Hard 1G'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups v2 memory.high)',
          title: 'Kernel Sets Elastic Memory Boundaries',
          description: 'Writes 524288000 to `memory.high` and 1073741824 to `memory.max`.',
          kernelLogs: '[kernel] write memory.high "524288000"\n[kernel] write memory.max "1073741824"',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'memory.high Configured'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (RAM Controller)',
          title: 'Elastic RAM Burst & Graceful Page Reclaim',
          description: 'Container bursts to 800MB without killing process; kernel gently throttles memory allocations back towards 500MB.',
          kernelLogs: '[kernel/mm] memory.high exceeded -> asynchronous page reclaim invoked',
          hardwareActivity: 'Page cache reclaimed without OOM kill.',
          statusBadge: 'Graceful Reclaim'
        }
      ]
    }
  },
  {
    id: 'docker-oom-kill-disable',
    name: 'Disable Kernel OOM Killer (--oom-kill-disable)',
    command: 'docker run -d --oom-kill-disable --memory="1g" nginx:alpine',
    category: 'advanced',
    tags: ['Memory', 'Kernel', 'Resilience'],
    summary: 'Prevents the Linux kernel Out-Of-Memory killer from terminating container processes when memory limit is breached.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--oom-kill-disable', type: 'flag', desc: 'Disable OOM Killer for the container (requires -m)' },
      { text: '--memory="1g"', type: 'flag', desc: 'Memory limit (mandatory with oom-kill-disable)' },
      { text: 'nginx:alpine', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'When the container reaches its 1GB memory limit, instead of the kernel firing SIGKILL to terminate PID 1, the container\'s processes are placed into an uninterruptible sleep state (waiting for memory to free up) until the host operator intervenes.',
    flagsBreakdown: [
      { flag: '--oom-kill-disable', desc: 'Disable OOM Killer for the container', default: 'false' }
    ],
    sampleOutput: `4a819bce3d1720f1883aa3d81b95fcae1378d381ba9377a892b1cd0912ab8e11`,
    tips: ['CAUTION: Only use with `--memory` specified. Disabling OOM on unlimited memory containers can crash the entire physical host!'],
    simulation: {
      type: 'oom-kill-disable',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'OomKillDisable Flag Parse',
          description: 'Sets `"OomKillDisable": true` in HostConfig.',
          kernelLogs: '[strace] "OomKillDisable": true, "Memory": 1073741824',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'OOM Kill Disabled'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroup.oom.group)',
          title: 'Kernel Locks OOM Killer Behavior',
          description: 'Kernel writes `1` to `memory.oom_control` (cgroups v1) or `cgroup.oom.group`.',
          kernelLogs: '[kernel] memory.oom_control: oom_kill_disable set to 1',
          hardwareActivity: 'Kernel OOM subsystem flag updated.',
          statusBadge: 'OOM Disabled in Kernel'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Processes Freeze in D-State Rather Than Dying',
          description: 'When 1GB is exhausted, process is halted in uninterruptible sleep rather than receiving fatal SIGKILL.',
          kernelLogs: '[kernel] memory cgroup out of memory; task 14820 paused awaiting memory release',
          hardwareActivity: 'Process state D; memory preserved.',
          statusBadge: 'Processes Frozen in RAM'
        }
      ]
    }
  },
  {
    id: 'docker-tmpfs-mount',
    name: 'In-Memory Volatile Storage (--tmpfs)',
    command: 'docker run -d --tmpfs /app/cache:rw,size=64m,mode=1777 nginx',
    category: 'advanced',
    tags: ['Storage', 'RAM', 'Performance', 'tmpfs'],
    summary: 'Mounts an ephemeral volatile RAM disk inside the container, achieving microsecond read/write speeds with zero SSD wear.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--tmpfs /app/cache', type: 'flag', desc: 'Mount temporary in-memory filesystem at /app/cache' },
      { text: ':rw,size=64m,mode=1777', type: 'flag', desc: 'Options: read-write, max 64MB RAM ceiling, permissions' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'A `tmpfs` mount exists purely in the host\'s DDR RAM page cache. Files are never written to NVMe/SSD storage. Ideal for secret tokens, session keys, and caching temporary files that should disappear permanently when the container stops.',
    flagsBreakdown: [
      { flag: '--tmpfs', desc: 'Mount a tmpfs directory', default: 'none' }
    ],
    sampleOutput: `d81ba9377a892b1cd0912ab8e11b8f9e2193b2184a4504193ec881c6d1720f18`,
    tips: ['Use tmpfs for security-sensitive data so confidential bytes are never persisted to disk flash memory!'],
    simulation: {
      type: 'storage-tmpfs',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Tmpfs Parameter Formatting',
          description: 'Packages Tmpfs mount configuration with `size=67108864` (64MB) in HostConfig.',
          kernelLogs: '[strace] "Tmpfs": {"/app/cache": "rw,size=64m,mode=1777"}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Tmpfs 64MB'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (DDR RAM)',
          title: 'DDR RAM Page Frame Allocation',
          description: 'Memory controller allocates DDR page frames directly for filesystem storage blocks. Physical NVMe disk is completely bypassed.',
          kernelLogs: '[kernel] mount("tmpfs", "/app/cache", "tmpfs", MS_NODEV|MS_NOSUID, "size=67108864") = 0',
          hardwareActivity: 'RAM DDR5 memory pages mapped into container VFS.',
          statusBadge: 'DDR5 RAM Mapped'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Microsecond Read/Write Throughput',
          description: 'Container reads and writes files at full RAM bus speed with 0 IOPS latency.',
          kernelLogs: '[container] write 1024 bytes to /app/cache/sess_912 -> RAM page updated in 0.04us',
          hardwareActivity: 'Memory controller direct access.',
          statusBadge: 'Sub-Microsecond Speed'
        }
      ]
    }
  },
  {
    id: 'docker-network-host',
    name: 'Host Networking Mode (Zero-Overhead)',
    command: 'docker run -d --network host nginx',
    category: 'advanced',
    tags: ['Networking', 'Host', 'Performance'],
    summary: 'Removes network namespace isolation entirely: container shares host IP, ports, and physical NIC with 0% NAT translation latency.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--network host', type: 'flag', desc: 'Share host network namespace' },
      { text: 'nginx', type: 'image', desc: 'Target image' }
    ],
    detailedDescription: 'When `--network host` is used, the container does NOT receive its own private IP address or `veth` interface. The `-p` port mapping option is ignored because the application binds directly to the host\'s physical network interface on port 80.',
    flagsBreakdown: [
      { flag: '--network', desc: 'Set network mode', default: 'bridge' }
    ],
    sampleOutput: `35a88802559d18e9a2b10912ab8e11b8f9e2193b2184a4504193ec881c6d1720`,
    tips: ['Provides the absolute highest network throughput (line-rate 100GbE) because iptables NAT and virtual bridges are completely bypassed.'],
    simulation: {
      type: 'networking-host',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'NetworkMode: "host" Serialization',
          description: 'Sets `"NetworkMode": "host"` in HostConfig JSON payload.',
          kernelLogs: '[strace] "NetworkMode": "host"',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'NetworkMode: host'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (clone syscall)',
          title: 'Skip CLONE_NEWNET Syscall',
          description: 'runc invokes `clone()` WITHOUT `CLONE_NEWNET`. The child process inherits the host network namespace.',
          kernelLogs: '[kernel] clone(CLONE_NEWPID|CLONE_NEWNS|CLONE_NEWUTS) -> CLONE_NEWNET omitted',
          hardwareActivity: 'Zero virtual network bridges created.',
          statusBadge: 'CLONE_NEWNET Omitted'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (NIC)',
          title: 'Direct Hardware NIC DMA Socket Binding',
          description: 'Application binds socket directly to the physical motherboard NIC IP without bridge or iptables translation.',
          kernelLogs: '[nic] eth0: port 80 socket bound directly by PID 14820',
          hardwareActivity: 'Direct hardware NIC interrupts.',
          statusBadge: 'Bare-Metal NIC Access'
        }
      ]
    }
  },
  {
    id: 'docker-network-container',
    name: 'Share Container Network Namespace (Pod Pattern)',
    command: 'docker run -d --network container:web-nginx alpine',
    category: 'advanced',
    tags: ['Networking', 'Pods', 'Architecture'],
    summary: 'Shares the identical network stack and localhost loopback of another container (the Kubernetes Pod architecture).',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--network container:web-nginx', type: 'flag', desc: 'Join target container\'s network namespace' },
      { text: 'alpine', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Both containers share the exact same IP address, port space, and `127.0.0.1` localhost loopback interface. A process in `alpine` can communicate with `web-nginx` directly over `localhost:80` with zero network overhead.',
    flagsBreakdown: [
      { flag: '--network', desc: 'Set network mode to container:<name|id>', default: 'bridge' }
    ],
    sampleOutput: `4e918bcae31720f1883aa3d81b95fcae1378d381ba9377a892b1cd0912ab8e11`,
    tips: ['This is the exact underlying Linux mechanism Kubernetes uses to group multiple containers into a single Pod!'],
    simulation: {
      type: 'networking-container-join',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'NetworkMode: container:<id> Format',
          description: 'Sets NetworkMode to target container identifier.',
          kernelLogs: '[strace] "NetworkMode": "container:web-nginx"',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Container NetMode'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (setns net)',
          title: 'Kernel setns() Joins Target Network Namespace',
          description: 'Kernel calls `setns()` referencing `/proc/[target-pid]/ns/net`. Both containers share the same virtual interface.',
          kernelLogs: '[kernel] openat(AT_FDCWD, "/proc/14820/ns/net", O_RDONLY) = 5\n[kernel] setns(5, CLONE_NEWNET) = 0',
          hardwareActivity: 'Kernel network namespace table descriptor shared.',
          statusBadge: 'setns(CLONE_NEWNET)'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Localhost Inter-Process Networking Active',
          description: 'Both containers reach each other over `127.0.0.1` at instantaneous memory bus speeds.',
          kernelLogs: '[container] curl http://127.0.0.1:80 -> HTTP 200 OK via shared loopback',
          hardwareActivity: 'Zero-copy socket transfer.',
          statusBadge: 'Shared Localhost 127.0.0.1'
        }
      ]
    }
  },
  {
    id: 'docker-network-macvlan',
    name: 'Hardware LAN Bridging with Macvlan Driver',
    command: 'docker network create -d macvlan --subnet=192.168.1.0/24 --gateway=192.168.1.1 -o parent=eth0 my_macvlan',
    category: 'advanced',
    tags: ['Networking', 'Hardware', 'MAC', 'Enterprise'],
    summary: 'Assigns each container a real, unique physical MAC address, making them appear as physical machines on your LAN.',
    syntaxTokens: [
      { text: 'docker network create', type: 'command', desc: 'Create network' },
      { text: '-d macvlan', type: 'flag', desc: 'Driver: macvlan' },
      { text: '--subnet=192.168.1.0/24', type: 'flag', desc: 'Physical LAN subnet' },
      { text: '--gateway=192.168.1.1', type: 'flag', desc: 'Physical LAN router gateway' },
      { text: '-o parent=eth0', type: 'flag', desc: 'Physical host NIC interface' },
      { text: 'my_macvlan', type: 'argument', desc: 'Network name' }
    ],
    detailedDescription: 'Macvlan creates virtual sub-interfaces directly attached to the physical ethernet adapter (`eth0`). Containers receive real IP addresses directly from your physical corporate router or DHCP server and respond to physical ARP requests.',
    flagsBreakdown: [
      { flag: '-o parent', desc: 'Physical host interface (e.g. eth0, eno1)', default: 'mandatory' }
    ],
    sampleOutput: `4f8109a1b8e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d`,
    tips: ['Ensure the physical switch port supports promiscuous mode / MAC spoofing if running on virtualized ESXi/Proxmox hosts.'],
    simulation: {
      type: 'macvlan-network',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Macvlan Driver Spec Dispatch',
          description: 'Client calls `POST /v1.43/networks/create` with driver `macvlan` and parent `eth0`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/networks/create HTTP/1.1...", 280) = 280',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'Driver: macvlan'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (macvlan driver)',
          title: 'Kernel Registers Macvlan Sub-Interface on eth0',
          description: 'Kernel attaches macvlan endpoint to parent `eth0`. Host NIC begins filtering multiple hardware unicast MACs.',
          kernelLogs: '[kernel] macvlan: registered sub-interface on physical eth0 (mode: bridge)',
          hardwareActivity: 'Physical NIC hardware MAC filter updated.',
          statusBadge: 'Hardware MAC Sub-interface'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (NIC)',
          title: 'Direct Ethernet Frame Transmission',
          description: 'Packets bypass host iptables NAT entirely, transmitting raw 802.3 Ethernet frames across physical switch wire.',
          kernelLogs: '[nic] eth0: ARP reply dispatched for container MAC 02:42:c0:a8:01:0a',
          hardwareActivity: 'Physical NIC DMA transmission.',
          statusBadge: 'Direct LAN Frames'
        }
      ]
    }
  },
  {
    id: 'docker-update-resources',
    name: 'Live Dynamic Hardware Limits Tuning',
    command: 'docker update --cpus="4" --memory="2g" web-nginx',
    category: 'advanced',
    tags: ['Performance', 'Live Tuning', 'Cgroups', 'Hardware'],
    summary: 'Dynamically scales CPU and RAM limits on a live running container without causing service downtime or restart.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'update', type: 'subcommand', desc: 'Update configuration of one or more containers' },
      { text: '--cpus="4"', type: 'flag', desc: 'Increase CPU quota to 4 cores' },
      { text: '--memory="2g"', type: 'flag', desc: 'Increase RAM limit to 2 Gigabytes' },
      { text: 'web-nginx', type: 'argument', desc: 'Target running container' }
    ],
    detailedDescription: 'Translates this command into direct updates to the active cgroups controller filesystem (`/sys/fs/cgroup/`). The Linux kernel instantly applies the new CPU CFS quotas and memory thresholds without dropping active network connections.',
    flagsBreakdown: [
      { flag: '--cpus', desc: 'Number of CPUs', default: 'current' },
      { flag: '-m, --memory', desc: 'Memory limit', default: 'current' }
    ],
    sampleOutput: `web-nginx`,
    tips: ['Ideal for production autoscalers handling sudden traffic surges without terminating running user sessions!'],
    simulation: {
      type: 'cgroups-live-update',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Update Resources Request',
          description: 'Sends `POST /v1.43/containers/web-nginx/update` with new memory (2147483648) and CPU values.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/web-nginx/update HTTP/1.1...", 240) = 240',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /update'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Write New Cgroups Limits On The Fly',
          description: 'dockerd opens `/sys/fs/cgroup/docker/[id]/` and writes new values into `cpu.max` and `memory.max`.',
          kernelLogs: '[dockerd] write memory.max "2147483648"\n[dockerd] write cpu.max "400000 100000"',
          hardwareActivity: 'Live sysfs writes.',
          statusBadge: 'cgroup.max Updated'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware Layer',
          title: 'Kernel Scheduler Instantly Unlocks Cores',
          description: 'CFS scheduler expands CPU timeslice allocation to 4 cores. MMU raises the hardware page frame threshold.',
          kernelLogs: '[kernel/sched] CFS bandwidth timer updated: quota 400ms per 100ms\n[kernel/mmu] memory.max limit raised to 2048 MB',
          hardwareActivity: '4 CPU cores concurrently executing container threads.',
          statusBadge: '4 Cores Unlocked'
        }
      ]
    }
  },
  {
    id: 'docker-bulk-kill',
    name: 'Bulk Kill All Running Containers',
    command: 'docker kill $(docker ps -q)',
    category: 'advanced',
    tags: ['Containers', 'Lifecycle', 'Bulk', 'Cleanup'],
    summary: 'Extracts all active container IDs in a subshell and transmits immediate SIGKILL (signal 9) to terminate them simultaneously.',
    syntaxTokens: [
      { text: 'docker kill', type: 'subcommand', desc: 'Kill one or more running containers' },
      { text: '$(docker ps -q)', type: 'argument', desc: 'Subshell evaluating to list of all active container IDs' }
    ],
    detailedDescription: 'Shorthand for stopping all workloads instantly in test or development environments. Bypasses graceful SIGTERM timeout, instructing the kernel to immediately reclaim CPU registers and unmap process memory.',
    flagsBreakdown: [
      { flag: '-s, --signal', desc: 'Signal to send to the container', default: 'SIGKILL' }
    ],
    sampleOutput: `b8f9e2193b21
e31c7901da42
4e918bcae317`,
    tips: ['In development when testing clean slates, this stops everything in under 1 second.'],
    simulation: {
      type: 'bulk-kill',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Subshell Evaluates Active Container IDs',
          description: 'Shell executes `docker ps -q`, extracts container IDs, and sends parallel `POST /containers/[id]/kill?signal=SIGKILL` requests.',
          kernelLogs: '[strace] pipe() & fork() subshell -> container IDs [b8f9e2, e31c79, 4e918b]',
          hardwareActivity: 'Subshell process evaluation.',
          statusBadge: 'IDs Extracted'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Simultaneous SIGKILL (Signal 9) Delivery',
          description: 'Kernel delivers uncatchable `SIGKILL` to all container PID 1 processes simultaneously. Tasks are terminated immediately.',
          kernelLogs: '[kernel] send_signal(9, 14820) -> force termination\n[kernel] send_signal(9, 15120) -> force termination',
          hardwareActivity: 'CPU MMU tears down process page tables.',
          statusBadge: 'Instant SIGKILL'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Return List of Terminated Container IDs',
          description: 'Prints confirmed killed container IDs.',
          kernelLogs: '[strace] write(1, "b8f9e2193b21\\ne31c7901da42\\n...", 36) = 36',
          hardwareActivity: 'Terminal print.',
          statusBadge: 'All Killed'
        }
      ]
    }
  },
  {
    id: 'docker-bulk-rm',
    name: 'Bulk Remove All Stopped Containers',
    command: 'docker rm $(docker ps -a -q)',
    category: 'advanced',
    tags: ['Containers', 'Cleanup', 'Bulk', 'Storage'],
    summary: 'Deletes all stopped containers and their unmounted ephemeral write layers in a single bulk cleanup command.',
    syntaxTokens: [
      { text: 'docker rm', type: 'subcommand', desc: 'Remove one or more containers' },
      { text: '$(docker ps -a -q)', type: 'argument', desc: 'Subshell returning all container IDs' }
    ],
    detailedDescription: 'Extracts all container identifiers via `docker ps -a -q`, skips currently active ones (unless `-f` is passed), and deletes metadata JSONs and ephemeral OverlayFS upperdirs from host SSD.',
    flagsBreakdown: [
      { flag: '-f, --force', desc: 'Force removal of running containers', default: 'false' },
      { flag: '-v, --volumes', desc: 'Remove anonymous volumes associated with the container', default: 'false' }
    ],
    sampleOutput: `b8f9e2193b21
e31c7901da42`,
    tips: ['Pair with `docker kill $(docker ps -q) && docker rm $(docker ps -a -q)` to completely clear local container state.'],
    simulation: {
      type: 'bulk-rm',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Subshell Evaluates Container IDs',
          description: 'Client calls `GET /containers/json?all=1&quiet=1` and feeds IDs into DELETE batch.',
          kernelLogs: '[strace] pipe() & execve("docker", ["ps", "-a", "-q"], ...)',
          hardwareActivity: 'Subshell argument pipe.',
          statusBadge: 'Batch IDs'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Unmount Ephemeral Rootfs Layers',
          description: 'dockerd removes container runtime state directories and unregisters entries.',
          kernelLogs: '[dockerd] removed 8 stopped containers',
          hardwareActivity: 'RAM container table cleanup.',
          statusBadge: 'Metadata Purged'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'NVMe Flash Sector Discard (TRIM)',
          description: 'Host NVMe controller executes TRIM commands across deleted container diff layers.',
          kernelLogs: '[nvme] blkdiscard issued for 1.8 GB container layer blocks',
          hardwareActivity: 'Flash memory blocks freed.',
          statusBadge: 'SSD Blocks Freed'
        }
      ]
    }
  },
  {
    id: 'docker-image-prune-all',
    name: 'Purge All Unreferenced Images (-a)',
    command: 'docker image prune -a -f',
    category: 'advanced',
    tags: ['Images', 'Cleanup', 'Storage'],
    summary: 'Purges all unused images (both untagged dangling images AND images without running containers) from graph storage.',
    syntaxTokens: [
      { text: 'docker image', type: 'subcommand', desc: 'Manage images' },
      { text: 'prune', type: 'subcommand', desc: 'Remove unused images' },
      { text: '-a, --all', type: 'flag', desc: 'Remove all images not referenced by at least one container' },
      { text: '-f, --force', type: 'flag', desc: 'Do not prompt for confirmation' }
    ],
    detailedDescription: 'By default, `docker image prune` only deletes dangling `<none>` images. Adding `-a` purges every downloaded base image (Ubuntu, Node, Nginx) that is not currently running in an active container, reclaiming gigabytes of disk.',
    flagsBreakdown: [
      { flag: '-a, --all', desc: 'Remove all unused images', default: 'false' },
      { flag: '-f, --force', desc: 'Do not prompt for confirmation', default: 'false' }
    ],
    sampleOutput: `Deleted Images:
untagged: node:20-alpine
deleted: sha256:674a589312b9
untagged: redis:7
deleted: sha256:e31c7901da42

Total reclaimed space: 5.42GB`,
    tips: ['Run before major backups or system migrations to slim down the `/var/lib/docker/` directory footprint.'],
    simulation: {
      type: 'image-prune-all',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Prune API Request with all=1',
          description: 'Client calls `POST /v1.43/images/prune?filters={"dangling":["false"]}`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/images/prune?all=1 HTTP/1.1...", 180) = 180',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /images/prune'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Traverse Dependency DAG Graph',
          description: 'dockerd identifies all images not referenced by containers in `container.Store` and marks unreferenced layers.',
          kernelLogs: '[dockerd] unlinking 24 image layers (5.42GB total)',
          hardwareActivity: 'RAM graph traversal.',
          statusBadge: '24 Layers Unlinked'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'Mass NVMe SSD Sector Discard',
          description: 'Reclaims 5.42GB of flash NAND storage via host storage controller discard requests.',
          kernelLogs: '[nvme] blkdiscard: 5.42 GB unmapped across 1,420,000 sectors',
          hardwareActivity: 'Hardware NAND flash garbage collection.',
          statusBadge: '5.42GB Reclaimed'
        }
      ]
    }
  },
  {
    id: 'docker-build-git',
    name: 'Build Image Directly from Git URL',
    command: 'docker build https://github.com/docker/rootfs.git#container:docker',
    category: 'advanced',
    tags: ['Build', 'Git', 'CI/CD'],
    summary: 'Builds an image directly from a remote Git repository without needing to manually clone files to the host first.',
    syntaxTokens: [
      { text: 'docker build', type: 'command', desc: 'Build image' },
      { text: 'https://github.com/docker/rootfs.git', type: 'argument', desc: 'Remote Git repository URL' },
      { text: '#container:docker', type: 'flag', desc: 'Fragment specifying target branch or subdirectory' }
    ],
    detailedDescription: 'BuildKit natively supports remote Git URLs. It clones the remote Git repository into a temporary RAM build context, checks out the specified branch/tag/subfolder, and builds the container image.',
    flagsBreakdown: [
      { flag: '-t, --tag', desc: 'Name and tag for the resulting image', default: 'none' }
    ],
    sampleOutput: `[+] Building 5.4s (6/6) FINISHED
 => [internal] load git source https://github.com/docker/rootfs.git
 => => cloning https://github.com/docker/rootfs.git (branch: container)
 => [1/2] FROM scratch
 => exporting to image`,
    tips: ['Specify subdirectories inside the repo by appending `:subfolder` after the `#branch` fragment.'],
    simulation: {
      type: 'build-git',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Git URL Build Dispatch',
          description: 'Client instructs BuildKit daemon to fetch source directly from remote Git URI.',
          kernelLogs: '[strace] write(3, "POST /v1.43/build?remote=https%3A%2F%2Fgithub.com...", 240) = 240',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'Remote Git URI'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (NIC)',
          title: 'TLS Git Packfile Stream Download',
          description: 'BuildKit negotiates TLS Git packfile download, receiving commit blobs directly into RAM.',
          kernelLogs: '[nic] eth0: TLS transfer 4.8MB Git packfile from github.com:443',
          hardwareActivity: 'NIC DMA transfer to RAM.',
          statusBadge: 'Git Clone in RAM'
        },
        {
          stepNumber: 3,
          layerId: 'host',
          layerName: 'Docker Host (BuildKit)',
          title: 'Compile LLB DAG from Git Dockerfile',
          description: 'BuildKit unpacks git commit tree and executes build instructions inside snapshot sandbox.',
          kernelLogs: '[buildkit] solver: executing build DAG from remote Git context',
          hardwareActivity: 'CPU multithreaded build.',
          statusBadge: 'Image Compiled'
        }
      ]
    }
  },
  {
    id: 'docker-compose-down-volumes',
    name: 'Tear Down Compose Stack & Purge Volumes',
    command: 'docker compose down -v',
    category: 'advanced',
    tags: ['Compose', 'Volumes', 'Cleanup', 'Storage'],
    summary: 'Stops all services, removes project networks, and permanently destroys all named and anonymous volumes declared in Compose.',
    syntaxTokens: [
      { text: 'docker compose', type: 'subcommand', desc: 'Compose V2 subcommands' },
      { text: 'down', type: 'subcommand', desc: 'Stop and remove containers, networks' },
      { text: '-v, --volumes', type: 'flag', desc: 'Remove named volumes declared in the volumes section of Compose file' }
    ],
    detailedDescription: 'Destroys both the container execution sandboxes and the underlying storage volumes on disk. Guarantees that next time `docker compose up` runs, all databases start completely fresh from scratch.',
    flagsBreakdown: [
      { flag: '-v, --volumes', desc: 'Remove named and anonymous volumes', default: 'false' },
      { flag: '--rmi', desc: 'Remove images (all, or local)', default: 'none' }
    ],
    sampleOutput: `[+] Running 4/4
 Container myapp-web-1    Removed
 Container myapp-db-1     Removed
 Volume myapp_db_data     Removed
 Network myapp_default    Removed`,
    tips: ['WARNING: Data inside the volumes is permanently erased. Export database dumps before using `-v` in production!'],
    simulation: {
      type: 'compose-down-volumes',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client (Compose)',
          title: 'Reverse Topological DAG Teardown',
          description: 'Compose calculates shutdown order: web -> db -> volumes -> network.',
          kernelLogs: '[compose] resolving reverse dependency DAG',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'DAG Solved'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Volume Unmount & Inode Directory Deletion',
          description: 'dockerd deletes containers, unmounts `/var/lib/docker/volumes/myapp_db_data`, and unlinks all files.',
          kernelLogs: '[dockerd] removing volume myapp_db_data\n[kernel] unlinkat() removed 18,200 database files',
          hardwareActivity: 'NVMe block discard.',
          statusBadge: 'Volumes Purged'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Bridge Network & iptables Teardown',
          description: 'Kernel deletes bridge device `br-myapp` and cleans up port forwarding rules.',
          kernelLogs: '[kernel] netlink: RTM_DELLINK br-myapp\n[iptables] rules cleared',
          hardwareActivity: 'Network routing table memory freed.',
          statusBadge: 'Clean State'
        }
      ]
    }
  },
  {
    id: 'docker-service-scale',
    name: 'Scale Swarm Service Replicas',
    command: 'docker service scale web-service=5',
    category: 'advanced',
    tags: ['Swarm', 'Scaling', 'Services', 'Orchestration'],
    summary: 'Declaratively scales a Docker Swarm service to 5 replicated container tasks across cluster worker nodes.',
    syntaxTokens: [
      { text: 'docker service', type: 'subcommand', desc: 'Manage Swarm services' },
      { text: 'scale', type: 'subcommand', desc: 'Scale one or multiple replicated services' },
      { text: 'web-service=5', type: 'argument', desc: 'Service name and desired replica count' }
    ],
    detailedDescription: 'SwarmKit leader node reconciles the desired state (5 replicas) against the current running count. It schedules tasks across available cluster worker nodes, provisions VXLAN overlay routing, and balances traffic across all 5 containers via the routing mesh IPVS load balancer.',
    flagsBreakdown: [
      { flag: '-d, --detach', desc: 'Exit immediately instead of waiting for service to converge', default: 'false' }
    ],
    sampleOutput: `web-service scaled to 5
overall progress: 5 out of 5 tasks 
1/5: running   [==================================>]
2/5: running   [==================================>]
3/5: running   [==================================>]
4/5: running   [==================================>]
5/5: running   [==================================>]
verify: Service converged`,
    tips: ['Swarm\'s built-in Ingress Routing Mesh automatically load-balances incoming HTTP requests across all 5 replicas!'],
    simulation: {
      type: 'swarm-scale',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Service Scale API Call',
          description: 'Sends `POST /v1.43/services/web-service/update` with Replicas: 5.',
          kernelLogs: '[strace] write(3, "POST /v1.43/services/web-service/update HTTP/1.1...", 260) = 260',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'Replicas: 5'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (SwarmKit Raft)',
          title: 'Raft Consensus State Machine Update',
          description: 'Swarm leader writes desired state to Raft log and dispatches task placement across worker nodes.',
          kernelLogs: '[swarmkit] raft: commit index 491, replicated state updated to 5 tasks',
          hardwareActivity: 'CPU Raft log replication.',
          statusBadge: 'Raft Committed'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (IPVS Load Balancer)',
          title: 'Kernel IPVS Virtual Server Weights Updated',
          description: 'Linux IPVS kernel module updates routing table with 5 backend container endpoints for round-robin balancing.',
          kernelLogs: '[kernel] ipvs: added 4 real servers to virtual service 10.0.0.5:80',
          hardwareActivity: 'IPVS hash table updated.',
          statusBadge: 'IPVS Mesh Active'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: '5 Replicas Serving Traffic in Parallel',
          description: '5 container instances actively process incoming traffic across the cluster.',
          kernelLogs: '[container] 5 instances healthy and serving requests',
          hardwareActivity: 'Distributed multi-core execution.',
          statusBadge: '5 Tasks Running'
        }
      ]
    }
  },
  {
    id: 'docker-stack-rm',
    name: 'Remove Swarm Distributed Stack',
    command: 'docker stack rm my-stack',
    category: 'advanced',
    tags: ['Swarm', 'Stacks', 'Orchestration', 'Cleanup'],
    summary: 'Tears down all services, tasks, secrets, configs, and overlay networks associated with a distributed Swarm stack.',
    syntaxTokens: [
      { text: 'docker stack', type: 'subcommand', desc: 'Manage Swarm stacks' },
      { text: 'rm', type: 'subcommand', desc: 'Remove one or more stacks' },
      { text: 'my-stack', type: 'argument', desc: 'Stack name' }
    ],
    detailedDescription: 'Instructs the Raft cluster leader to de-provision all replicated tasks, unregister ingress routing mesh rules, and tear down VXLAN encapsulated overlay networks across the entire physical node fleet.',
    flagsBreakdown: [],
    sampleOutput: `Removing service my-stack_api
Removing service my-stack_db
Removing service my-stack_worker
Removing network my-stack_default`,
    tips: ['Allows clean single-command de-provisioning of complex multi-service production topologies.'],
    simulation: {
      type: 'stack-rm',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Stack Delete Dispatch',
          description: 'Client calls Swarm manager API to initiate stack teardown.',
          kernelLogs: '[strace] write(3, "DELETE /v1.43/stacks/my-stack HTTP/1.1...", 180) = 180',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'DELETE /stacks'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (SwarmKit)',
          title: 'Cluster Task Descheduling',
          description: 'Swarm leader broadcasts task stop orders to all cluster worker nodes via mutual TLS gRPC channels.',
          kernelLogs: '[swarmkit] dispatcher: stop task orders sent to 3 worker nodes',
          hardwareActivity: 'mTLS network broadcasts.',
          statusBadge: 'Tasks Descheduled'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (VXLAN Teardown)',
          title: 'Overlay VXLAN Tunnel Teardown',
          description: 'Linux kernel unbinds VXLAN UDP port 4789 and removes overlay bridge interfaces.',
          kernelLogs: '[kernel] vxlan: de-registered overlay network vx-001248',
          hardwareActivity: 'Kernel networking table cleanup.',
          statusBadge: 'VXLAN Cleaned'
        }
      ]
    }
  },

  // ==================== COMMANDS FROM UPDATED DOCKER CPU AND MEMORY.MD ====================
  {
    id: 'docker-info-resources',
    name: 'Inspect Host CPU & Memory via Docker Info',
    command: 'docker info --format "CPUs: {{.NCPU}}  Memory: {{.MemTotal}}"',
    category: 'basic',
    tags: ['System', 'Hardware', 'Inspection', 'CPU', 'Memory'],
    summary: 'Extracts the host\'s physical CPU core count and total available RAM detected by the Docker engine daemon.',
    syntaxTokens: [
      { text: 'docker info', type: 'command', desc: 'Display system-wide information' },
      { text: '--format', type: 'flag', desc: 'Format the output using the given Go template' },
      { text: '"CPUs: {{.NCPU}}  Memory: {{.MemTotal}}"', type: 'argument', desc: 'Go template selecting CPU count and total memory' }
    ],
    detailedDescription: 'Queries the Docker daemon `/info` endpoint. The daemon calls Linux `sysinfo()` and `sysconf()` to discover physical hardware specifications (number of online CPU cores and total physical RAM installed in motherboard DIMM slots).',
    flagsBreakdown: [
      { flag: '--format', desc: 'Format output using Go template syntax', default: 'standard text' }
    ],
    sampleOutput: `CPUs: 16  Memory: 33554432000`,
    tips: ['Useful in host deployment scripts to verify Docker sees all hardware threads and RAM on bare-metal servers.'],
    simulation: {
      type: 'info-hardware',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Format Flag & Info Request',
          description: 'Client connects to socket `/var/run/docker.sock` and requests `GET /v1.43/info`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/info HTTP/1.1\\r\\n...", 90) = 90',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'GET /info'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (sysinfo syscall)',
          title: 'Kernel sysinfo() Reads RAM & CPU Counters',
          description: 'Linux kernel queries memory page counters (`totalram: 8192000 pages`) and online processor mask.',
          kernelLogs: '[kernel] sysinfo({totalram=33554432000, freeram=18204918000, procs=412}) = 0\n[kernel] sysconf(_SC_NPROCESSORS_ONLN) = 16',
          hardwareActivity: 'Motherboard SMBIOS RAM table read.',
          statusBadge: 'sysinfo() Syscall'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Evaluate Go Template & Render Output',
          description: 'Client evaluates `{{.NCPU}}` and `{{.MemTotal}}` and outputs hardware summary.',
          kernelLogs: '[strace] write(1, "CPUs: 16  Memory: 33554432000\\n", 31) = 31',
          hardwareActivity: 'Terminal print.',
          statusBadge: 'Hardware Rendered'
        }
      ]
    }
  },
  {
    id: 'docker-inspect-oom',
    name: 'Check if Container was OOM-Killed',
    command: 'docker inspect -f "{{ .State.OOMKilled }}" my_container',
    category: 'intermediate',
    tags: ['Troubleshooting', 'Memory', 'OOM', 'Inspection'],
    summary: 'Queries container state to definitively determine whether the Linux kernel Out-Of-Memory killer terminated the process.',
    syntaxTokens: [
      { text: 'docker inspect', type: 'command', desc: 'Return low-level information on Docker objects' },
      { text: '-f "{{ .State.OOMKilled }}"', type: 'flag', desc: 'Go template extracting the boolean OOMKilled state flag' },
      { text: 'my_container', type: 'argument', desc: 'Target container name or ID' }
    ],
    detailedDescription: 'When a container terminates unexpectedly with exit code 137 (128 + signal 9 SIGKILL), checking `.State.OOMKilled` provides immediate confirmation whether the kernel memory cgroup ceiling was breached.',
    flagsBreakdown: [
      { flag: '-f, --format', desc: 'Format output using Go template', default: 'json' }
    ],
    sampleOutput: `true`,
    tips: ['Combine with `docker inspect -f "{{ .State.ExitCode }}" my_container` (exit code 137 confirms SIGKILL).'],
    simulation: {
      type: 'inspect-oom',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Inspect State Query',
          description: 'Client requests container inspection and filters `.State.OOMKilled`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/my_container/json HTTP/1.1...", 160) = 160',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /json'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'State Memory Struct Lookup',
          description: 'dockerd reads container task struct. Containderd-shim recorded `OOMKilled: true` when kernel cgroup memory event fired.',
          kernelLogs: '[dockerd] container state: status=exited exitCode=137 oomKilled=true',
          hardwareActivity: 'RAM state lookup.',
          statusBadge: 'OOMKilled: true'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Output Boolean Result',
          description: 'Prints `true` if OOM killed, or `false` if exited normally.',
          kernelLogs: '[strace] write(1, "true\\n", 5) = 5',
          hardwareActivity: 'Stdout print.',
          statusBadge: 'true'
        }
      ]
    }
  },
  {
    id: 'docker-inspect-nanocpus',
    name: 'Inspect Configured NanoCPUs Limit',
    command: 'docker inspect -f "{{ .HostConfig.NanoCpus }}" my_container',
    category: 'intermediate',
    tags: ['CPU', 'Cgroups', 'Inspection'],
    summary: 'Inspects the exact fractional CPU allocation in billionths of a CPU core (NanoCPUs) configured on the container.',
    syntaxTokens: [
      { text: 'docker inspect', type: 'command', desc: 'Inspect Docker object' },
      { text: '-f "{{ .HostConfig.NanoCpus }}"', type: 'flag', desc: 'Extract NanoCpus integer from HostConfig' },
      { text: 'my_container', type: 'argument', desc: 'Container name' }
    ],
    detailedDescription: 'Docker converts `--cpus=1.5` into `1500000000` NanoCPUs (`--cpus * 1e9`). This command extracts the exact raw integer passed to the container runtime.',
    flagsBreakdown: [
      { flag: '-f, --format', desc: 'Go template string', default: 'json' }
    ],
    sampleOutput: `1500000000`,
    tips: ['Divide by 1,000,000,000 to get fractional CPU cores: 1500000000 = 1.5 cores.'],
    simulation: {
      type: 'inspect-nanocpus',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Query HostConfig Struct',
          description: 'Client inspects `.HostConfig.NanoCpus`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/my_container/json HTTP/1.1...", 160) = 160',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'Query NanoCpus'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Extract NanoCpus Integer',
          description: 'dockerd serializes HostConfig and returns `1500000000`.',
          kernelLogs: '[dockerd] returning NanoCpus: 1500000000',
          hardwareActivity: 'RAM struct read.',
          statusBadge: '1.5e9 NanoCPUs'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Print Raw NanoCPUs Value',
          description: 'Prints integer to terminal stdout.',
          kernelLogs: '[strace] write(1, "1500000000\\n", 11) = 11',
          hardwareActivity: 'Terminal print.',
          statusBadge: 'Output Rendered'
        }
      ]
    }
  },
  {
    id: 'docker-compose-stats',
    name: 'Multi-Service Resource Usage Snapshot',
    command: 'docker compose stats --no-stream',
    category: 'intermediate',
    tags: ['Compose', 'Monitoring', 'CPU', 'Memory'],
    summary: 'Captures a unified resource utilization snapshot (CPU %, Memory, Net I/O) across all microservices in the Compose project.',
    syntaxTokens: [
      { text: 'docker compose', type: 'subcommand', desc: 'Compose V2 subcommands' },
      { text: 'stats', type: 'subcommand', desc: 'Display a live stream of container(s) resource usage statistics' },
      { text: '--no-stream', type: 'flag', desc: 'Pull first snapshot and exit instead of continuous streaming' }
    ],
    detailedDescription: 'Queries the Docker daemon in parallel for all containers sharing the project label `com.docker.compose.project`, outputting a comparative performance matrix across web, worker, and database services.',
    flagsBreakdown: [
      { flag: '--no-stream', desc: 'Single snapshot without live streaming', default: 'false' },
      { flag: '--all', desc: 'Show all containers (including stopped)', default: 'false' }
    ],
    sampleOutput: `CONTAINER ID   NAME              CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O
a1b2c3d4e5f6   myapp-web-1       0.12%     42.1MiB / 512MiB      8.22%     1.4MB / 820kB    0B / 4.1kB
f6e5d4c3b2a1   myapp-worker-1    1.84%     112MiB / 1GiB         10.9%     4.8MB / 1.2MB    12MB / 85MB
9a8b7c6d5e4f   myapp-db-1        0.45%     184MiB / 2GiB         8.98%     820kB / 3.4MB    45MB / 120MB`,
    tips: ['Combine with `docker compose top` to see individual host PIDs for each microservice.'],
    simulation: {
      type: 'compose-stats',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client (Compose)',
          title: 'Resolve Project Container IDs',
          description: 'Compose filters active containers matching current project directory.',
          kernelLogs: '[compose] resolved 3 active service containers',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Project Filter'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Parallel Cgroup Stats Queries',
          description: 'dockerd queries `/sys/fs/cgroup/` metrics across all 3 containers simultaneously.',
          kernelLogs: '[dockerd] parallel stats query completed in 1.4ms',
          hardwareActivity: 'RAM stats compilation.',
          statusBadge: 'Parallel Stats'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Render Multi-Service Performance Table',
          description: 'Prints unified table with CPU, Memory %, and I/O metrics.',
          kernelLogs: '[strace] write(1, "CONTAINER ID   NAME...", 380) = 380',
          hardwareActivity: 'Stdout table render.',
          statusBadge: 'Table Rendered'
        }
      ]
    }
  },
  {
    id: 'docker-events-oom',
    name: 'Monitor Real-Time OOM Events',
    command: 'docker events --filter event=oom',
    category: 'intermediate',
    tags: ['Events', 'Monitoring', 'Memory', 'OOM'],
    summary: 'Listens to the real-time Docker daemon event stream filtered strictly for kernel Out-Of-Memory termination incidents.',
    syntaxTokens: [
      { text: 'docker events', type: 'command', desc: 'Get real time events from the server' },
      { text: '--filter event=oom', type: 'flag', desc: 'Filter event stream strictly for OOM kill events' }
    ],
    detailedDescription: 'Opens a persistent HTTP event stream to the Docker daemon. Whenever the host Linux kernel OOM killer terminates any container task, the daemon broadcasts an event frame with container metadata, image, and timestamp.',
    flagsBreakdown: [
      { flag: '--filter', desc: 'Filter events by type or event name (e.g. event=oom)', default: 'none' },
      { flag: '--since', desc: 'Show all events created since timestamp', default: 'now' }
    ],
    sampleOutput: `2026-10-18T00:25:12.182910291Z container oom b8f9e2193b21 (image=nginx:alpine, name=web-nginx)`,
    tips: ['In production clusters, pipe this event stream into alerting tools (Slack, PagerDuty) to be notified immediately when memory ceilings are breached.'],
    simulation: {
      type: 'events-oom',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Open Persistent Event Listener Socket',
          description: 'Client connects to `GET /v1.43/events?filters={"event":["oom"]}`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/events?filters=... HTTP/1.1...", 180) = 180',
          hardwareActivity: 'Persistent socket connection.',
          statusBadge: 'Listening for OOM'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (MMU OOM Invocation)',
          title: 'Kernel Memory Controller Fires OOM Event',
          description: 'Memory allocator fails to find free pages, kernel invokes `mem_cgroup_out_of_memory()`, and notifies containerd event socket.',
          kernelLogs: '[kernel] memory cgroup /docker/b8f9e21 out of memory\n[kernel] oom-killer: killed process 14820 (nginx)',
          hardwareActivity: 'Kernel MMU OOM trigger.',
          statusBadge: 'Kernel OOM Triggered'
        },
        {
          stepNumber: 3,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Broadcast OOM Event Frame',
          description: 'dockerd event bus pushes JSON frame to subscribed client.',
          kernelLogs: '[dockerd] pubsub: dispatched event "container oom" to listener',
          hardwareActivity: 'RAM broadcast channel.',
          statusBadge: 'Event Dispatched'
        },
        {
          stepNumber: 4,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Print Timestamped OOM Alert',
          description: 'Renders OOM alert line to terminal screen.',
          kernelLogs: '[strace] write(1, "2026-10-18T00:25:12Z container oom...", 95) = 95',
          hardwareActivity: 'Terminal output rendered.',
          statusBadge: 'Alert Printed'
        }
      ]
    }
  },
  {
    id: 'docker-memory-swappiness',
    name: 'Tune Swappiness Ratio (--memory-swappiness)',
    command: 'docker run -d --memory=512m --memory-swappiness=0 nginx',
    category: 'advanced',
    tags: ['Memory', 'Swap', 'Cgroups', 'Performance'],
    summary: 'Tunes swappiness ratio (0-100), where 0 turns off swapping of container memory pages unless absolutely out of RAM.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--memory=512m', type: 'flag', desc: 'Memory limit' },
      { text: '--memory-swappiness=0', type: 'flag', desc: 'Swappiness ratio from 0 (never swap) to 100 (aggressive swap)' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Sets `memory.swappiness` in the container cgroup. Setting `--memory-swappiness=0` tells the Linux page reclamation algorithm to aggressively reclaim file page cache rather than swapping anonymous process memory pages to disk.',
    flagsBreakdown: [
      { flag: '--memory-swappiness', desc: 'Tune container memory swappiness (0 to 100)', default: 'host default (60)' }
    ],
    sampleOutput: `09a1b8e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d4f81`,
    tips: ['Set `--memory-swappiness=0` for database engines and Java JVM workloads to avoid disk swap thrashing.'],
    simulation: {
      type: 'memory-swappiness',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'MemorySwappiness Flag Serialization',
          description: 'Sets `"MemorySwappiness": 0` in HostConfig JSON.',
          kernelLogs: '[strace] "HostConfig": {"MemorySwappiness": 0, "Memory": 536870912}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Swappiness: 0'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups swappiness)',
          title: 'Kernel Programs Memory Swappiness Controller',
          description: 'Writes `0` to `/sys/fs/cgroup/memory/docker/[id]/memory.swappiness`.',
          kernelLogs: '[kernel] write memory.swappiness "0"',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'memory.swappiness=0'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (RAM Page Cache)',
          title: 'Anonymous Memory Locked in DDR RAM',
          description: 'Memory controller keeps application memory pages resident in DDR5 RAM, avoiding NVMe swap I/O latency.',
          kernelLogs: '[kernel/mm] page reclaim: skipping anonymous pages -> reclaiming page cache',
          hardwareActivity: 'Zero SSD swap writes.',
          statusBadge: 'RAM Resident'
        }
      ]
    }
  },
  {
    id: 'docker-oom-score-adj',
    name: 'Adjust Kernel OOM Kill Priority',
    command: 'docker run -d --oom-score-adj=500 nginx',
    category: 'advanced',
    tags: ['Memory', 'OOM', 'Kernel', 'Priority'],
    summary: 'Adjusts kernel OOM killer badness heuristic priority (-1000 to 1000), dictating which containers die first during memory exhaustion.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--oom-score-adj=500', type: 'flag', desc: 'OOM priority adjustment (-1000: immune, 1000: die first)' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Writes to `/proc/[pid]/oom_score_adj`. When system memory is exhausted, the Linux kernel ranks processes by memory usage plus `oom_score_adj`. Positive scores make a container a primary sacrificial target, while negative scores (down to -1000) make it immune.',
    flagsBreakdown: [
      { flag: '--oom-score-adj', desc: 'Tune host OOM score preferences (-1000 to 1000)', default: '0' }
    ],
    sampleOutput: `b8f9e2193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d381ba93`,
    tips: ['Set negative values (e.g. -500) for mission-critical database containers, and positive values (500) for batch background workers.'],
    simulation: {
      type: 'oom-score-adj',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'OomScoreAdj Configuration Formatting',
          description: 'Client formats `OomScoreAdj: 500` in HostConfig JSON.',
          kernelLogs: '[strace] "HostConfig": {"OomScoreAdj": 500}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'OomScoreAdj: 500'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (runc)',
          title: 'Write /proc/[pid]/oom_score_adj',
          description: 'runc writes `500` to the container task\'s `/proc/14820/oom_score_adj` file descriptor.',
          kernelLogs: '[runc] write /proc/14820/oom_score_adj "500"',
          hardwareActivity: 'Procfs write.',
          statusBadge: 'procfs Written'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (OOM Heuristic)',
          title: 'Kernel OOM Badness Rating Adjusted',
          description: 'Kernel updates the process task_struct. If host RAM drops below critical threshold, this container is terminated first.',
          kernelLogs: '[kernel] oom_badness: task 14820 score adjusted by +500 points',
          hardwareActivity: 'Kernel task_struct priority updated.',
          statusBadge: 'Badness +500'
        }
      ]
    }
  },
  {
    id: 'docker-shm-size',
    name: 'Resize POSIX Shared Memory (/dev/shm)',
    command: 'docker run -d --shm-size=256m nginx',
    category: 'advanced',
    tags: ['Memory', 'IPC', 'Performance', 'Shared Memory'],
    summary: 'Expands the POSIX shared memory tmpfs mount size at /dev/shm from the default 64MB to 256MB.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--shm-size=256m', type: 'flag', desc: 'Size of /dev/shm (format: <number>[<unit>])' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'By default, Docker allocates only 64MB for `/dev/shm`. Applications that rely heavily on inter-process shared memory (e.g. headless Chrome, PostgreSQL, PyTorch multi-GPU dataloaders) will crash with `Bus error` or `No space left on device` without `--shm-size`.',
    flagsBreakdown: [
      { flag: '--shm-size', desc: 'Size of /dev/shm (bytes or k, m, g suffix)', default: '64m' }
    ],
    sampleOutput: `4e918bcae31720f1883aa3d81b95fcae1378d381ba9377a892b1cd0912ab8e11`,
    tips: ['Mandatory when running web scrapers (Playwright/Puppeteer) or deep learning training scripts inside containers.'],
    simulation: {
      type: 'shm-size',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'ShmSize Byte Calculation',
          description: 'Converts `256m` to `268435456` bytes in HostConfig JSON.',
          kernelLogs: '[strace] "HostConfig": {"ShmSize": 268435456}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'ShmSize: 256M'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (mount tmpfs)',
          title: 'Kernel Mounts 256MB tmpfs on /dev/shm',
          description: 'Kernel executes `mount("shm", "/dev/shm", "tmpfs", ..., "size=268435456")`.',
          kernelLogs: '[kernel] mount("shm", "/run/containerd/.../dev/shm", "tmpfs", MS_NOSUID|MS_NODEV, "size=268435456") = 0',
          hardwareActivity: 'VFS tmpfs mount created in DDR RAM.',
          statusBadge: '256MB /dev/shm'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Large Shared Memory Segments Allocated',
          description: 'Application successfully calls `shm_open()` and `mmap()` to allocate 200MB shared buffers without crashing.',
          kernelLogs: '[container] shm_open("/psm_1", O_CREAT|O_RDWR) = 4; ftruncate(4, 209715200) = 0',
          hardwareActivity: 'Shared memory RAM pages mapped.',
          statusBadge: 'Zero Bus Errors'
        }
      ]
    }
  },
  {
    id: 'docker-cpuset-mems',
    name: 'NUMA Memory Node Affinity Lock',
    command: 'docker run -d --cpuset-mems="0" nginx',
    category: 'advanced',
    tags: ['Hardware', 'NUMA', 'Memory', 'CPU'],
    summary: 'Restricts memory allocations exclusively to physical NUMA memory bank node 0 on multi-socket enterprise servers.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--cpuset-mems="0"', type: 'flag', desc: 'Memory nodes (MEMs) in which to allow execution (0-1, 0,1)' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'On multi-socket servers with Non-Uniform Memory Access (NUMA), accessing RAM wired to another CPU socket incurs severe interconnect bus latency. `--cpuset-mems="0"` restricts memory page allocations strictly to local memory channel DIMMs.',
    flagsBreakdown: [
      { flag: '--cpuset-mems', desc: 'Memory nodes (MEMs) in which to allow execution (0-1, 0,1)', default: 'all memory nodes' }
    ],
    sampleOutput: `d81ba9377a892b1cd0912ab8e11b8f9e2193b2184a4504193ec881c6d1720f18`,
    tips: ['Combine `--cpuset-cpus="0-7"` with `--cpuset-mems="0"` to lock both execution cores and memory to the same physical CPU socket.'],
    simulation: {
      type: 'numa-mems',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'CpusetMems Configuration Serialization',
          description: 'Sets `"CpusetMems": "0"` in HostConfig JSON.',
          kernelLogs: '[strace] "HostConfig": {"CpusetMems": "0"}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'CpusetMems: "0"'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cpuset.mems controller)',
          title: 'Write cpuset.mems in Cgroups Subsystem',
          description: 'Kernel writes `"0"` into `/sys/fs/cgroup/docker/[id]/cpuset.mems`.',
          kernelLogs: '[kernel] write cpuset.mems "0"',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'cpuset.mems=0'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (NUMA Socket 0 Memory Bus)',
          title: 'Direct Local DDR5 Memory Channel Access',
          description: 'Memory allocations only use physical DDR5 DIMM slots attached to CPU Socket 0. Cross-socket UPI interconnect is completely bypassed.',
          kernelLogs: '[hardware/numa] page alloc from NUMA node 0 memory pool (0ns UPI bus latency)',
          hardwareActivity: 'Local memory controller direct access.',
          statusBadge: 'NUMA Node 0 Locked'
        }
      ]
    }
  },
  {
    id: 'docker-cpu-quota-period',
    name: 'Direct Linux CFS Quota & Period Controls',
    command: 'docker run -d --cpu-period=100000 --cpu-quota=50000 nginx',
    category: 'advanced',
    tags: ['CPU', 'Cgroups', 'CFS', 'Performance'],
    summary: 'Direct low-level Completely Fair Scheduler (CFS) bandwidth control: specifies 50,000us execution quota per 100,000us period (50% of 1 CPU).',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--cpu-period=100000', type: 'flag', desc: 'CFS scheduler period in microseconds (default 100,000)' },
      { text: '--cpu-quota=50000', type: 'flag', desc: 'CFS scheduler quota in microseconds allowed per period' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Exposes raw Linux CFS bandwidth control parameters. The ratio `cpu_quota / cpu_period` determines the hard CPU ceiling. For example, `50000 / 100000` = 0.5 CPUs (50% of 1 core), while `200000 / 100000` = 2.0 CPUs.',
    flagsBreakdown: [
      { flag: '--cpu-period', desc: 'Limit CPU CFS (Completely Fair Scheduler) period', default: '100000' },
      { flag: '--cpu-quota', desc: 'Limit CPU CFS (Completely Fair Scheduler) quota', default: 'unlimited (-1)' }
    ],
    sampleOutput: `35a88802559d18e9a2b10912ab8e11b8f9e2193b2184a4504193ec881c6d1720`,
    tips: ['`--cpus=0.5` is the modern shorthand recommended by Docker, but understanding `--cpu-period` and `--cpu-quota` explains how Linux kernel CFS enforces limits!'],
    simulation: {
      type: 'cpu-cfs-quota',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Period & Quota JSON Serialization',
          description: 'Client writes `CpuPeriod: 100000` and `CpuQuota: 50000` in HostConfig.',
          kernelLogs: '[strace] "HostConfig": {"CpuPeriod": 100000, "CpuQuota": 50000}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Quota 50k / 100k'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups v2 cpu.max)',
          title: 'Kernel Writes Quota to cpu.max',
          description: 'In cgroups v2, kernel writes `"50000 100000"` into `cpu.max`.',
          kernelLogs: '[kernel] write /sys/fs/cgroup/docker/.../cpu.max "50000 100000"',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'cpu.max "50000 100000"'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (CPU High-Res Timers)',
          title: 'Hardware Timer Enforces 50ms Quota Throttling',
          description: 'CPU high-resolution timer measures clock cycles. When task consumes 50ms of CPU time in a 100ms window, the kernel deschedules the thread until the next period.',
          kernelLogs: '[kernel/sched] CFS bandwidth timer fired: throttled task 14820 (nr_throttled: 1)',
          hardwareActivity: 'Hardware timer interrupt deschedules thread.',
          statusBadge: 'CFS Throttling Active'
        }
      ]
    }
  },
  {
    id: 'docker-cpu-rt-runtime',
    name: 'Real-Time Linux Scheduler (SCHED_RR/FIFO)',
    command: 'docker run -d --cpu-rt-runtime=950000 --ulimit rtprio=99 --cap-add=sys_nice nginx',
    category: 'advanced',
    tags: ['CPU', 'Real-Time', 'Kernel', 'Syscall'],
    summary: 'Configures deterministic Linux Real-Time scheduling (SCHED_RR/SCHED_FIFO) with hard realtime microsecond allocation.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--cpu-rt-runtime=950000', type: 'flag', desc: 'Realtime runtime in microseconds allocated per period' },
      { text: '--ulimit rtprio=99', type: 'flag', desc: 'Allow container to set maximum real-time priority (1-99)' },
      { text: '--cap-add=sys_nice', type: 'flag', desc: 'Grant CAP_SYS_NICE capability to change process scheduling policy' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Allows container processes to use Linux Real-Time scheduling policies (`SCHED_FIFO` or `SCHED_RR`). Real-time threads preempt all standard completely fair scheduler (CFS) tasks on the CPU, achieving sub-microsecond deterministic response times for robotics, audio DSP, and telecommunications.',
    flagsBreakdown: [
      { flag: '--cpu-rt-runtime', desc: 'Limit CPU real-time runtime in microseconds', default: '0 (disabled)' },
      { flag: '--cpu-rt-period', desc: 'Limit CPU real-time period in microseconds', default: 'none' }
    ],
    sampleOutput: `4a819bce3d1720f1883aa3d81b95fcae1378d381ba9377a892b1cd0912ab8e11`,
    tips: ['Requires kernel built with `CONFIG_PREEMPT_RT` and daemon configured with `--cpu-rt-runtime` support.'],
    simulation: {
      type: 'cpu-realtime',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Real-Time Flags Serialization',
          description: 'Client formats CpuRtRuntime: 950000, Ulimits, and CapAdd: ["SYS_NICE"].',
          kernelLogs: '[strace] "HostConfig": {"CpuRtRuntime": 950000, "CapAdd": ["SYS_NICE"]}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'RT Runtime: 950k'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (SCHED_FIFO / SCHED_RR)',
          title: 'Kernel Allocates Real-Time Bandwidth',
          description: 'Kernel writes `950000` to `cpu.rt_runtime_us` and permits `sched_setscheduler()` syscalls.',
          kernelLogs: '[kernel] write cpu.rt_runtime_us "950000"\n[kernel] sched_setscheduler(14820, SCHED_FIFO, {sched_priority=99}) = 0',
          hardwareActivity: 'Real-time scheduler queue enabled.',
          statusBadge: 'SCHED_FIFO Priority 99'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (CPU Preemption)',
          title: 'Hard Real-Time Core Preemption',
          description: 'Real-time container tasks preempt all other user-space processes on the CPU with zero latency jitter.',
          kernelLogs: '[cpu] Core #0 hardware interrupt: real-time thread preempts standard tasks',
          hardwareActivity: 'Immediate zero-latency context switch.',
          statusBadge: 'Deterministic Silicon Speed'
        }
      ]
    }
  },
  {
    id: 'docker-service-update-limits',
    name: 'Dynamic Swarm Service Resource Limits',
    command: 'docker service update --limit-cpu 2 --limit-memory 1G web',
    category: 'advanced',
    tags: ['Swarm', 'Services', 'CPU', 'Memory', 'Scaling'],
    summary: 'Dynamically updates hardware CPU and memory limits on a distributed Swarm service, rolling out changes across worker nodes.',
    syntaxTokens: [
      { text: 'docker service update', type: 'command', desc: 'Update a Swarm service' },
      { text: '--limit-cpu 2', type: 'flag', desc: 'Update CPU limit to 2 cores' },
      { text: '--limit-memory 1G', type: 'flag', desc: 'Update memory limit to 1 Gigabyte' },
      { text: 'web', type: 'argument', desc: 'Service name' }
    ],
    detailedDescription: 'Updates the service specification in the SwarmKit Raft consensus log. Swarm initiates a rolling update: worker nodes recreate container tasks one by one with the new cgroup CPU and memory envelopes, preserving service availability throughout.',
    flagsBreakdown: [
      { flag: '--limit-cpu', desc: 'Limit CPUs (e.g. 0.5, 2)', default: 'current' },
      { flag: '--limit-memory', desc: 'Limit Memory (e.g. 512M, 1G)', default: 'current' },
      { flag: '--reserve-cpu', desc: 'Reserve CPUs', default: 'current' },
      { flag: '--reserve-memory', desc: 'Reserve Memory', default: 'current' }
    ],
    sampleOutput: `web
overall progress: 3 out of 3 tasks 
1/3: running   [==================================>]
2/3: running   [==================================>]
3/3: running   [==================================>]
verify: Service converged`,
    tips: ['Swarm ensures zero-downtime rolling updates by waiting for health checks on new tasks before stopping old ones.'],
    simulation: {
      type: 'swarm-update-limits',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Service Update API Call',
          description: 'Sends `POST /v1.43/services/web/update` with new ResourceRequirements spec.',
          kernelLogs: '[strace] write(3, "POST /v1.43/services/web/update HTTP/1.1...", 280) = 280',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /services/update'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (SwarmKit Raft Leader)',
          title: 'Raft Log Replication Across Cluster',
          description: 'Raft consensus commits new service version and issues rolling replacement orders to worker nodes.',
          kernelLogs: '[swarmkit] raft: commit index 512; rolling replacement initiated (parallelism: 1)',
          hardwareActivity: 'mTLS network broadcasts.',
          statusBadge: 'Raft Replicated'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (Worker Nodes)',
          title: 'Worker Nodes Spawn Tasks with 2 CPU & 1G RAM Limits',
          description: 'Worker kernels configure new cgroups v2 boundaries with `cpu.max: 200000 100000` and `memory.max: 1073741824`.',
          kernelLogs: '[worker/kernel] write memory.max "1073741824"; write cpu.max "200000 100000"',
          hardwareActivity: 'Cgroups programmed across worker nodes.',
          statusBadge: 'Limits Enforced'
        }
      ]
    }
  },
  {
    id: 'docker-memory-unlimited-swap',
    name: 'Strict RAM Limit with Unlimited Swap (--memory-swap=-1)',
    command: 'docker run -d --memory=512m --memory-swap=-1 nginx',
    category: 'advanced',
    tags: ['Memory', 'Swap', 'Cgroups'],
    summary: 'Enforces a strict 512MB physical RAM limit while permitting unlimited host swap usage.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--memory=512m', type: 'flag', desc: 'Physical RAM hard limit' },
      { text: '--memory-swap=-1', type: 'flag', desc: 'Allow unlimited swap space on host disk' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'Tells the kernel memory controller that while the container may only hold 512MB of resident physical memory in DDR RAM, any additional memory allocations may be paged out to the host swap file indefinitely without triggering an OOM kill.',
    flagsBreakdown: [
      { flag: '--memory-swap', desc: 'Set to -1 to enable unlimited swap for the container', default: '2x memory' }
    ],
    sampleOutput: `09a1b8e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d4f81`,
    tips: ['Useful for memory-heavy batch compilation jobs that can afford disk paging slowdowns to avoid failing with OOM.'],
    simulation: {
      type: 'unlimited-swap',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'MemorySwap: -1 Format',
          description: 'Sets `"Memory": 536870912, "MemorySwap": -1` in HostConfig JSON.',
          kernelLogs: '[strace] "HostConfig": {"Memory": 536870912, "MemorySwap": -1}',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'Swap: -1'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups v2 memory.swap.max)',
          title: 'Kernel Programs max on swap.max',
          description: 'Writes `536870912` to `memory.max` and `"max"` to `memory.swap.max`.',
          kernelLogs: '[kernel] write memory.max "536870912"\n[kernel] write memory.swap.max "max"',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'memory.swap.max=max'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (RAM & NVMe Swap)',
          title: 'Kernel Pager Pushes Excess Pages to Disk',
          description: 'When RAM usage reaches 512MB, kernel kswapd continuous writes anonymous pages to NVMe swapfile without killing process.',
          kernelLogs: '[kernel/swap] kswapd0 paging out anonymous pages to /swapfile at 450 MB/s',
          hardwareActivity: 'Continuous NVMe swap writes.',
          statusBadge: 'Unlimited Swap Active'
        }
      ]
    }
  },
  {
    id: 'docker-memory-disable-swap',
    name: 'Disable Swap Completely (--memory-swap == --memory)',
    command: 'docker run -d --memory=512m --memory-swap=512m nginx',
    category: 'advanced',
    tags: ['Memory', 'Swap', 'Cgroups', 'Performance'],
    summary: 'Completely disables container swap space by matching --memory-swap to --memory, guaranteeing zero disk paging.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Run detached container' },
      { text: '--memory=512m', type: 'flag', desc: 'Hard physical RAM limit' },
      { text: '--memory-swap=512m', type: 'flag', desc: 'Total RAM + Swap limit (equal values mean 0 bytes swap)' },
      { text: 'nginx', type: 'image', desc: 'Image' }
    ],
    detailedDescription: 'In Docker, `--memory-swap` specifies the aggregate allowance of physical RAM plus swap. When `--memory-swap` is set to the identical value as `--memory`, the available swap delta is exactly 0 bytes. Under memory pressure, the Linux kernel will not page container memory to swap, instead reclaiming filesystem cache or invoking the OOM killer.',
    flagsBreakdown: [
      { flag: '--memory', desc: 'Memory limit (format: <number>[<unit>])', default: 'unlimited' },
      { flag: '--memory-swap', desc: 'Total memory limit including swap (must equal memory to disable swap)', default: '2x memory' }
    ],
    sampleOutput: `e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d4f8109a1b8`,
    tips: ['Essential for low-latency in-memory databases (Redis, KeyDB, Memcached) where disk swap thrashing causes catastrophic tail latency spikes.'],
    simulation: {
      type: 'disable-swap',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Equal Memory & Swap Serialization',
          description: 'Client validates `MemorySwap == Memory` and serializes `{"Memory": 536870912, "MemorySwap": 536870912}`.',
          kernelLogs: '[strace] "HostConfig": {"Memory": 536870912, "MemorySwap": 536870912}',
          hardwareActivity: 'CLI parameter serialization.',
          statusBadge: 'Swap Delta: 0B'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups v2 swap.max)',
          title: 'Kernel Programs Zero Swap Allocation',
          description: 'Kernel writes `536870912` to `memory.max` and `0` to `memory.swap.max`.',
          kernelLogs: '[kernel] write memory.max "536870912"\n[kernel] write memory.swap.max "0"',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'memory.swap.max=0'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (RAM Only)',
          title: 'NVMe Swap I/O Completely Blocked',
          description: 'The Linux page allocator is forbidden from initiating NVMe swapout DMA operations for any thread in this container.',
          kernelLogs: '[kernel/mm] swap allocation rejected for task 14820 (swap quota exhausted)',
          hardwareActivity: 'Zero SSD swap writes. Pure DDR5 RAM execution.',
          statusBadge: 'Zero Swap Latency'
        }
      ]
    }
  },
  {
    id: 'docker-run-combined-limits',
    name: 'Production Full Resource Envelope (CPU, Pinning, RAM & PIDs)',
    command: 'docker run -d --name app --cpus=2 --cpuset-cpus="0-3" --memory=2g --memory-swap=2g --memory-reservation=1g --pids-limit=500 myapp:latest',
    category: 'advanced',
    tags: ['Production', 'Cgroups', 'Hardware', 'NUMA', 'Memory', 'CPU'],
    summary: 'Deploys container with complete enterprise multi-resource envelope: 2 CPU cores pinned to cores 0-3, 2GB hard RAM (no swap), 1GB soft reservation, and 500 max PIDs.',
    syntaxTokens: [
      { text: 'docker run -d --name app', type: 'command', desc: 'Run named container in background' },
      { text: '--cpus=2', type: 'flag', desc: 'Hard limit to 2.0 CPU cores worth of execution' },
      { text: '--cpuset-cpus="0-3"', type: 'flag', desc: 'Pin execution strictly to CPU physical cores 0, 1, 2, and 3' },
      { text: '--memory=2g', type: 'flag', desc: 'Hard physical RAM ceiling (2 Gigabytes)' },
      { text: '--memory-swap=2g', type: 'flag', desc: 'Disable swap paging by setting swap equal to RAM' },
      { text: '--memory-reservation=1g', type: 'flag', desc: 'Soft memory reservation (guaranteed under host pressure)' },
      { text: '--pids-limit=500', type: 'flag', desc: 'Limit max concurrent process threads to 500 (anti fork-bomb)' },
      { text: 'myapp:latest', type: 'image', desc: 'Application image' }
    ],
    detailedDescription: 'Establishes a hardened production resource boundary combining multiple Linux kernel controllers: CFS scheduler bandwidth (`cpu.max`), core pinning affinity mask (`cpuset.cpus`), physical RAM limits (`memory.max`), soft reservation threshold (`memory.low`), and fork-bomb prevention (`pids.max`).',
    flagsBreakdown: [
      { flag: '--cpus', desc: 'Number of CPUs allocated to container', default: 'all host CPUs' },
      { flag: '--cpuset-cpus', desc: 'CPUs in which to allow execution (0-3, 0,1)', default: 'all' },
      { flag: '--memory', desc: 'Memory limit', default: 'unlimited' },
      { flag: '--memory-swap', desc: 'Swap limit equal to memory disables swap', default: '2x memory' },
      { flag: '--memory-reservation', desc: 'Memory soft limit (reservation)', default: 'none' },
      { flag: '--pids-limit', desc: 'Tune container pids limit', default: 'unlimited (-1)' }
    ],
    sampleOutput: `b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d4f8109a1b8e42193`,
    tips: ['This multi-guardrail configuration prevents noisy-neighbor resource starvation in multi-tenant Kubernetes and Docker hosts.'],
    simulation: {
      type: 'combined-resource-envelope',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Multi-Resource JSON Serialization',
          description: 'Client formats complete HostConfig with CpuPeriod, NanoCpus, CpusetCpus, Memory, MemorySwap, MemoryReservation, and PidsLimit.',
          kernelLogs: '[strace] "HostConfig": {"NanoCpus": 2000000000, "CpusetCpus": "0-3", "Memory": 2147483648, "MemorySwap": 2147483648, "PidsLimit": 500}',
          hardwareActivity: 'CLI JSON serialization.',
          statusBadge: 'Multi-Limits Validated'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups v2 multi-controller setup)',
          title: 'Kernel Programs All Cgroup Boundary Controllers',
          description: 'Kernel writes `200000 100000` to `cpu.max`, `0-3` to `cpuset.cpus`, `2147483648` to `memory.max`, `1073741824` to `memory.low`, and `500` to `pids.max`.',
          kernelLogs: '[kernel] write cpu.max "200000 100000"\n[kernel] write cpuset.cpus "0-3"\n[kernel] write memory.max "2147483648"\n[kernel] write pids.max "500"',
          hardwareActivity: 'All cgroup controllers locked.',
          statusBadge: '5 Controllers Bound'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Cores 0-3 & 2GB RAM Pool)',
          title: 'Hardware Isolation on CPU Silicon Cores 0-3',
          description: 'Task scheduler restricts thread execution strictly to CPU Cores 0, 1, 2, and 3. MMU translation registers cap physical DDR5 RAM at 2GB.',
          kernelLogs: '[sched] affinity mask 0x000F: tasks bound to CPU0-CPU3; MMU page table quota: 524288 pages',
          hardwareActivity: 'Cores 0-3 active. Cores 4-15 untouched.',
          statusBadge: 'Silicon Enforced'
        }
      ]
    }
  },
  {
    id: 'docker-update-cpuset',
    name: 'Live CPU Core Re-pinning (--cpuset-cpus)',
    command: 'docker update --cpuset-cpus="0,2" my_container',
    category: 'advanced',
    tags: ['CPU', 'Pinning', 'Live Tuning', 'Hardware'],
    summary: 'Dynamically reassigns an active container to execute strictly on physical CPU cores 0 and 2 without restarting.',
    syntaxTokens: [
      { text: 'docker update', type: 'command', desc: 'Update container configuration dynamically' },
      { text: '--cpuset-cpus="0,2"', type: 'flag', desc: 'Re-pin execution to CPU core 0 and core 2' },
      { text: 'my_container', type: 'argument', desc: 'Running container name or ID' }
    ],
    detailedDescription: 'Modifies `/sys/fs/cgroup/cpuset/docker/[id]/cpuset.cpus` (cgroups v1) or the unified cgroups v2 controller. The Linux kernel task scheduler immediately migrates running threads to the target CPU cores via inter-processor interrupts (IPI) without dropping active TCP connections.',
    flagsBreakdown: [
      { flag: '--cpuset-cpus', desc: 'CPUs in which to allow execution (0-3, 0,1)', default: 'current' }
    ],
    sampleOutput: `my_container`,
    tips: ['Use during runtime performance isolation to move noisy batch workloads away from cores dedicated to latency-critical web servers.'],
    simulation: {
      type: 'update-cpuset',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Update CpusetCpus Request',
          description: 'Sends `POST /v1.43/containers/my_container/update` with `{"CpusetCpus": "0,2"}`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/my_container/update HTTP/1.1...", 210) = 210',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /update'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cpuset controller)',
          title: 'Kernel Updates cpuset.cpus and Fires IPI Migration',
          description: 'Writes `"0,2"` to `cpuset.cpus`. Linux scheduler fires Inter-Processor Interrupts (IPI) to migrate threads from other cores to cores 0 and 2.',
          kernelLogs: '[kernel] write /sys/fs/cgroup/.../cpuset.cpus "0,2"\n[kernel] smp: sent rescheduling IPI to CPU 1, 3',
          hardwareActivity: 'Inter-processor interrupt (IPI) dispatched.',
          statusBadge: 'Cores Re-pinned'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (CPU Cores 0 & 2 Execution)',
          title: 'Thread Execution Relocated to Cores #0 and #2',
          description: 'Hardware registers on Cores 0 and 2 resume instruction execution. Cores 1 and 3 are immediately freed up for other workloads.',
          kernelLogs: '[cpu] Core #0 and #2 context switch complete; Core #1 and #3 idle',
          hardwareActivity: 'Hardware execution shifted to Cores 0 & 2.',
          statusBadge: 'Hardware Migrated'
        }
      ]
    }
  },
  {
    id: 'docker-update-batch-all',
    name: 'Batch Hardware Memory Limit Across All Running Containers',
    command: 'docker update --memory=512m $(docker ps -q)',
    category: 'advanced',
    tags: ['Batch', 'Memory', 'Cgroups', 'Live Tuning'],
    summary: 'Queries all active container IDs and concurrently applies a 512MB memory ceiling to each, instantly relieving host RAM pressure.',
    syntaxTokens: [
      { text: 'docker update', type: 'command', desc: 'Update container configuration dynamically' },
      { text: '--memory=512m', type: 'flag', desc: 'Set memory limit to 512MB per container' },
      { text: '$(docker ps -q)', type: 'argument', desc: 'Subshell outputting short IDs of all running containers' }
    ],
    detailedDescription: 'Shell command substitution `$(docker ps -q)` outputs all active container short IDs. Docker iterates through each container, updating the respective `memory.max` cgroup controllers on the fly without stopping processes, instantly stemming host-wide memory depletion.',
    flagsBreakdown: [
      { flag: '--memory', desc: 'Memory limit (format: <number>[<unit>])', default: 'current' },
      { flag: '$(docker ps -q)', desc: 'Shell command substitution returning all running container IDs', default: 'none' }
    ],
    sampleOutput: `7b9a4c12d8e1
5f2c8a91b4e2
3d1720f1883a
e42193b2184a`,
    tips: ['Emergency triage command when host RAM utilization spikes dangerously close to 95%, protecting the host OS from a total kernel lockup.'],
    simulation: {
      type: 'update-batch',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client (Subshell & Loop)',
          title: 'Subshell Expands Running Container IDs',
          description: 'Shell executes `docker ps -q`, collects container IDs `7b9a4c12d8e1`, `5f2c8a91b4e2`, and issues sequential update API requests.',
          kernelLogs: '[strace] fork() -> execve("docker", ["docker", "ps", "-q"]) = 0\n[strace] read(pipe, "7b9a4c12d8e1\\n5f2c8a91b4e2\\n...")',
          hardwareActivity: 'CLI subshell process expansion.',
          statusBadge: '4 Containers Identified'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host Daemon',
          title: 'Daemon Iterates Container Resource Updates',
          description: 'dockerd updates memory configurations in memory for each container ID and commands containerd/runc.',
          kernelLogs: '[dockerd] container 7b9a4c12d8e1: updating memory to 536870912\n[dockerd] container 5f2c8a91b4e2: updating memory to 536870912',
          hardwareActivity: 'Host daemon API dispatch.',
          statusBadge: 'Updates Dispatched'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (cgroups v2 batch write)',
          title: 'Kernel Writes memory.max for All Cgroups',
          description: 'Kernel writes `536870912` to `/sys/fs/cgroup/.../memory.max` across all target container scopes and triggers immediate memory reclamation.',
          kernelLogs: '[kernel] write .../docker-7b9a4c12d8e1.scope/memory.max "536870912"\n[kernel] write .../docker-5f2c8a91b4e2.scope/memory.max "536870912"',
          hardwareActivity: 'Immediate host RAM page cache reclamation.',
          statusBadge: 'Host RAM Reclaimed'
        }
      ]
    }
  },
  {
    id: 'docker-inspect-exitcode',
    name: 'Inspect Process Termination Exit Code (OOM Verification)',
    command: "docker inspect -f '{{ .State.ExitCode }}' my_container",
    category: 'intermediate',
    tags: ['Troubleshooting', 'Inspection', 'Exit Code', 'OOM'],
    summary: 'Extracts the container process exit status code; exit code 137 indicates abnormal SIGKILL termination (128 + signal 9), typically triggered by kernel OOM.',
    syntaxTokens: [
      { text: 'docker inspect', type: 'command', desc: 'Return low-level information on Docker objects' },
      { text: "-f '{{ .State.ExitCode }}'", type: 'flag', desc: 'Format output using Go template to extract exit code' },
      { text: 'my_container', type: 'argument', desc: 'Container name or ID' }
    ],
    detailedDescription: 'Queries container state metadata stored in Docker engine memory. Exit code 137 indicates that the Linux kernel sent `SIGKILL` (signal 9) to the container root process (128 + 9 = 137). When paired with `{{ .State.OOMKilled }}`, it definitively proves OOM termination.',
    flagsBreakdown: [
      { flag: '-f, --format', desc: 'Format the output using the given Go template', default: 'full JSON' }
    ],
    sampleOutput: `137`,
    tips: ['Exit code 0 = normal exit, 1 = application error, 137 = SIGKILL / OOM, 139 = SIGSEGV segmentation fault, 143 = graceful SIGTERM.'],
    simulation: {
      type: 'inspect-exitcode',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Request Container JSON Metadata',
          description: 'Client issues `GET /v1.43/containers/my_container/json` over unix socket.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/my_container/json HTTP/1.1...", 160) = 160',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /json'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host Engine',
          title: 'Daemon Reads State Struct',
          description: 'dockerd loads container state from RAM cache; `State.ExitCode` is 137, `State.OOMKilled` is true.',
          kernelLogs: '[dockerd] inspect container: State={Status: "exited", ExitCode: 137, OOMKilled: true}',
          hardwareActivity: 'Daemon memory read.',
          statusBadge: 'ExitCode: 137 Found'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Go Template Evaluator',
          title: 'Go Template Renders Exit Code',
          description: 'Client evaluates `{{ .State.ExitCode }}` and outputs `137` to stdout.',
          kernelLogs: '[strace] write(1, "137\\n", 4) = 4',
          hardwareActivity: 'Terminal stdout rendered.',
          statusBadge: 'Output: 137'
        }
      ]
    }
  },
  {
    id: 'docker-inspect-all-resources',
    name: 'Audit Complete Cgroups Hardware Profile via jq',
    command: "docker inspect -f '{{ json .HostConfig }}' my_container | jq '{Memory, MemorySwap, MemoryReservation, NanoCpus, CpuShares, CpusetCpus, CpuQuota, CpuPeriod, PidsLimit}'",
    category: 'intermediate',
    tags: ['Inspection', 'Hardware', 'Cgroups', 'JSON', 'Audit'],
    summary: 'Dumps complete container HostConfig resource configuration and filters CPU, RAM, swap, quota, and PID limits into formatted JSON.',
    syntaxTokens: [
      { text: 'docker inspect', type: 'command', desc: 'Return low-level information on Docker objects' },
      { text: "-f '{{ json .HostConfig }}'", type: 'flag', desc: 'Dump HostConfig sub-structure as raw JSON' },
      { text: 'my_container', type: 'argument', desc: 'Container name or ID' },
      { text: '| jq \'{...}\'', type: 'pipeline', desc: 'Pipe into jq to extract all 9 hardware constraint metrics' }
    ],
    detailedDescription: 'Serializes the entire container HostConfig struct into raw JSON and pipes it into `jq`. Filters down to the 9 primary hardware constraint fields, providing a single-pane audit of container resource governance.',
    flagsBreakdown: [
      { flag: '-f, --format', desc: 'Format output using Go template (e.g. {{ json .HostConfig }})', default: 'full JSON' }
    ],
    sampleOutput: `{
  "Memory": 2147483648,
  "MemorySwap": 2147483648,
  "MemoryReservation": 1073741824,
  "NanoCpus": 2000000000,
  "CpuShares": 0,
  "CpusetCpus": "0-3",
  "CpuQuota": 0,
  "CpuPeriod": 0,
  "PidsLimit": 500
}`,
    tips: ['Pipe this into CI/CD security audits to ensure developers are not launching unbounded containers in production!'],
    simulation: {
      type: 'inspect-resources-jq',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Dump HostConfig JSON Payload',
          description: 'Client retrieves container JSON metadata and evaluates `{{ json .HostConfig }}`.',
          kernelLogs: '[strace] read(3, "HTTP/1.1 200 OK\\r\\n...{\\"HostConfig\\":{...}}", 4096) = 4096',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'HostConfig JSON'
        },
        {
          stepNumber: 2,
          layerId: 'client',
          layerName: 'Linux Pipe & jq Process',
          title: 'Pipe JSON to jq Processor',
          description: 'Kernel pipe passes HostConfig JSON into `jq` stdin; jq filters specified resource keys.',
          kernelLogs: '[strace] pipe([4, 5]) = 0; clone() = 15201 (jq)\n[strace] write(5, "{\\"Memory\\":2147483648...}", 1024) = 1024',
          hardwareActivity: 'Pipe I/O memory buffer transfer.',
          statusBadge: 'Piped to jq'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Terminal Display',
          title: 'Formatted Hardware Audit Rendered',
          description: 'jq colorizes and outputs the 9 resource fields to terminal stdout.',
          kernelLogs: '[strace] write(1, "{\\n  \\"Memory\\": 2147483648,\\n...", 280) = 280',
          hardwareActivity: 'Terminal stdout rendered.',
          statusBadge: 'Audit Complete'
        }
      ]
    }
  },
  {
    id: 'docker-exec-cgroup-limits',
    name: 'Verify Effective Cgroup v2 Limits from Inside Container',
    command: 'docker exec my_container cat /sys/fs/cgroup/memory.max',
    category: 'intermediate',
    tags: ['Troubleshooting', 'Cgroups v2', 'Inside Container', 'Sysfs'],
    summary: 'Reads /sys/fs/cgroup/memory.max directly from within the container filesystem namespace to verify effective RAM ceiling.',
    syntaxTokens: [
      { text: 'docker exec', type: 'command', desc: 'Execute command inside running container' },
      { text: 'my_container', type: 'argument', desc: 'Container name or ID' },
      { text: 'cat /sys/fs/cgroup/memory.max', type: 'argument', desc: 'Read cgroup v2 unified memory limit sysfs file' }
    ],
    detailedDescription: 'Enters the container\'s mount, PID, and user namespaces to read `/sys/fs/cgroup/memory.max`. In cgroups v2, this reveals the exact byte limit (e.g. `536870912` for 512MB) or `max` if unlimited. Modern runtimes (Java 11+, Node 16+) read this file to size their internal heap.',
    flagsBreakdown: [
      { flag: 'exec', desc: 'Execute a command in a running container', default: 'none' }
    ],
    sampleOutput: `536870912`,
    tips: ['Use this to verify whether your container runtime is correctly seeing container cgroup limits or mistakenly detecting full host RAM.'],
    simulation: {
      type: 'exec-cgroup-limits',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Exec Creation Request',
          description: 'Sends `POST /v1.43/containers/my_container/exec` with `["cat", "/sys/fs/cgroup/memory.max"]`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/my_container/exec HTTP/1.1...", 220) = 220',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /exec'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (containerd & runc)',
          title: 'runc Enters Container Namespaces via setns()',
          description: 'runc opens container `/proc/[pid]/ns/mnt` and executes `setns()` to join mount namespace.',
          kernelLogs: '[runc] setns(open("/proc/14820/ns/mnt", O_RDONLY), CLONE_NEWNS) = 0\n[runc] execve("/bin/cat", ["cat", "/sys/fs/cgroup/memory.max"], ...)',
          hardwareActivity: 'Context switch into container namespace.',
          statusBadge: 'setns() Joined'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Container Isolated User-Space',
          title: 'Read Virtual cgroup2fs /sys/fs/cgroup/memory.max',
          description: 'Process reads virtual cgroup2fs file and returns exact configured bytes (`536870912` = 512MB).',
          kernelLogs: '[container] openat(AT_FDCWD, "/sys/fs/cgroup/memory.max", O_RDONLY) = 3; read(3, "536870912\\n", 128) = 10',
          hardwareActivity: 'Virtual VFS cgroup file read.',
          statusBadge: '536870912 Bytes'
        }
      ]
    }
  },
  {
    id: 'docker-compose-top',
    name: 'Monitor Service Host PIDs & Resource Usage (Compose Top)',
    command: 'docker compose top web',
    category: 'intermediate',
    tags: ['Compose', 'Process', 'Monitoring', 'PID'],
    summary: 'Displays all active processes running across all container replicas of a Compose service, showing host PIDs and command lines.',
    syntaxTokens: [
      { text: 'docker compose', type: 'command', desc: 'Docker Compose CLI' },
      { text: 'top', type: 'subcommand', desc: 'Display the running processes of a service' },
      { text: 'web', type: 'argument', desc: 'Target service name in compose.yaml' }
    ],
    detailedDescription: 'Iterates through all container instances backing the specified service in `docker-compose.yml`, querying the Docker daemon for process status tables (`docker top`) and combining them into a unified project view.',
    flagsBreakdown: [
      { flag: 'top', desc: 'Display the running processes', default: 'all services' },
      { flag: '[service]', desc: 'Target service name', default: 'all' }
    ],
    sampleOutput: `web-1
UID    PID     PPID    C   STIME   TTY   TIME       CMD
root   14280   14250   0   00:15   ?     00:00:01   nginx: master process /usr/sbin/nginx -g daemon off;
101    14310   14280   0   00:15   ?     00:00:03   nginx: worker process`,
    tips: ['Ideal for locating runaway microservice worker processes directly on the host OS for strace debugging or perf profiling.'],
    simulation: {
      type: 'compose-top',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Compose Client',
          title: 'Resolve Service Containers in Compose Project',
          description: 'Compose discovers container `myproject-web-1` and issues `GET /v1.43/containers/myproject-web-1/top`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/myproject-web-1/top HTTP/1.1...", 180) = 180',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /containers/top'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (procfs task inspection)',
          title: 'Kernel Resolves Container PID Namespace to Host PIDs',
          description: 'Kernel reads `/proc` task list, translating container-local PID 1 into host PID 14280 and worker to host PID 14310.',
          kernelLogs: '[kernel] translate pid: container pid 1 -> host pid 14280 (nginx master)',
          hardwareActivity: 'Kernel task_struct traversal.',
          statusBadge: 'Host PIDs Resolved'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Compose Terminal Output',
          title: 'Multi-Process Table Rendered',
          description: 'Renders formatted table showing service name, container replica, host PIDs, CPU %, and command lines.',
          kernelLogs: '[strace] write(1, "web-1\\nUID    PID     PPID...", 240) = 240',
          hardwareActivity: 'Terminal stdout rendered.',
          statusBadge: 'Process Table Printed'
        }
      ]
    }
  }
];

