// Comprehensive Docker Commands Data with Hardware, Kernel, Host, Client, and Application Execution Pathways
// Sourced & expanded from PhoenixNAP, doc/docker volums.md, doc/docker cpu and memory.md, and doc/Docker-Cheat-Sheet.pdf
import { NEW_DOCKER_COMMANDS } from './newCommands.js';


export const ARCHITECTURE_LAYERS = [
  {
    id: 'client',
    name: '1. Docker Client',
    sub: 'CLI & API Client',
    icon: 'Terminal',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    desc: 'Receives user commands, parses flags/arguments, serializes JSON HTTP requests, and sends payload over Unix socket (/var/run/docker.sock) or TCP.'
  },
  {
    id: 'host',
    name: '2. Docker Host Engine',
    sub: 'dockerd, containerd, runc',
    icon: 'Server',
    color: '#0ea5e9',
    glow: 'rgba(14, 165, 233, 0.4)',
    desc: 'The Docker daemon (dockerd) routes API requests to containerd. containerd pulls images, unpacks rootfs, and invokes OCI runc to spawn the container runtime shim.'
  },
  {
    id: 'kernel',
    name: '3. Host OS Kernel',
    sub: 'Linux Syscalls, Namespaces, Cgroups',
    icon: 'Cpu',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    desc: 'Executes clone(), pivot_root(), unshare(), and setns() syscalls. Partitions PID, NET, MNT, IPC, UTS namespaces, enforces cgroups v2 limits, and sets up veth/iptables.'
  },
  {
    id: 'motherboard',
    name: '4. Motherboard & Hardware',
    sub: 'CPU Ring 0/3, RAM, DMA, NVMe, NIC',
    icon: 'Microchip',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    desc: 'Direct hardware layer: CPU privilege rings switch, MMU memory virtualization & page tables, NVMe Direct Memory Access (DMA) for OverlayFS, and NIC network interrupts (IRQ).'
  },
  {
    id: 'app',
    name: '5. Container Application',
    sub: 'Isolated PID 1, stdio, Port Listening',
    icon: 'Box',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    desc: 'Application process runs in isolated user-space (Ring 3). Bound to virtual loopback/eth0, reading from container rootfs, streaming stdout/stderr to containerd-shim.'
  }
];

const BASE_COMMANDS = [
  // ==================== BASIC COMMANDS ====================
  {
    id: 'docker-run',
    name: 'Run Container with Port Forwarding',
    command: 'docker run -d -p 80:80 --name web-nginx nginx:alpine',
    category: 'basic',
    tags: ['Containers', 'Lifecycle', 'Networking'],
    summary: 'Spawns a new isolated container from the nginx:alpine image in detached mode with host port 80 mapped.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'The Docker CLI executable client' },
      { text: 'run', type: 'subcommand', desc: 'Creates a writeable container layer and starts it' },
      { text: '-d', type: 'flag', desc: '--detach: Run container in background and print container ID' },
      { text: '-p 80:80', type: 'flag', desc: '--publish: Map host port 80 to container internal port 80' },
      { text: '--name web-nginx', type: 'flag', desc: 'Assigns memorable container name instead of random uuid' },
      { text: 'nginx:alpine', type: 'image', desc: 'Docker image name and tag from registry' }
    ],
    detailedDescription: 'The `docker run` command combines `docker create` and `docker start`. It prompts the daemon to verify local image cache, pull from Docker Hub if missing, build an isolated OverlayFS rootfs, configure virtual networking interfaces (`veth`), enforce resource namespaces, and initiate the PID 1 container entrypoint.',
    flagsBreakdown: [
      { flag: '-d, --detach', desc: 'Executes container in background, freeing up current terminal shell', default: 'false' },
      { flag: '-p, --publish', desc: 'Specifies [hostPort]:[containerPort] routing via Linux iptables NAT', default: 'none' },
      { flag: '--name', desc: 'Custom unique string identifier for container management', default: 'generated string' },
      { flag: '--restart', desc: 'Restart policy (no, on-failure, always, unless-stopped)', default: 'no' },
      { flag: '-e, --env', desc: 'Set container environment variables', default: 'none' }
    ],
    sampleOutput: `b8f9e2193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d381ba93`,
    tips: [
      'Always specify specific image tags (e.g., nginx:1.25-alpine) instead of :latest in production to avoid unexpected breakage.',
      'Check active port bindings anytime with `docker port web-nginx` or `netstat -tuln` on the host.'
    ],
    simulation: {
      type: 'lifecycle-run',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client (CLI)',
          title: 'CLI Parsing & Socket Serialization',
          description: 'Docker CLI parses flags (-d, -p 80:80, --name). It constructs an HTTP POST payload for the Docker Engine REST API (/v1.43/containers/create) and streams it over the Unix domain socket `/var/run/docker.sock`.',
          kernelLogs: '[strace] connect(3, {sa_family=AF_UNIX, sun_path="/var/run/docker.sock"}, 110) = 0\n[strace] write(3, "POST /v1.43/containers/create?name=web-nginx HTTP/1.1\\r\\n...", 842) = 842',
          hardwareActivity: 'CPU Ring 3 User-mode: CLI binary execution. RAM buffer allocated for HTTP REST payload.',
          statusBadge: 'CLI -> Socket'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (dockerd & containerd)',
          title: 'Daemon API Dispatch & Image Layer Resolution',
          description: 'dockerd authenticates client, validates container name uniqueness, and invokes containerd via gRPC. containerd locates nginx:alpine image in /var/lib/docker/overlay2 and builds the runtime OCI bundle specification (config.json).',
          kernelLogs: '[dockerd] msg="container create" name=web-nginx image="nginx:alpine"\n[containerd] msg="bundle unpacked" bundle="/run/containerd/io.containerd.runtime.v2.task/moby/b8f9e219"',
          hardwareActivity: 'Storage Controller (NVMe): DMA read of read-only image layer manifests from disk blocks.',
          statusBadge: 'dockerd -> containerd'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware Layer',
          title: 'Ring Privilege Transition & Direct Memory Access',
          description: 'CPU switches from User Ring 3 to Supervisor Ring 0 via `sysenter`/`syscall` instruction. Memory controller allocates page tables for new address space. NVMe controller writes the ephemeral container write-layer (`upperdir`) via PCIe DMA bus.',
          kernelLogs: '[kernel/dma] pci 0000:01:00.0: DMA transfer 4096 bytes to RAM addr 0x7fff89201000\n[cpu] MSR_LSTAR dispatched: syscall entry point handler',
          hardwareActivity: 'CPU Core #2 context switch (Ring 3 -> Ring 0). TLB page cache invalidation. PCIe Gen4 x4 bus active.',
          statusBadge: 'Ring 0 & DMA'
        },
        {
          stepNumber: 4,
          layerId: 'kernel',
          layerName: 'OS Kernel (Namespaces & Cgroups)',
          title: 'Linux Namespaces Isolation & Cgroups Quotas',
          description: 'runc invokes `clone(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWIPC | CLONE_NEWUTS)`. Kernel mounts OverlayFS (lowerdir=image, upperdir=writable). Kernel initializes veth pair (`veth1a2b` connected to `docker0` bridge) and inserts iptables DNAT rule for port 80.',
          kernelLogs: '[kernel] clone(child_stack=0x7f, flags=CLONE_NEWPID|CLONE_NEWNET|CLONE_NEWNS|CLONE_NEWUTS|SIGCHLD) = 14820\n[kernel] overlayfs: mounted upperdir=/var/lib/docker/overlay2/diff, workdir=/work\n[iptables] -A DOCKER -p tcp -m tcp --dport 80 -j DNAT --to-destination 172.17.0.2:80',
          hardwareActivity: 'MMU registers programmed with isolated CR3 base pointer. Memory controller locks cgroup limit pages.',
          statusBadge: 'Namespaces & veth'
        },
        {
          stepNumber: 5,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'PID 1 Entrypoint Boot & Socket Listen',
          description: 'runc executes `pivot_root()` and drops Linux capabilities. It `execve()` the nginx binary inside the container. To the container, nginx is PID 1 with IP 172.17.0.2. Nginx binds port 80 and streams access logs to containerd-shim via stdout pipe.',
          kernelLogs: '[container] execve("/usr/sbin/nginx", ["nginx", "-g", "daemon off;"], [/* 8 vars */]) = 0\n[nginx] 2026/10/18 00:00:01 [notice] 1#1: using the "epoll" event method\n[nginx] 2026/10/18 00:00:01 [notice] 1#1: start worker processes',
          hardwareActivity: 'Application user-mode code executes in isolated Ring 3. Epoll syscall listens on virtual eth0 socket.',
          statusBadge: 'Container Running (PID 1)'
        }
      ]
    }
  },
  {
    id: 'docker-ps',
    name: 'List Active Containers',
    command: 'docker ps -a',
    category: 'basic',
    tags: ['Containers', 'Inspection', 'Status'],
    summary: 'Queries and tabulates all containers currently running, stopped, or exited on the Docker host.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI executable' },
      { text: 'ps', type: 'subcommand', desc: 'Process Status: lists container table' },
      { text: '-a', type: 'flag', desc: '--all: Show all containers (default shows just running)' }
    ],
    detailedDescription: 'The `docker ps` command queries the Docker daemon state engine to inspect container metadata, including container ID, associated image, command executed, created elapsed time, uptime status, exposed port bindings, and container names.',
    flagsBreakdown: [
      { flag: '-a, --all', desc: 'Displays all containers regardless of current status', default: 'false' },
      { flag: '-q, --quiet', desc: 'Outputs only numeric container IDs', default: 'false' },
      { flag: '--filter', desc: 'Filter output based on conditions (e.g., status=running)', default: 'none' },
      { flag: '--format', desc: 'Pretty-print containers using a Go template format', default: 'table' }
    ],
    sampleOutput: `CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                NAMES
b8f9e2193b21   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:80->80/tcp   web-nginx
e31c7901da42   redis:7        "docker-entrypoint.s…"   10 hours ago    Exited (0)                          cache-redis`,
    tips: [
      'Use `docker ps -q | xargs docker stop` to quickly stop all currently running containers in your test environment.'
    ],
    simulation: {
      type: 'query-status',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client (CLI)',
          title: 'Parse Query & Open Socket',
          description: 'CLI parses `-a` flag and makes an HTTP GET request to `/v1.43/containers/json?all=1` across the local `/var/run/docker.sock` socket.',
          kernelLogs: '[strace] socket(AF_UNIX, SOCK_STREAM, 0) = 3\n[strace] write(3, "GET /v1.43/containers/json?all=1 HTTP/1.1\\r\\n...", 124) = 124',
          hardwareActivity: 'CPU executes CLI parser; Unix socket file descriptor allocated in kernel inode table.',
          statusBadge: 'GET /containers/json'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (dockerd)',
          title: 'Memory State Lookup & containerd Task Polling',
          description: 'dockerd queries its in-memory container store (`container.Store`) and asks containerd for task PID status and exit codes for exited containers.',
          kernelLogs: '[dockerd] msg="listing containers" all=true filter=""\n[containerd] msg="task list" count=2 active=1',
          hardwareActivity: 'RAM memory read from dockerd process heap cache. Fast sub-millisecond retrieval.',
          statusBadge: 'Memory Cache Read'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Process State Verification via /proc',
          description: 'Kernel checks host `/proc/[pid]/status` entries to verify running PIDs are alive and returns state to containerd-shim.',
          kernelLogs: '[kernel] openat(AT_FDCWD, "/proc/14820/status", O_RDONLY) = 4\n[kernel] read(4, "State:\\tR (running)...", 1024) = 1024',
          hardwareActivity: 'Kernel VFS reads virtual procfs in RAM without touching mechanical/flash disk.',
          statusBadge: '/proc VFS Read'
        },
        {
          stepNumber: 4,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Format & Render Table to stdout',
          description: 'Client receives JSON array, formats column headers (CONTAINER ID, IMAGE, STATUS, PORTS), and prints cleanly to user terminal.',
          kernelLogs: '[strace] write(1, "CONTAINER ID   IMAGE          COMMAND...", 248) = 248',
          hardwareActivity: 'Terminal emulator GPU rendering text frame buffer to display output.',
          statusBadge: 'Formatted Table'
        }
      ]
    }
  },
  {
    id: 'docker-stop',
    name: 'Gracefully Stop Container',
    command: 'docker stop web-nginx',
    category: 'basic',
    tags: ['Containers', 'Lifecycle', 'Signals'],
    summary: 'Sends SIGTERM to container PID 1, allows grace period (10s default), then sends SIGKILL if still running.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'stop', type: 'subcommand', desc: 'Stops one or more running containers' },
      { text: 'web-nginx', type: 'argument', desc: 'Container name or 64-char container hex ID' }
    ],
    detailedDescription: 'Stopping a container is an orderly 2-stage shutdown. First, `SIGTERM` (signal 15) is sent to allow the application to flush buffers, finish active HTTP transactions, and close database connections. If the process has not terminated within 10 seconds, `SIGKILL` (signal 9) is enforced by the kernel.',
    flagsBreakdown: [
      { flag: '-t, --time', desc: 'Seconds to wait for container to stop before killing it forcefully', default: '10' }
    ],
    sampleOutput: `web-nginx`,
    tips: [
      'If your container takes 10 seconds every time it stops, your PID 1 process is ignoring SIGTERM! Wrap it with dumb-init or tini.'
    ],
    simulation: {
      type: 'lifecycle-stop',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client (CLI)',
          title: 'Stop Request Dispatch',
          description: 'Client sends `POST /v1.43/containers/web-nginx/stop?t=10` via unix domain socket.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/web-nginx/stop?t=10 HTTP/1.1\\r\\n...", 210) = 210',
          hardwareActivity: 'CLI triggers socket interrupt.',
          statusBadge: 'POST /stop'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (containerd-shim)',
          title: 'Signal Forwarding via shim',
          description: 'dockerd routes command to containerd. The container shim task process sends signal 15 (SIGTERM) to target PID 1.',
          kernelLogs: '[containerd-shim] msg="sending signal" pid=14820 signal=15',
          hardwareActivity: 'Process inter-thread message queuing.',
          statusBadge: 'SIGTERM (15)'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Kernel Signal Delivery & Cleanup',
          description: 'Kernel registers signal delivery to PID 1. When application exits, kernel cleans process memory tables and tears down veth interface.',
          kernelLogs: '[kernel] send_signal(15, 14820) -> task_struct delivery\n[kernel] do_exit(0) called for PID 14820 (nginx)\n[kernel] veth1a2b: link state changed to DOWN',
          hardwareActivity: 'CPU executes kernel memory reclamation. MMU frees page frames back to free memory pool.',
          statusBadge: 'do_exit() & Page Free'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Application Graceful Exit',
          description: 'Nginx master process receives SIGTERM, notifies worker processes, closes listening sockets, and terminates with code 0.',
          kernelLogs: '[nginx] 2026/10/18 00:02:11 [notice] 1#1: signal 15 (SIGTERM) received, exiting gracefully',
          hardwareActivity: 'Disk buffer sync (fsync) for access logs.',
          statusBadge: 'Exit 0'
        }
      ]
    }
  },
  {
    id: 'docker-start',
    name: 'Start Stopped Container',
    command: 'docker start web-nginx',
    category: 'basic',
    tags: ['Containers', 'Lifecycle'],
    summary: 'Restarts an existing stopped container, preserving its modified file state on its writable layer.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'start', type: 'subcommand', desc: 'Start one or more stopped containers' },
      { text: 'web-nginx', type: 'argument', desc: 'Target container name' }
    ],
    detailedDescription: 'Unlike `docker run`, `docker start` re-uses the existing container filesystem diff layer, preserved configuration, network settings, and volumes without creating a new container entity.',
    flagsBreakdown: [
      { flag: '-a, --attach', desc: 'Attach STDOUT/STDERR and forward signals', default: 'false' },
      { flag: '-i, --interactive', desc: 'Attach container STDIN', default: 'false' }
    ],
    sampleOutput: `web-nginx`,
    tips: ['Files created in the previous run inside the container are preserved when using `docker start`.'],
    simulation: {
      type: 'lifecycle-start',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Post Start Request',
          description: 'Sends POST to `/v1.43/containers/web-nginx/start`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/web-nginx/start HTTP/1.1\\r\\n...", 180) = 180',
          hardwareActivity: 'CLI socket write.',
          statusBadge: 'POST /start'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Task Re-attachment via containerd',
          description: 'containerd re-creates shim and instructs runc to execute container init process using existing bundle.',
          kernelLogs: '[containerd] msg="starting task" id=b8f9e2193b21',
          hardwareActivity: 'NVMe read config.json.',
          statusBadge: 'runc start'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel',
          title: 'Rebind Namespaces & Up veth',
          description: 'Kernel recreates namespaces, attaches veth to docker0 bridge, and restores iptables port mapping.',
          kernelLogs: '[kernel] clone() = 15201\n[kernel] veth1a2b: link state changed to UP',
          hardwareActivity: 'NIC packet routing re-enabled.',
          statusBadge: 'veth UP'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Application',
          title: 'Nginx Process Resumed',
          description: 'Application boots back up with existing config and modified files.',
          kernelLogs: '[nginx] master process started with existing logs intact',
          hardwareActivity: 'CPU Ring 3 execution.',
          statusBadge: 'Running'
        }
      ]
    }
  },
  {
    id: 'docker-restart',
    name: 'Restart Container',
    command: 'docker restart web-nginx',
    category: 'basic',
    tags: ['Containers', 'Lifecycle'],
    summary: 'Performs atomic stop followed by start on the specified container.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'restart', type: 'subcommand', desc: 'Restart one or more containers' },
      { text: 'web-nginx', type: 'argument', desc: 'Container name or ID' }
    ],
    detailedDescription: 'Convenient shorthand for `docker stop -t 10` followed immediately by `docker start`. Useful when container configuration files or environment state change.',
    flagsBreakdown: [
      { flag: '-t, --time', desc: 'Seconds to wait for stop before killing container', default: '10' }
    ],
    sampleOutput: `web-nginx`,
    tips: ['When updating config volumes, restart is sufficient to let container re-read files.'],
    simulation: {
      type: 'lifecycle-restart',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Restart Request',
          description: 'Client sends `POST /v1.43/containers/web-nginx/restart`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/web-nginx/restart HTTP/1.1...", 190) = 190',
          hardwareActivity: 'Socket dispatch.',
          statusBadge: 'POST /restart'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel',
          title: 'Cycle Process Trees',
          description: 'Kernel halts active PID, tears down previous namespaces, and immediately spawns a fresh PID tree.',
          kernelLogs: '[kernel] kill(14820, SIGTERM)\n[kernel] clone(CLONE_NEWPID|CLONE_NEWNET) = 15340',
          hardwareActivity: 'Page table flushing & re-allocation.',
          statusBadge: 'PID Re-spawn'
        },
        {
          stepNumber: 3,
          layerId: 'app',
          layerName: 'Application',
          title: 'Service Re-initialized',
          description: 'App process restarts cleanly.',
          kernelLogs: '[nginx] master process initialized',
          hardwareActivity: 'User-space execution.',
          statusBadge: 'Healthy'
        }
      ]
    }
  },
  {
    id: 'docker-pause',
    name: 'Pause Container Processes',
    command: 'docker pause web-nginx',
    category: 'basic',
    tags: ['Containers', 'Cgroups', 'Lifecycle'],
    summary: 'Suspends all processes in a container using the Linux cgroups freezer subsystem without killing them.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'pause', type: 'subcommand', desc: 'Pause all processes within one or more containers' },
      { text: 'web-nginx', type: 'argument', desc: 'Container target' }
    ],
    detailedDescription: 'Rather than stopping a container and terminating processes, `docker pause` leverages the Linux cgroup freezer controller (`cgroup.freeze` in cgroups v2). The processes remain in memory with CPU cycles completely halted, and can be instantly resumed via `docker unpause`.',
    flagsBreakdown: [],
    sampleOutput: `web-nginx`,
    tips: ['Paused containers hold RAM memory allocations but consume 0% CPU clock cycles.'],
    simulation: {
      type: 'cgroups-pause',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Pause API Call',
          description: 'Sends POST request to `/v1.43/containers/web-nginx/pause`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/containers/web-nginx/pause HTTP/1.1\\r\\n...", 185) = 185',
          hardwareActivity: 'Socket send.',
          statusBadge: 'POST /pause'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Containerd Cgroups Freezer Call',
          description: 'containerd locates the container cgroup directory `/sys/fs/cgroup/docker/[id]` and writes `1` to `cgroup.freeze`.',
          kernelLogs: '[containerd] msg="freezing container cgroup" id=b8f9e2193b21',
          hardwareActivity: 'Sysfs write.',
          statusBadge: 'cgroup.freeze=1'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Kernel Scheduler Halts Process Queues',
          description: 'Linux completely removes tasks from runqueue (`TASK_FROZEN`). Process state transitions to `D` (Uninterruptible Sleep/Frozen). Memory remains locked.',
          kernelLogs: '[kernel] cgroup_freeze_task: PID 14820 state updated to TASK_FROZEN\n[kernel] sched: task 14820 removed from CFS runqueue on CPU #2',
          hardwareActivity: 'CPU stops scheduler timeslices for container PIDs. RAM state preserved.',
          statusBadge: 'TASK_FROZEN'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Zero CPU Clock Cycle Freeze',
          description: 'Container application is frozen mid-execution; network packets sent to it queue up in TCP receive buffers.',
          kernelLogs: '[tcp] incoming SYN packet queued in socket backlog buffer',
          hardwareActivity: '0% CPU utilization, RAM unchanged.',
          statusBadge: 'Frozen'
        }
      ]
    }
  },
  {
    id: 'docker-rm',
    name: 'Remove Container & Filesystem',
    command: 'docker rm -f web-nginx',
    category: 'basic',
    tags: ['Containers', 'Cleanup', 'Storage'],
    summary: 'Forcefully terminates and deletes container configuration and its writeable OverlayFS layer.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'rm', type: 'subcommand', desc: 'Remove one or more containers' },
      { text: '-f', type: 'flag', desc: '--force: Force the removal of a running container (using SIGKILL)' },
      { text: 'web-nginx', type: 'argument', desc: 'Target container name' }
    ],
    detailedDescription: 'When a container is deleted, Docker stops it (if running with `-f`), removes its metadata JSON, detaches virtual network interfaces, and unlinks the ephemeral OverlayFS `diff` directory from `/var/lib/docker/overlay2/`. Any data written inside the container not mounted to a volume is destroyed.',
    flagsBreakdown: [
      { flag: '-f, --force', desc: 'Force removal of running container via SIGKILL', default: 'false' },
      { flag: '-v, --volumes', desc: 'Remove anonymous volumes associated with the container', default: 'false' },
      { flag: '-l, --link', desc: 'Remove the specified link', default: 'false' }
    ],
    sampleOutput: `web-nginx`,
    tips: [
      'Data written to container filesystem without volumes is permanently lost when `docker rm` runs!'
    ],
    simulation: {
      type: 'storage-cleanup',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Delete Request Dispatch',
          description: 'Sends DELETE `/v1.43/containers/web-nginx?force=1&v=0`.',
          kernelLogs: '[strace] write(3, "DELETE /v1.43/containers/web-nginx?force=1 HTTP/1.1\\r\\n...", 215) = 215',
          hardwareActivity: 'CLI socket write.',
          statusBadge: 'DELETE /containers'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Containerd Shim Kill & Unmount',
          description: 'containerd terminates container-shim and unmounts the OverlayFS rootfs.',
          kernelLogs: '[containerd] msg="task deleted" id=b8f9e2193b21\n[dockerd] msg="unmounting container rootfs"',
          hardwareActivity: 'Kernel VFS unmount.',
          statusBadge: 'Unmount Rootfs'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware Layer',
          title: 'NVMe TRIM & Block Invalidation',
          description: 'The NVMe SSD controller receives TRIM / discard commands to free writeable layer flash storage blocks.',
          kernelLogs: '[nvme] nvme0n1: discard request for LBA blocks 0x24000-0x28000 completed',
          hardwareActivity: 'NVMe Controller flash wear leveling & block garbage collection.',
          statusBadge: 'NVMe TRIM'
        },
        {
          stepNumber: 4,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Network & Namespaces Deprovision',
          description: 'Kernel deletes virtual network pair `veth1a2b`, cleans up iptables rules, and destroys cgroups directory.',
          kernelLogs: '[kernel] iptables -D DOCKER -p tcp -m tcp --dport 80 -j DNAT\n[kernel] cgroup: destroyed /sys/fs/cgroup/docker/b8f9e2193b21',
          hardwareActivity: 'RAM structures freed.',
          statusBadge: 'Destroyed'
        }
      ]
    }
  },
  {
    id: 'docker-images',
    name: 'List Local Docker Images',
    command: 'docker images',
    category: 'basic',
    tags: ['Images', 'Storage'],
    summary: 'Lists all Docker images stored in the local graph driver cache along with tag, size, and image ID.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'images', type: 'subcommand', desc: 'List local images (alias for `docker image ls`)' }
    ],
    detailedDescription: 'Queries local image metadata cache stored in `/var/lib/docker/image/overlay2/imagedb/`. Shows repository names, tags, 12-char SHA256 digest IDs, creation dates, and virtual layer sizes on disk.',
    flagsBreakdown: [
      { flag: '-a, --all', desc: 'Show all images (including intermediate image layers)', default: 'false' },
      { flag: '-q, --quiet', desc: 'Only show numeric Image IDs', default: 'false' },
      { flag: '--digests', desc: 'Show sha256 digests', default: 'false' }
    ],
    sampleOutput: `REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
nginx        alpine    904b8cb1e405   2 days ago     42.6MB
ubuntu       22.04     35a88802559d   3 weeks ago    77.8MB
node         20-slim   674a589312b9   1 month ago    198MB`,
    tips: ['Dangling images without tags appear as `<none>:<none>` and can be cleaned with `docker image prune`.'],
    simulation: {
      type: 'query-images',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Query Images API',
          description: 'Client sends `GET /v1.43/images/json` to Docker daemon.',
          kernelLogs: '[strace] write(3, "GET /v1.43/images/json HTTP/1.1\\r\\n...", 110) = 110',
          hardwareActivity: 'CLI memory allocation.',
          statusBadge: 'GET /images'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Read Image Store & Calculate Sizes',
          description: 'dockerd queries content store and sums read-only layer sizes.',
          kernelLogs: '[dockerd] msg="images listed" count=3 duration=1.2ms',
          hardwareActivity: 'Fast RAM cache lookup.',
          statusBadge: 'Layer Summing'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Format Table Output',
          description: 'CLI renders formatted table with calculated sizes.',
          kernelLogs: '[strace] write(1, "REPOSITORY   TAG       IMAGE ID...", 184) = 184',
          hardwareActivity: 'Stdout terminal write.',
          statusBadge: 'Table Rendered'
        }
      ]
    }
  },
  {
    id: 'docker-pull',
    name: 'Pull Image from Registry',
    command: 'docker pull ubuntu:22.04',
    category: 'basic',
    tags: ['Images', 'Registry', 'Networking'],
    summary: 'Downloads image manifest and missing content layers from Docker Hub or private OCI registry over HTTPS.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'pull', type: 'subcommand', desc: 'Download an image from a registry' },
      { text: 'ubuntu:22.04', type: 'image', desc: 'Repository:tag to pull' }
    ],
    detailedDescription: 'Requests the image manifest via registry HTTP API v2. Calculates layer sha256 hashes against existing layers in `/var/lib/docker/overlay2`. Missing tar.gz layers are downloaded concurrently, decompressed via gzip, and stored as immutable lowerdir layers.',
    flagsBreakdown: [
      { flag: '-a, --all-tags', desc: 'Download all tagged images in the repository', default: 'false' },
      { flag: '-q, --quiet', desc: 'Suppress verbose pull progress output', default: 'false' }
    ],
    sampleOutput: `22.04: Pulling from library/ubuntu
2b8623767e65: Pull complete 
Digest: sha256:2b8623767e65e648f572a1065ec3b5a1b3be09e5
Status: Downloaded newer image for ubuntu:22.04
docker.io/library/ubuntu:22.04`,
    tips: ['Docker layer caching means already-downloaded layers are shared across different images, saving bandwidth and disk!'],
    simulation: {
      type: 'registry-pull',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Pull Command Dispatch',
          description: 'Client triggers `POST /v1.43/images/create?fromImage=ubuntu&tag=22.04`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/images/create?fromImage=ubuntu&tag=22.04...", 160) = 160',
          hardwareActivity: 'CLI socket write.',
          statusBadge: 'POST /images/create'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (NIC)',
          title: 'TLS Network Packet Exchange with Registry',
          description: 'Host NIC negotiates TLS 1.3 handshake with registry-1.docker.io:443. Incoming TCP packets trigger hardware MSI-X interrupts on CPU.',
          kernelLogs: '[nic] eth0: MSI-X interrupt vector 32 on CPU #1: 1460 bytes TCP payload received',
          hardwareActivity: 'NIC DMA transfer to RAM ring buffer. CPU Core #1 processes TLS decrypt.',
          statusBadge: 'NIC DMA & TLS'
        },
        {
          stepNumber: 3,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Layer Decompression & SHA256 Verification',
          description: 'containerd unpacks tar.gz blobs using hardware-accelerated gzip decompression and validates SHA256 cryptographic signatures.',
          kernelLogs: '[containerd] msg="unpacking layer" digest="sha256:2b862376..."\n[crypto] sha256 verified in 8.4ms',
          hardwareActivity: 'CPU AVX-512 instructions execute SHA256 hashing.',
          statusBadge: 'SHA256 Match'
        },
        {
          stepNumber: 4,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'NVMe Write to Overlay2 Graph Directory',
          description: 'Unpacked layer files are written directly into `/var/lib/docker/overlay2/[layer-id]/diff`.',
          kernelLogs: '[nvme] ext4 write 28.4MB at 850 MB/s to sector 0x889210',
          hardwareActivity: 'Direct Memory Access (DMA) storage write.',
          statusBadge: 'Disk Saved'
        }
      ]
    }
  },
  {
    id: 'docker-push',
    name: 'Push Image to Remote Registry',
    command: 'docker push myrepo/web-nginx:v1.0',
    category: 'basic',
    tags: ['Images', 'Registry'],
    summary: 'Uploads locally built image layers and manifest to Docker Hub or private container registry.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'push', type: 'subcommand', desc: 'Push image to registry' },
      { text: 'myrepo/web-nginx:v1.0', type: 'image', desc: 'Full repository/image:tag' }
    ],
    detailedDescription: 'Authenticates with registry using stored credentials (`~/.docker/config.json`). Uploads layer diff tarballs (checking if registry already possesses layer hashes to avoid re-uploading) and commits the image manifest schema v2.',
    flagsBreakdown: [
      { flag: '-a, --all-tags', desc: 'Push all tagged images in the repository', default: 'false' }
    ],
    sampleOutput: `The push refers to repository [docker.io/myrepo/web-nginx]
2b8623767e65: Pushed 
v1.0: digest: sha256:d891bcae3 size: 1572`,
    tips: ['Registry will respond with "Layer already exists" for any base layers it already has.'],
    simulation: {
      type: 'registry-push',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Push Auth & API Trigger',
          description: 'Client reads auth tokens and sends `POST /v1.43/images/myrepo/web-nginx/push`.',
          kernelLogs: '[strace] openat(AT_FDCWD, "/root/.docker/config.json", O_RDONLY) = 4',
          hardwareActivity: 'Disk read token.',
          statusBadge: 'POST /push'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (NIC)',
          title: 'Network Socket Stream Upload',
          description: 'Compressed layer chunks are transmitted through TCP transmit ring buffers on physical NIC.',
          kernelLogs: '[nic] eth0: TX ring buffer dispatched 4.2MB/s',
          hardwareActivity: 'NIC TX interrupt handling.',
          statusBadge: 'NIC TX'
        },
        {
          stepNumber: 3,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Manifest Commit & Digest Confirmation',
          description: 'Registry acknowledges manifest write and returns canonical sha256 digest.',
          kernelLogs: '[dockerd] msg="pushed image" digest=sha256:d891bcae3',
          hardwareActivity: 'RAM state update.',
          statusBadge: 'Digest Signed'
        }
      ]
    }
  },
  {
    id: 'docker-rmi',
    name: 'Remove Local Image',
    command: 'docker rmi nginx:alpine',
    category: 'basic',
    tags: ['Images', 'Cleanup'],
    summary: 'Deletes local image reference and untags/purges unreferenced layers from disk.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'rmi', type: 'subcommand', desc: 'Remove one or more images' },
      { text: 'nginx:alpine', type: 'image', desc: 'Image repository:tag or image ID' }
    ],
    detailedDescription: 'Untags the image. If no other tags or containers reference the underlying layer chain, the layer directories in `/var/lib/docker/overlay2` are pruned and space is returned to host.',
    flagsBreakdown: [
      { flag: '-f, --force', desc: 'Force removal of the image even if containers depend on it', default: 'false' },
      { flag: '--no-prune', desc: 'Do not delete untagged parents', default: 'false' }
    ],
    sampleOutput: `Untagged: nginx:alpine
Untagged: nginx@sha256:b8f9e2193b2184a4504193
Deleted: sha256:904b8cb1e405f6e80b2d3e4210a48e718b
Deleted: sha256:2b8623767e65e648f572a1065ec3b5a1b3`,
    tips: ['Cannot remove image if a stopped container still references it; remove container first or use -f.'],
    simulation: {
      type: 'image-delete',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Delete Image Request',
          description: 'Sends DELETE `/v1.43/images/nginx:alpine`.',
          kernelLogs: '[strace] write(3, "DELETE /v1.43/images/nginx:alpine HTTP/1.1\\r\\n...", 140) = 140',
          hardwareActivity: 'Socket dispatch.',
          statusBadge: 'DELETE /images'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Reference Count Check & Unlink',
          description: 'dockerd verifies 0 containers use this image, untags manifest, and decrements layer ref-counts.',
          kernelLogs: '[dockerd] msg="image untagged" tag="nginx:alpine"\n[dockerd] msg="layer refcount reached 0; deleting"',
          hardwareActivity: 'In-memory graph node prune.',
          statusBadge: 'Refcount = 0'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'NVMe Disk Layer Purge',
          description: 'Storage driver unlinks directories in `/var/lib/docker/overlay2`. SSD controller marks blocks as free.',
          kernelLogs: '[kernel] unlinkat() removed 4810 files in /var/lib/docker/overlay2',
          hardwareActivity: 'NVMe controller updates filesystem FAT/inode map.',
          statusBadge: 'Disk Space Reclaimed'
        }
      ]
    }
  },
  {
    id: 'docker-build',
    name: 'Build Image from Dockerfile',
    command: 'docker build -t myapp:1.0 .',
    category: 'basic',
    tags: ['Images', 'Build', 'Dockerfile'],
    summary: 'Executes instructions in a Dockerfile sequentially, caching unchanged layers and generating an OCI image.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'build', type: 'subcommand', desc: 'Build an image from a Dockerfile' },
      { text: '-t myapp:1.0', type: 'flag', desc: '--tag: Name and optionally a tag in "name:tag" format' },
      { text: '.', type: 'argument', desc: 'Build context path (local directory sent to daemon)' }
    ],
    detailedDescription: 'BuildKit packs the local directory into a tarball build context, evaluates Dockerfile instructions (`FROM`, `RUN`, `COPY`, `ENV`, `CMD`), runs build steps inside sandboxed containers or snapshotter, checks layer hashes against build cache, and tags the final image ID.',
    flagsBreakdown: [
      { flag: '-t, --tag', desc: 'Name and tag to assign to image', default: 'none' },
      { flag: '-f, --file', desc: 'Name of the Dockerfile (default is PATH/Dockerfile)', default: 'Dockerfile' },
      { flag: '--no-cache', desc: 'Do not use cache when building the image', default: 'false' },
      { flag: '--target', desc: 'Set the target build stage to build in multi-stage builds', default: 'none' }
    ],
    sampleOutput: `[+] Building 4.2s (8/8) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [1/3] FROM node:20-alpine
 => [2/3] COPY package*.json ./
 => [3/3] RUN npm ci --omit=dev
 => exporting to image
 => => naming to docker.io/library/myapp:1.0`,
    tips: [
      'Order Dockerfile instructions from least-frequently changed to most-frequently changed (e.g. package.json before src/) to maximize build cache hits.'
    ],
    simulation: {
      type: 'build-pipeline',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Tar Build Context & Stream to Daemon',
          description: 'Client evaluates `.dockerignore`, archives directory into a tar stream, and uploads to BuildKit.',
          kernelLogs: '[strace] read(4, "package.json", 1024) -> tar context stream (1.4MB)',
          hardwareActivity: 'RAM context compression.',
          statusBadge: 'Context Sent'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (BuildKit)',
          title: 'DAG Instruction Solver & Cache Check',
          description: 'BuildKit compiles Dockerfile into a Low-Level Intermediate Representation (LLB DAG). It compares SHA256 checksums to existing cache.',
          kernelLogs: '[buildkit] solver: stage 0 cached [1/3] FROM node:20-alpine\n[buildkit] solver: executing RUN npm ci',
          hardwareActivity: 'CPU multithreading compilation.',
          statusBadge: 'Cache Hit & Exec'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Ephemeral Snapshot Container Execution',
          description: 'Kernel spawns an isolated container sandbox to execute `RUN npm ci`. File changes are recorded to upperdir.',
          kernelLogs: '[kernel] clone(CLONE_NEWNS|CLONE_NEWPID) = 15890\n[kernel] overlayfs snapshot committed',
          hardwareActivity: 'NVMe write layer diff.',
          statusBadge: 'Layer Committed'
        },
        {
          stepNumber: 4,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Export OCI Image Manifest & Tag',
          description: 'BuildKit exports the layer chain, creates configuration JSON, and registers tag `myapp:1.0`.',
          kernelLogs: '[buildkit] image exported: sha256:77a892b1cd tagged myapp:1.0',
          hardwareActivity: 'Image store manifest written.',
          statusBadge: 'Image Ready'
        }
      ]
    }
  },
  {
    id: 'docker-version',
    name: 'Show Version & System Info',
    command: 'docker version',
    category: 'basic',
    tags: ['System', 'Information'],
    summary: 'Outputs detailed build metadata, Go compiler version, API versions, and kernel details for both client and daemon.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'version', type: 'subcommand', desc: 'Show Docker version information' }
    ],
    detailedDescription: 'Displays client version and queries daemon `/version` endpoint to report storage driver (overlay2), logging driver, cgroup driver (systemd/cgroupfs), kernel version, OS architecture, and containerd commit hash.',
    flagsBreakdown: [
      { flag: '--format', desc: 'Format the output using the given Go template', default: 'standard' }
    ],
    sampleOutput: `Client: Docker Engine - Community
 Version:           27.0.3
 API version:       1.46
 Go version:        go1.21.11
 Git commit:        7d4bed8
 OS/Arch:           linux/amd64

Server: Docker Engine - Community
 Engine:
  Version:          27.0.3
  API version:      1.46 (minimum version 1.24)
  Go version:       go1.21.11
  OS/Arch:          linux/amd64
  Kernel Version:   6.8.0-40-generic
 containerd:
  Version:          v1.7.19
 runc:
  Version:          v1.1.13`,
    tips: ['Check API version compatibility when connecting modern Docker CLI tools to remote older daemons.'],
    simulation: {
      type: 'info-query',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Version Query Call',
          description: 'Client prints internal build version and requests `GET /v1.43/version` from daemon.',
          kernelLogs: '[strace] write(3, "GET /v1.43/version HTTP/1.1\\r\\n...", 95) = 95',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /version'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'uname() Syscall Execution',
          description: 'dockerd calls `uname()` syscall to extract host Linux kernel release number (`6.8.0-generic`).',
          kernelLogs: '[kernel] uname({sysname="Linux", release="6.8.0-40-generic", machine="x86_64"}) = 0',
          hardwareActivity: 'Kernel system information read.',
          statusBadge: 'uname() Syscall'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Combined Formatted Output',
          description: 'Renders complete Client and Server specification matrix to terminal stdout.',
          kernelLogs: '[strace] write(1, "Client: Docker Engine...", 410) = 410',
          hardwareActivity: 'Stdout print.',
          statusBadge: 'Rendered'
        }
      ]
    }
  },

  // ==================== INTERMEDIATE COMMANDS ====================
  {
    id: 'docker-exec',
    name: 'Execute Command Inside Container',
    command: 'docker exec -it web-nginx /bin/sh',
    category: 'intermediate',
    tags: ['Containers', 'Debugging', 'Namespaces'],
    summary: 'Enters a running container namespace environment with an interactive terminal pseudo-TTY.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'exec', type: 'subcommand', desc: 'Run a command in a running container' },
      { text: '-i', type: 'flag', desc: '--interactive: Keep STDIN open even if not attached' },
      { text: '-t', type: 'flag', desc: '--tty: Allocate a pseudo-TTY terminal device' },
      { text: 'web-nginx', type: 'argument', desc: 'Target running container' },
      { text: '/bin/sh', type: 'command', desc: 'Shell command executed inside the container environment' }
    ],
    detailedDescription: '`docker exec` does NOT spawn a new container. Instead, it instructs runc and the Linux kernel to execute the `setns()` syscall, joining an existing container\'s PID, Network, Mount, IPC, and UTS namespaces. It allocates a pseudo-terminal pair (pty) so your host keyboard inputs pass directly to the container shell.',
    flagsBreakdown: [
      { flag: '-i, --interactive', desc: 'Keeps STDIN open for typing commands', default: 'false' },
      { flag: '-t, --tty', desc: 'Allocates pseudo-TTY (provides shell prompt and colors)', default: 'false' },
      { flag: '-u, --user', desc: 'Username or UID (e.g. -u 0 for root or -u node)', default: 'container default' },
      { flag: '-w, --workdir', desc: 'Working directory inside the container', default: 'container workdir' }
    ],
    sampleOutput: `/ # ls -la
total 64
drwxr-xr-x    1 root     root          4096 Oct 18 00:00 .
drwxr-xr-x    1 root     root          4096 Oct 18 00:00 ..
drwxr-xr-x    2 root     root          4096 Jul 20 14:22 bin
drwxr-xr-x    2 root     root          4096 Jul 20 14:22 etc
drwxr-xr-x    2 root     root          4096 Jul 20 14:22 var
/ # exit`,
    tips: [
      'If `/bin/bash` gives "no such file or directory", the image is likely Alpine-based! Use `/bin/sh` instead.'
    ],
    simulation: {
      type: 'namespace-join',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'PTY Terminal Hijack & WebSocket/Stream Init',
          description: 'Client puts local terminal into RAW mode, allocates a pseudo-terminal (pty), and initiates an HTTP POST `/containers/web-nginx/exec` with stream hijacking.',
          kernelLogs: '[strace] ioctl(0, TCGETS, {c_iflag=0x4500, c_oflag=0x5...}) = 0\n[strace] write(3, "POST /v1.43/containers/web-nginx/exec HTTP/1.1\\r\\n...", 280) = 280',
          hardwareActivity: 'Host keyboard raw keystroke capture.',
          statusBadge: 'Raw PTY Mode'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (containerd & runc)',
          title: 'Exec Process Bundle Preparation',
          description: 'containerd asks runc to spawn a new process inside the existing container task namespace.',
          kernelLogs: '[containerd] msg="exec process" container=b8f9e2193b21 process=/bin/sh',
          hardwareActivity: 'RAM allocation for IO pipes.',
          statusBadge: 'runc exec'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel (setns syscall)',
          title: 'Joining Namespaces via setns() Syscall',
          description: 'Kernel calls `setns(fd, CLONE_NEWNET | CLONE_NEWPID | CLONE_NEWNS)`. The new `/bin/sh` process is grafted into the container\'s isolated namespace view.',
          kernelLogs: '[kernel] openat(AT_FDCWD, "/proc/14820/ns/net", O_RDONLY) = 5\n[kernel] setns(5, CLONE_NEWNET) = 0\n[kernel] setns(6, CLONE_NEWPID) = 0\n[kernel] setns(7, CLONE_NEWNS) = 0',
          hardwareActivity: 'CPU register reload; Process joins container cgroup limits.',
          statusBadge: 'setns() Syscalls'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Interactive Shell Active Inside Container',
          description: '`/bin/sh` runs inside container filesystem. User types commands, stdout flows back through PTY pipe to host terminal.',
          kernelLogs: '[container] /bin/sh PID 16104 started, attached to pts/0\n[container] / # prompt displayed',
          hardwareActivity: 'Interactive shell loop running.',
          statusBadge: 'Shell Active'
        }
      ]
    }
  },
  {
    id: 'docker-logs',
    name: 'Stream Container Logs',
    command: 'docker logs -f --tail 100 web-nginx',
    category: 'intermediate',
    tags: ['Containers', 'Logging', 'Debugging'],
    summary: 'Streams stdout and stderr log streams multiplexed by the Docker logging driver.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'logs', type: 'subcommand', desc: 'Fetch the logs of a container' },
      { text: '-f', type: 'flag', desc: '--follow: Follow log output stream in real time' },
      { text: '--tail 100', type: 'flag', desc: 'Number of lines to show from the end of the logs' },
      { text: 'web-nginx', type: 'argument', desc: 'Container name' }
    ],
    detailedDescription: 'Docker intercepts standard output (file descriptor 1) and standard error (file descriptor 2) from container PID 1 via FIFO pipes managed by containerd-shim. By default, logs are encoded into JSON files in `/var/lib/docker/containers/[id]/[id]-json.log`. `docker logs -f` reads previous lines and watches for new inotify write events.',
    flagsBreakdown: [
      { flag: '-f, --follow', desc: 'Stream live updates as logs are generated', default: 'false' },
      { flag: '--tail', desc: 'Number of lines from end of log file to display', default: 'all' },
      { flag: '-t, --timestamps', desc: 'Prefix each log line with RFC3339 timestamp', default: 'false' },
      { flag: '--since', desc: 'Show logs since timestamp (e.g. 2026-10-18T00:00:00 or 10m)', default: 'none' }
    ],
    sampleOutput: `2026/10/18 00:00:01 [notice] 1#1: using the "epoll" event method
2026/10/18 00:00:01 [notice] 1#1: nginx/1.25.4
2026/10/18 00:00:01 [notice] 1#1: start worker processes
172.17.0.1 - - [18/Oct/2026:00:03:12 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0" "-"`,
    tips: ['Configure log rotation (`max-size: 10m`, `max-file: 3`) in `/etc/docker/daemon.json` to prevent disk filling!'],
    simulation: {
      type: 'logging-stream',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Log Streaming Request',
          description: 'Client connects and sends `GET /v1.43/containers/web-nginx/logs?stdout=1&stderr=1&follow=1&tail=100`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/web-nginx/logs?stdout=1&follow=1...", 240) = 240',
          hardwareActivity: 'Socket keep-alive connection established.',
          statusBadge: 'GET /logs (Follow)'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (containerd-shim)',
          title: 'FIFO Pipe Demuxing & JSON-Log Tail',
          description: 'containerd-shim reads stdout FIFO pipe from container process. Docker daemon reads JSON-log file and attaches an inotify watcher.',
          kernelLogs: '[dockerd] msg="reading log stream" file="/var/lib/docker/containers/...-json.log"',
          hardwareActivity: 'RAM ring buffer multiplexer.',
          statusBadge: 'FIFO Demux'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Kernel inotify Syscall Event Trigger',
          description: 'Kernel fires `IN_MODIFY` event whenever Nginx writes access log entries to file descriptor 1.',
          kernelLogs: '[kernel] inotify_add_watch(6, "...-json.log", IN_MODIFY) = 1\n[kernel] vfs_write(1, "172.17.0.1 - - GET...", 78) = 78',
          hardwareActivity: 'Storage cache event dispatched.',
          statusBadge: 'inotify Event'
        },
        {
          stepNumber: 4,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Live Terminal Stream Output',
          description: 'Client parses 8-byte Docker stream header (stream type + frame size) and writes log lines directly to screen.',
          kernelLogs: '[strace] write(1, "172.17.0.1 - - [18/Oct/2026...\\n", 82) = 82',
          hardwareActivity: 'GPU text buffer refreshed.',
          statusBadge: 'Real-time Stream'
        }
      ]
    }
  },
  {
    id: 'docker-inspect',
    name: 'Inspect Low-Level Container Metadata',
    command: 'docker inspect web-nginx',
    category: 'intermediate',
    tags: ['Inspection', 'JSON', 'Architecture'],
    summary: 'Dumps raw JSON configuration containing network IPs, storage mounts, cgroups limits, and health status.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'inspect', type: 'subcommand', desc: 'Return low-level information on Docker objects' },
      { text: 'web-nginx', type: 'argument', desc: 'Container or Image name/ID' }
    ],
    detailedDescription: 'Returns complete JSON dump of the Docker object state: exact PID, IP address, MAC address, gateway, volume binds, environment variables, restart counts, health check logs, and host config.',
    flagsBreakdown: [
      { flag: '-f, --format', desc: 'Format output using Go template (e.g. `{{.NetworkSettings.IPAddress}}`)', default: 'raw json' }
    ],
    sampleOutput: `[
  {
    "Id": "b8f9e2193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d381ba93",
    "Created": "2026-10-18T00:00:00.129381Z",
    "State": { "Status": "running", "Running": true, "Pid": 14820 },
    "NetworkSettings": {
      "IPAddress": "172.17.0.2",
      "Gateway": "172.17.0.1",
      "MacAddress": "02:42:ac:11:00:02"
    }
  }
]`,
    tips: ['Extract specific container IP address instantly: `docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" web-nginx`.'],
    simulation: {
      type: 'json-inspect',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Inspect Request',
          description: 'Client calls `GET /v1.43/containers/web-nginx/json`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/web-nginx/json HTTP/1.1...", 160) = 160',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /json'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Memory Struct Serialization',
          description: 'dockerd serializes internal container struct into JSON format.',
          kernelLogs: '[dockerd] msg="inspect container" id=b8f9e2193b21',
          hardwareActivity: 'RAM JSON string generation.',
          statusBadge: 'JSON Marshalling'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Syntax Highlighted JSON Output',
          description: 'Prints full formatted configuration structure.',
          kernelLogs: '[strace] write(1, "[\n  {\n    \"Id\": \"b8f9e21...", 1420) = 1420',
          hardwareActivity: 'Terminal output render.',
          statusBadge: 'JSON Dump'
        }
      ]
    }
  },
  {
    id: 'docker-top',
    name: 'Display Container Host Processes',
    command: 'docker top web-nginx',
    category: 'intermediate',
    tags: ['Processes', 'Inspection', 'Kernel'],
    summary: 'Maps isolated container processes to their real host Linux PID numbers.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'top', type: 'subcommand', desc: 'Display the running processes of a container' },
      { text: 'web-nginx', type: 'argument', desc: 'Target container' }
    ],
    detailedDescription: 'Inside a container, a process thinks it is PID 1 due to the Linux PID namespace. On the host operating system, this process is just an ordinary Linux process with a high host PID (e.g. PID 14820). `docker top` queries the host kernel `/proc` tree to map these numbers.',
    flagsBreakdown: [
      { flag: '[ps OPTIONS]', desc: 'Pass standard ps options (e.g. aux or -ef)', default: '-ef' }
    ],
    sampleOutput: `UID     PID     PPID    C   STIME   TTY   TIME       CMD
root    14820   14798   0   00:00   ?     00:00:00   nginx: master process nginx -g daemon off;
101     14856   14820   0   00:00   ?     00:00:00   nginx: worker process`,
    tips: ['This proves containers are NOT virtual machines: they run directly as bare-metal processes on the host Linux kernel!'],
    simulation: {
      type: 'pid-mapping',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Query Container Processes',
          description: 'Sends `GET /v1.43/containers/web-nginx/top`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/web-nginx/top HTTP/1.1...", 150) = 150',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /top'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Cgroup PIDs Listing',
          description: 'dockerd reads `/sys/fs/cgroup/docker/[id]/cgroup.procs` to find all host PIDs attached to this container.',
          kernelLogs: '[dockerd] reading cgroup.procs -> found PIDs [14820, 14856]',
          hardwareActivity: 'Sysfs read.',
          statusBadge: 'cgroup.procs'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Kernel /proc Host Process Inspection',
          description: 'Kernel returns CPU usage, memory stats, and command strings from `/proc/[pid]/stat`.',
          kernelLogs: '[kernel] openat(AT_FDCWD, "/proc/14820/cmdline", O_RDONLY) = 4',
          hardwareActivity: 'Procfs VFS read.',
          statusBadge: 'Host PIDs'
        },
        {
          stepNumber: 4,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Render Host Process Map Table',
          description: 'Prints host PIDs and command hierarchy.',
          kernelLogs: '[strace] write(1, "UID     PID     PPID...", 190) = 190',
          hardwareActivity: 'Terminal print.',
          statusBadge: 'PID Map Table'
        }
      ]
    }
  },
  {
    id: 'docker-stats',
    name: 'Live Hardware & Resource Metrics',
    command: 'docker stats --no-stream',
    category: 'intermediate',
    tags: ['Monitoring', 'Hardware', 'Cgroups'],
    summary: 'Reads live CPU percentage, Memory usage, Network I/O, and Block I/O from Linux cgroups v2 files.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'stats', type: 'subcommand', desc: 'Display a live stream of container(s) resource usage statistics' },
      { text: '--no-stream', type: 'flag', desc: 'Disable streaming stats and only pull the first result snapshot' }
    ],
    detailedDescription: 'Docker reads hardware metrics directly from the kernel cgroup controllers: CPU usage from `cpu.stat`, Memory usage and limits from `memory.current` and `memory.max`, Block disk I/O from `io.stat`, and network packet counters from `/proc/net/dev` inside the container netns.',
    flagsBreakdown: [
      { flag: '--no-stream', desc: 'Pull first snapshot and exit instead of continuous streaming', default: 'false' },
      { flag: '-a, --all', desc: 'Show all containers (default shows just running)', default: 'false' },
      { flag: '--format', desc: 'Pretty-print stats using a Go template', default: 'table' }
    ],
    sampleOutput: `CONTAINER ID   NAME        CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
b8f9e2193b21   web-nginx   0.08%     6.42MiB / 15.63GiB    0.04%     1.24kB / 842B     0B / 12.3kB       2`,
    tips: ['Essential for diagnosing CPU bottlenecks and Out-Of-Memory (OOM) killed containers.'],
    simulation: {
      type: 'hardware-metrics',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Stats Request Call',
          description: 'Client calls `GET /v1.43/containers/web-nginx/stats?stream=false`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/web-nginx/stats?stream=false HTTP/1.1...", 180) = 180',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /stats'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware Layer',
          title: 'Hardware Performance Counters (PMU)',
          description: 'CPU Hardware Performance Monitoring Units (PMU) track clock cycles and instructions retired per core.',
          kernelLogs: '[hardware/pmu] CPU Core 2: 412,800 cycles in container timeslice',
          hardwareActivity: 'Hardware PMU registers read.',
          statusBadge: 'CPU PMU Counters'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel (cgroups v2 stats)',
          title: 'Kernel Accounting Accumulation',
          description: 'Kernel aggregates `cpu.stat` (usage_usec) and `memory.current` (bytes allocated in RAM pages).',
          kernelLogs: '[kernel] read /sys/fs/cgroup/docker/b8f9/cpu.stat -> usage_usec 48192\n[kernel] read /sys/fs/cgroup/docker/b8f9/memory.current -> 6731776 bytes',
          hardwareActivity: 'RAM page cache accounting calculation.',
          statusBadge: 'cgroup.stat Read'
        },
        {
          stepNumber: 4,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Calculate Percentages & Display',
          description: 'CLI calculates delta CPU % = (delta container / delta system) * online CPUs and displays table.',
          kernelLogs: '[strace] write(1, "CONTAINER ID   NAME        CPU %...", 210) = 210',
          hardwareActivity: 'Terminal output rendered.',
          statusBadge: 'Live Stats'
        }
      ]
    }
  },
  {
    id: 'docker-cp',
    name: 'Copy Files Across Host and Container',
    command: 'docker cp ./app.conf web-nginx:/etc/nginx/conf.d/app.conf',
    category: 'intermediate',
    tags: ['Filesystem', 'Storage', 'OverlayFS'],
    summary: 'Streams files or directories between the host filesystem and container OverlayFS layer via tar archive.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'cp', type: 'subcommand', desc: 'Copy files/folders between a container and local filesystem' },
      { text: './app.conf', type: 'argument', desc: 'Source file on host machine' },
      { text: 'web-nginx:/etc/nginx/conf.d/app.conf', type: 'argument', desc: 'Destination path inside container' }
    ],
    detailedDescription: '`docker cp` works even if the container is stopped! The CLI archives source files into a tar stream, transmits it to the daemon over socket, and the daemon unpacks it directly into the container\'s `upperdir` writeable layer in `/var/lib/docker/overlay2/`.',
    flagsBreakdown: [
      { flag: '-a, --archive', desc: 'Archive mode (copy all uid/gid information)', default: 'false' },
      { flag: '-L, --follow-link', desc: 'Always follow symbol link in source path', default: 'false' }
    ],
    sampleOutput: `Successfully copied 2.05kB to web-nginx:/etc/nginx/conf.d/app.conf`,
    tips: ['Can also copy files OUT of a container to host: `docker cp web-nginx:/var/log/nginx/access.log ./host-access.log`.'],
    simulation: {
      type: 'file-transfer',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Tar Stream Packaging',
          description: 'Client creates an in-memory tar stream of `./app.conf` and calls `PUT /v1.43/containers/web-nginx/archive?path=/etc/nginx/conf.d/`.',
          kernelLogs: '[strace] read(4, "server { listen 80; ... }", 2048) = 2048',
          hardwareActivity: 'RAM buffer allocation.',
          statusBadge: 'Tar Stream'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'NVMe Direct Memory Access (DMA) Write',
          description: 'The host daemon resolves the container rootfs mount point and issues DMA write commands to the NVMe disk controller.',
          kernelLogs: '[nvme] write 4096 bytes to /var/lib/docker/overlay2/[diff]/etc/nginx/conf.d/app.conf',
          hardwareActivity: 'NVMe flash write cycle.',
          statusBadge: 'DMA Write'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel (OverlayFS upperdir)',
          title: 'OverlayFS Copy-Up / UpperDir Placement',
          description: 'Kernel writes the file into `upperdir`. The container immediately sees the new file merged on top of lowerdir layers.',
          kernelLogs: '[kernel] overlayfs: upperdir file created inode 8912301',
          hardwareActivity: 'VFS directory entry created.',
          statusBadge: 'UpperDir Updated'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'File Instantly Available in Container',
          description: 'Processes inside container can immediately open and read `/etc/nginx/conf.d/app.conf`.',
          kernelLogs: '[container] file available at /etc/nginx/conf.d/app.conf',
          hardwareActivity: 'Container read access.',
          statusBadge: 'Synced'
        }
      ]
    }
  },
  {
    id: 'docker-diff',
    name: 'Inspect Container Filesystem Changes',
    command: 'docker diff web-nginx',
    category: 'intermediate',
    tags: ['Storage', 'OverlayFS', 'Inspection'],
    summary: 'Lists files and directories that have been Added (A), Changed (C), or Deleted (D) on the container writable layer.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'diff', type: 'subcommand', desc: 'Inspect changes to files or directories on a container filesystem' },
      { text: 'web-nginx', type: 'argument', desc: 'Container to inspect' }
    ],
    detailedDescription: 'Compares the container\'s ephemeral writeable `upperdir` against the read-only image `lowerdir` layers. Identifies modifications: `C` for modified existing files, `A` for new files created, and `D` for files deleted (represented as Linux whiteout characters).',
    flagsBreakdown: [],
    sampleOutput: `C /etc
C /etc/nginx
C /etc/nginx/conf.d
A /etc/nginx/conf.d/app.conf
C /var
C /var/log
C /var/log/nginx
A /var/log/nginx/access.log`,
    tips: ['Crucial for investigating container malware or seeing what configuration changes were made before creating an image.'],
    simulation: {
      type: 'overlay-diff',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Diff Request Dispatch',
          description: 'Client calls `GET /v1.43/containers/web-nginx/changes`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/web-nginx/changes HTTP/1.1...", 160) = 160',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /changes'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Scan UpperDir Filesystem Tree',
          description: 'dockerd opens `/var/lib/docker/overlay2/[diff-id]/diff` and traverses modified inode entries.',
          kernelLogs: '[dockerd] traversing upperdir diff inodes',
          hardwareActivity: 'Disk directory traversal.',
          statusBadge: 'UpperDir Scan'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Render Colorized A/C/D Diff List',
          description: 'Prints list of modifications to terminal.',
          kernelLogs: '[strace] write(1, "C /etc\\nA /etc/nginx/conf.d/app.conf...", 180) = 180',
          hardwareActivity: 'Terminal print.',
          statusBadge: 'Diff Output'
        }
      ]
    }
  },
  {
    id: 'docker-commit',
    name: 'Create Image from Container Changes',
    command: 'docker commit web-nginx my-custom-nginx:v1',
    category: 'intermediate',
    tags: ['Images', 'Storage', 'OverlayFS'],
    summary: 'Freezes container, snapshots writeable OverlayFS layer, and generates a new local Docker image.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'commit', type: 'subcommand', desc: 'Create a new image from a container changes' },
      { text: 'web-nginx', type: 'argument', desc: 'Container to snapshot' },
      { text: 'my-custom-nginx:v1', type: 'image', desc: 'New image repository:tag' }
    ],
    detailedDescription: 'Temporarily pauses container processes so disk writes are consistent, archives the `upperdir` diff into a new read-only layer tarball, generates a new SHA256 layer ID, updates configuration JSON (CMD, ENV, EXPOSE), and registers the new image.',
    flagsBreakdown: [
      { flag: '-m, --message', desc: 'Commit message string', default: 'none' },
      { flag: '-a, --author', desc: 'Author name (e.g. "DevOps <devops@corp.com>")', default: 'none' },
      { flag: '-p, --pause', desc: 'Pause container during commit to ensure consistency', default: 'true' }
    ],
    sampleOutput: `sha256:4a819bce3d1720f1883aa3d81b95fcae1378d381ba9377a892b1cd0912ab8e11`,
    tips: ['While useful for debugging, prefer automated reproducible Dockerfile builds for production images.'],
    simulation: {
      type: 'image-commit',
      steps: [
        {
          stepNumber: 1,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Cgroup Pause Container',
          description: 'Freezes container processes to prevent filesystem corruption during snapshot.',
          kernelLogs: '[containerd] cgroup.freeze = 1',
          hardwareActivity: 'CPU timeslices halted.',
          statusBadge: 'Paused'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'NVMe Layer Compression & SHA256 Hash',
          description: 'Writes layer tar archive to image store and computes cryptographic SHA256 hash.',
          kernelLogs: '[crypto] sha256 computed: 4a819bce3d1...',
          hardwareActivity: 'DMA read upperdir, write layer blob.',
          statusBadge: 'SHA256 Generated'
        },
        {
          stepNumber: 3,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Unpause Container & Register Image Tag',
          description: 'Resumes container execution and adds `my-custom-nginx:v1` to local image repository catalog.',
          kernelLogs: '[containerd] cgroup.freeze = 0\n[dockerd] image registered: my-custom-nginx:v1',
          hardwareActivity: 'Process resumed.',
          statusBadge: 'Image Created'
        }
      ]
    }
  },
  {
    id: 'docker-port',
    name: 'List Container Port Mappings',
    command: 'docker port web-nginx',
    category: 'intermediate',
    tags: ['Networking', 'Inspection'],
    summary: 'Displays which host IP and port are mapped to container ports via iptables NAT.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'port', type: 'subcommand', desc: 'List port mappings or a specific mapping for the container' },
      { text: 'web-nginx', type: 'argument', desc: 'Container name' }
    ],
    detailedDescription: 'Extracts published ports from container configuration and inspects active host binding addresses (e.g. `0.0.0.0` or `127.0.0.1`).',
    flagsBreakdown: [],
    sampleOutput: `80/tcp -> 0.0.0.0:80
80/tcp -> [::]:80`,
    tips: ['Verify firewall or cloud security groups allow inbound traffic on the host port specified!'],
    simulation: {
      type: 'port-check',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Port Inspection Request',
          description: 'Calls `GET /v1.43/containers/web-nginx/json` to filter PortBindings struct.',
          kernelLogs: '[strace] write(3, "GET /v1.43/containers/web-nginx/json HTTP/1.1...", 160) = 160',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'Port Query'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'iptables NAT Chain Verification',
          description: 'Kernel confirms active DNAT rule routing traffic to container virtual IP `172.17.0.2:80`.',
          kernelLogs: '[iptables] chain DOCKER: target DNAT prot tcp opt -- in !docker0 out * 0.0.0.0/0 to:172.17.0.2:80',
          hardwareActivity: 'Kernel netfilter memory lookup.',
          statusBadge: 'DNAT Verified'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Display Port Bindings',
          description: 'Renders mapped TCP/UDP ports to terminal.',
          kernelLogs: '[strace] write(1, "80/tcp -> 0.0.0.0:80\\n", 22) = 22',
          hardwareActivity: 'Stdout write.',
          statusBadge: 'Printed'
        }
      ]
    }
  },
  {
    id: 'docker-network-create',
    name: 'Create Custom User-Defined Bridge Network',
    command: 'docker network create --driver bridge app-net',
    category: 'intermediate',
    tags: ['Networking', 'Bridge', 'DNS'],
    summary: 'Provisions a new isolated software bridge network on the host with automatic internal container DNS resolution.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'network', type: 'subcommand', desc: 'Manage networks' },
      { text: 'create', type: 'subcommand', desc: 'Create a network' },
      { text: '--driver bridge', type: 'flag', desc: 'Network driver (bridge, overlay, macvlan, ipvlan, host)' },
      { text: 'app-net', type: 'argument', desc: 'Name of the network' }
    ],
    detailedDescription: 'Creates a new virtual Linux bridge interface (e.g. `br-4f8109a1`) with its own isolated private subnet (e.g. `172.18.0.0/16`). Unlike the default `docker0` bridge, user-defined bridge networks enable automatic embedded DNS server resolution so containers can address each other by container name!',
    flagsBreakdown: [
      { flag: '--subnet', desc: 'Subnet in CIDR format that represents a network segment (e.g. 10.0.0.0/24)', default: 'auto-allocated' },
      { flag: '--gateway', desc: 'IPv4 or IPv6 Gateway for the master subnet', default: 'first IP in subnet' },
      { flag: '--internal', desc: 'Restrict external traffic to and from this network', default: 'false' }
    ],
    sampleOutput: `4f8109a1b8e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d`,
    tips: ['Always use user-defined bridge networks in multi-container setups to eliminate hardcoded IP addresses via built-in DNS!'],
    simulation: {
      type: 'network-provision',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Network Create Request',
          description: 'Client sends `POST /v1.43/networks/create` with name `app-net` and driver `bridge`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/networks/create HTTP/1.1\\r\\n...", 220) = 220',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /networks/create'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel (Linux Bridge)',
          title: 'Netlink Syscall Creates Linux Bridge',
          description: 'Kernel uses rtnetlink socket to create new virtual bridge interface `br-4f8109a1` and assigns gateway `172.18.0.1/16`.',
          kernelLogs: '[kernel] netlink: RTM_NEWLINK type bridge name br-4f8109a1\n[kernel] br-4f8109a1: entered promiscuous mode\n[kernel] ip addr add 172.18.0.1/16 dev br-4f8109a1',
          hardwareActivity: 'Kernel networking table memory initialized.',
          statusBadge: 'Linux Bridge Created'
        },
        {
          stepNumber: 3,
          layerId: 'host',
          layerName: 'Docker Host Engine',
          title: 'Embedded DNS Server Allocation',
          description: 'Docker Engine provisions embedded 127.0.0.11 DNS resolver for this network to resolve container names.',
          kernelLogs: '[dockerd] msg="embedded DNS listening on 127.0.0.11:53 for app-net"',
          hardwareActivity: 'Internal UDP DNS server listening.',
          statusBadge: 'Embedded DNS 127.0.0.11'
        }
      ]
    }
  },
  {
    id: 'docker-volume-create',
    name: 'Create Persistent Data Volume',
    command: 'docker volume create web-data',
    category: 'intermediate',
    tags: ['Storage', 'Volumes', 'Persistence'],
    summary: 'Allocates an isolated storage directory on host NVMe managed completely by Docker outside container life cycles.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'volume', type: 'subcommand', desc: 'Manage volumes' },
      { text: 'create', type: 'subcommand', desc: 'Create a volume' },
      { text: 'web-data', type: 'argument', desc: 'Name of the persistent named volume' }
    ],
    detailedDescription: 'Named volumes are stored in `/var/lib/docker/volumes/[name]/_data` on the host. Unlike bind mounts, volumes are isolated from host OS permissions quirks, provide maximum storage performance (bypassing OverlayFS copy-on-write overhead), and persist even if containers are destroyed.',
    flagsBreakdown: [
      { flag: '-d, --driver', desc: 'Specify volume driver name (local, nfs, cloud storage)', default: 'local' },
      { flag: '--label', desc: 'Set metadata for a volume', default: 'none' }
    ],
    sampleOutput: `web-data`,
    tips: ['Database storage (Postgres, MySQL, MongoDB) must ALWAYS use Docker volumes for ACID safety and high performance!'],
    simulation: {
      type: 'volume-provision',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Volume Create API Call',
          description: 'Sends `POST /v1.43/volumes/create` with name `web-data`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/volumes/create HTTP/1.1\\r\\n...", 175) = 175',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /volumes'
        },
        {
          stepNumber: 2,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'Direct NVMe Directory Creation',
          description: 'Storage driver creates host directory `/var/lib/docker/volumes/web-data/_data` with ext4/xfs journaling.',
          kernelLogs: '[kernel] mkdirat(AT_FDCWD, "/var/lib/docker/volumes/web-data/_data", 0755) = 0',
          hardwareActivity: 'NVMe inode allocated on host root disk.',
          statusBadge: 'NVMe Inode Written'
        },
        {
          stepNumber: 3,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Volume Registered in Daemon DB',
          description: 'dockerd adds volume metadata to its local volume database and returns volume name.',
          kernelLogs: '[dockerd] msg="volume created" name=web-data driver=local',
          hardwareActivity: 'RAM DB updated.',
          statusBadge: 'Volume Ready'
        }
      ]
    }
  },

  // ==================== ADVANCED COMMANDS ====================
  {
    id: 'docker-run-cgroups',
    name: 'Hardware Resource Limits & Cgroups v2',
    command: 'docker run -d --memory="512m" --cpus="1.5" --pids-limit=100 nginx:alpine',
    category: 'advanced',
    tags: ['Cgroups', 'Hardware', 'Performance', 'Limits'],
    summary: 'Constrains container to 512MB RAM, 1.5 CPU cores quota, and 100 max process IDs via Linux cgroups v2.',
    syntaxTokens: [
      { text: 'docker run -d', type: 'command', desc: 'Spawn container in detached mode' },
      { text: '--memory="512m"', type: 'flag', desc: 'Hard memory ceiling; triggers OOM killer if exceeded' },
      { text: '--cpus="1.5"', type: 'flag', desc: 'CPU quota: 150,000 microseconds per 100,000 period' },
      { text: '--pids-limit=100', type: 'flag', desc: 'Fork-bomb prevention: max active PIDs inside container' },
      { text: 'nginx:alpine', type: 'image', desc: 'Target container image' }
    ],
    detailedDescription: 'This command instructs runc to program Linux Control Groups (cgroups v2) hardware limits. `memory.max` is set to 536870912 bytes; if breached without swap, the Linux kernel OOM-killer terminates the process. `cpu.max` sets quota to `150000 100000` (1.5 cores), and `pids.max` protects the host motherboard from fork-bombs.',
    flagsBreakdown: [
      { flag: '-m, --memory', desc: 'Memory limit (format: <number>[<unit>], where unit = b, k, m or g)', default: 'unlimited' },
      { flag: '--memory-swap', desc: 'Swap limit equal to memory plus swap, -1 to enable unlimited swap', default: '2x memory' },
      { flag: '--cpus', desc: 'Number of CPUs (e.g. 0.5, 1.5, 4)', default: 'all host CPUs' },
      { flag: '--pids-limit', desc: 'Tune container pids limit (prevents fork-bomb DoS)', default: 'unlimited' },
      { flag: '--oom-kill-disable', desc: 'Disable OOM Killer for the container (requires -m)', default: 'false' }
    ],
    sampleOutput: `9b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d381ba93b8f9e219`,
    tips: [
      'In Kubernetes and production Docker, setting memory limits prevents rogue containers from taking down the entire physical host.'
    ],
    simulation: {
      type: 'cgroups-limits',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Resource Specification Serialization',
          description: 'Client converts `512m` to bytes (536870912) and `1.5` CPUs to quota/period in HostConfig JSON.',
          kernelLogs: '[strace] "HostConfig": {"Memory": 536870912, "NanoCpus": 1500000000, "PidsLimit": 100}',
          hardwareActivity: 'CLI memory conversion.',
          statusBadge: 'HostConfig JSON'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (runc)',
          title: 'Writing Cgroups v2 Controller Files',
          description: 'runc writes parameters to `/sys/fs/cgroup/docker/[id]/`: writes `536870912` to `memory.max`, `150000 100000` to `cpu.max`, and `100` to `pids.max`.',
          kernelLogs: '[runc] write /sys/fs/cgroup/docker/9b21/memory.max "536870912"\n[runc] write /sys/fs/cgroup/docker/9b21/cpu.max "150000 100000"\n[runc] write /sys/fs/cgroup/docker/9b21/pids.max "100"',
          hardwareActivity: 'Sysfs kernel programming.',
          statusBadge: 'cgroups v2 Programmed'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (CPU & Memory Controller)',
          title: 'Hardware MMU Memory Page Ceiling & CFS Throttling',
          description: 'Hardware MMU and kernel Completely Fair Scheduler (CFS) enforce bounds. CPU core timeslices are throttled when quota expires; memory controller accounts every allocated DDR page.',
          kernelLogs: '[kernel/cgroup] cgroup_memory_charge: page alloc accounted 240/512 MB\n[kernel/sched] CFS bandwidth timer activated for CPU #0, #1',
          hardwareActivity: 'Hardware MMU page table enforcement. CPU CFS bandwidth throttling timers active.',
          statusBadge: 'Hardware Throttling Active'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Sandboxed Application Running Within Hard Boundaries',
          description: 'Nginx process runs at full speed up to 1.5 cores. If it tries to allocate >512MB RAM, the kernel OOM killer terminates it.',
          kernelLogs: '[container] PID 1 active with cgroup hardware envelope enforced',
          hardwareActivity: 'Bounded hardware execution.',
          statusBadge: 'Hard Boundaries Enforced'
        }
      ]
    }
  },
  {
    id: 'docker-security-capabilities',
    name: 'Linux Capabilities & Seccomp Hardening',
    command: 'docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE --security-opt no-new-privileges nginx',
    category: 'advanced',
    tags: ['Security', 'Kernel', 'Syscalls', 'Capabilities'],
    summary: 'Drops all 41 Linux root capabilities, whitelists only privileged port binding, and blocks privilege escalation.',
    syntaxTokens: [
      { text: 'docker run', type: 'command', desc: 'Run container' },
      { text: '--cap-drop=ALL', type: 'flag', desc: 'Drop all POSIX capabilities (e.g. CAP_SYS_ADMIN, CAP_CHOWN, CAP_NET_RAW)' },
      { text: '--cap-add=NET_BIND_SERVICE', type: 'flag', desc: 'Add back only permission to bind to low ports (<1024)' },
      { text: '--security-opt no-new-privileges', type: 'flag', desc: 'Prevent setuid/setgid binaries from escalating root permissions' },
      { text: 'nginx', type: 'image', desc: 'Target image' }
    ],
    detailedDescription: 'Linux divides traditional superuser permissions into 41 distinct capabilities. By dropping ALL capabilities and strictly whitelisting `CAP_NET_BIND_SERVICE`, even if an attacker gains root code execution inside the container, they cannot access raw sockets, mount filesystems, load kernel modules, or escape into the host operating system.',
    flagsBreakdown: [
      { flag: '--cap-drop', desc: 'Drop Linux capabilities from container process', default: 'default capability set' },
      { flag: '--cap-add', desc: 'Add Linux capabilities to container process', default: 'none' },
      { flag: '--security-opt', desc: 'Security Options (seccomp profiles, apparmor, no-new-privileges)', default: 'default seccomp' }
    ],
    sampleOutput: `09a1b8e42193b2184a4504193ec881c6d1720f1883aa3d81b95fcae1378d4f81`,
    tips: ['The golden rule of container security: never run containers with `--privileged` in production!'],
    simulation: {
      type: 'security-hardening',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Parse Security Profile Flags',
          description: 'Client formats security options array and capability masks in ContainerCreate REST request.',
          kernelLogs: '[strace] "CapDrop": ["ALL"], "CapAdd": ["NET_BIND_SERVICE"], "SecurityOpt": ["no-new-privileges"]',
          hardwareActivity: 'CLI memory serialization.',
          statusBadge: 'Cap Mask JSON'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (runc)',
          title: 'OCI Spec Capabilities Filtering',
          description: 'runc writes capabilities bitmask in OCI `config.json` containing only bit `CAP_NET_BIND_SERVICE` (10).',
          kernelLogs: '[runc] capabilities.bounding: [CAP_NET_BIND_SERVICE]\n[runc] capabilities.effective: [CAP_NET_BIND_SERVICE]',
          hardwareActivity: 'Process bitmask config.',
          statusBadge: 'OCI Spec Bitmask'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (prctl & Seccomp)',
          title: 'prctl() Syscalls Lock Down Process Tree',
          description: 'Before executing Nginx, runc invokes `prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0)` and `capset()`. Any attempt to call banned syscalls returns `EPERM`.',
          kernelLogs: '[kernel] prctl(PR_SET_NO_NEW_PRIVS, 1) = 0\n[kernel] capset(&header, &data) = 0 (effective: 0x400)\n[kernel] seccomp: BPF filter loaded (344 syscalls blocked)',
          hardwareActivity: 'Kernel security subsystem sets immutable flag on process task_struct.',
          statusBadge: 'prctl & Seccomp BPF'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Hardened Zero-Trust Execution',
          description: 'Application can bind port 80 successfully, but cannot execute administrative kernel tasks even as UID 0.',
          kernelLogs: '[container] nginx bound port 80 successfully\n[test] ping fails: Operation not permitted (CAP_NET_RAW dropped)',
          hardwareActivity: 'Safe user-space execution.',
          statusBadge: 'Zero-Trust Hardened'
        }
      ]
    }
  },
  {
    id: 'docker-system-prune',
    name: 'Purge Dangling System Artifacts',
    command: 'docker system prune -a --volumes',
    category: 'advanced',
    tags: ['Cleanup', 'System', 'Storage', 'NVMe'],
    summary: 'Deep system purge: removes all stopped containers, unused networks, dangling/unreferenced images, and volumes.',
    syntaxTokens: [
      { text: 'docker system', type: 'subcommand', desc: 'Manage Docker system environment' },
      { text: 'prune', type: 'subcommand', desc: 'Remove unused data' },
      { text: '-a, --all', type: 'flag', desc: 'Remove all unused images, not just dangling ones' },
      { text: '--volumes', type: 'flag', desc: 'Prune unused named volumes as well (WARNING: Destructive)' }
    ],
    detailedDescription: 'Performs a comprehensive garbage collection across all Docker subsystems: unmounts unused OverlayFS graph layers, deletes abandoned bridge networks, flushes the BuildKit cache (`/var/lib/docker/buildkit`), and deletes unattached named volumes.',
    flagsBreakdown: [
      { flag: '-a, --all', desc: 'Remove all unreferenced images (not just dangling ones without tags)', default: 'false' },
      { flag: '--volumes', desc: 'Prune named volumes not used by at least one container', default: 'false' },
      { flag: '-f, --force', desc: 'Do not prompt for confirmation', default: 'false' }
    ],
    sampleOutput: `WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all volumes not used by at least one container
  - all images without at least one container associated to them
  - all build cache

Deleted Containers:
e31c7901da42

Deleted Networks:
app-net

Deleted Volumes:
web-data

Deleted Images:
untagged: ubuntu:22.04
deleted: sha256:35a88802559d18e9a2b1

Total reclaimed space: 14.82GB`,
    tips: ['In CI/CD servers, run `docker system prune` on a weekly cron job to prevent hard drive saturation.'],
    simulation: {
      type: 'deep-cleanup',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'System Prune Post Call',
          description: 'Client calls `POST /v1.43/containers/prune`, `/networks/prune`, `/volumes/prune`, and `/images/prune`.',
          kernelLogs: '[strace] write(3, "POST /v1.43/system/prune?all=1&volumes=1 HTTP/1.1...", 240) = 240',
          hardwareActivity: 'Socket multi-call dispatch.',
          statusBadge: 'POST /system/prune'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Graph Driver & BuildKit Cache Flush',
          description: 'dockerd and BuildKit calculate reference DAG graph and unlink all unreferenced layer hashes.',
          kernelLogs: '[buildkit] cache gc: 12 blobs unlinked\n[dockerd] layer store gc: unlinking 38 image layers',
          hardwareActivity: 'Graph traversal in RAM.',
          statusBadge: 'DAG Ref Unlink'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'Mass NVMe SSD Sector TRIM & Inode Free',
          description: 'Massive block invalidation on NVMe drive. Reclaims gigabytes of physical NAND flash memory.',
          kernelLogs: '[nvme] blkdiscard: 14.82 GB unmapped across 3,884,120 sectors',
          hardwareActivity: 'NVMe controller triggers hardware garbage collection & block zeroing.',
          statusBadge: '14.82GB Reclaimed'
        },
        {
          stepNumber: 4,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Kernel Network Bridge Deletion',
          description: 'Kernel deletes unused virtual bridge devices and removes stale iptables NAT rules.',
          kernelLogs: '[kernel] netlink: RTM_DELLINK br-4f8109a1\n[kernel] iptables rules purged',
          hardwareActivity: 'Kernel networking table memory freed.',
          statusBadge: 'Subsystems Clean'
        }
      ]
    }
  },
  {
    id: 'docker-buildx-multiplatform',
    name: 'Multi-Architecture Cross-Compilation',
    command: 'docker buildx build --platform linux/amd64,linux/arm64 -t app:multi .',
    category: 'advanced',
    tags: ['Build', 'BuildKit', 'Cross-Platform', 'CPU'],
    summary: 'Builds native binary image layers for both x86_64 Intel/AMD and ARM64 Apple Silicon/Graviton using QEMU emulation.',
    syntaxTokens: [
      { text: 'docker buildx', type: 'subcommand', desc: 'Extended build capabilities via BuildKit engine' },
      { text: 'build', type: 'subcommand', desc: 'Execute build' },
      { text: '--platform linux/amd64,linux/arm64', type: 'flag', desc: 'Target CPU instruction architectures' },
      { text: '-t app:multi', type: 'flag', desc: 'Image tag' },
      { text: '.', type: 'argument', desc: 'Build context path' }
    ],
    detailedDescription: 'Buildx leverages QEMU user-mode emulation and Linux `binfmt_misc` kernel handler. If running on an x86 host, ARM64 instructions are dynamically translated into x86 instructions at runtime, outputting an OCI Multi-Architecture Manifest List that runs natively on either architecture.',
    flagsBreakdown: [
      { flag: '--platform', desc: 'Comma-separated target architectures (linux/amd64, linux/arm64, linux/riscv64)', default: 'host platform' },
      { flag: '--push', desc: 'Push image directly to registry (required for multi-arch manifest list)', default: 'false' },
      { flag: '--load', desc: 'Load single platform image into local Docker image store', default: 'false' }
    ],
    sampleOutput: `[+] Building 12.8s (14/14) FINISHED
 => [linux/amd64 1/3] FROM node:20-alpine
 => [linux/arm64 1/3] FROM node:20-alpine
 => => compiling arm64 binaries via qemu-aarch64
 => exporting to multi-arch manifest list
 => => manifest list sha256:7198ba12cde4218`,
    tips: ['Multi-arch images allow developers on Apple Silicon (M1/M2/M3/M4) to deploy seamlessly to x86 cloud servers!'],
    simulation: {
      type: 'buildx-multiarch',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client (Buildx)',
          title: 'BuildKit Daemon Session Handshake',
          description: 'Client connects to BuildKit daemon via gRPC stream with multi-platform matrix parameters.',
          kernelLogs: '[strace] connect() to /var/run/buildkit/buildkitd.sock via gRPC',
          hardwareActivity: 'gRPC stream over socket.',
          statusBadge: 'Buildx gRPC'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel (binfmt_misc)',
          title: 'Kernel binfmt_misc CPU Instruction Intercept',
          description: 'Kernel examines ELF header magic bytes: when ARM64 binary executes on x86 CPU, kernel redirects it to `/usr/bin/qemu-aarch64-static`.',
          kernelLogs: '[kernel] binfmt_misc: intercepted ELF class 2 (ARM64) -> routed to qemu-aarch64',
          hardwareActivity: 'CPU dynamic binary translation in user space.',
          statusBadge: 'QEMU & binfmt_misc'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (CPU)',
          title: 'Concurrent Multi-Core Compilation',
          description: 'All CPU physical cores are saturated compiling separate layer snapshots for both architectures concurrently.',
          kernelLogs: '[cpu] 16 worker threads running parallel gcc/npm build',
          hardwareActivity: '100% CPU multi-core utilization.',
          statusBadge: 'All Cores Busy'
        },
        {
          stepNumber: 4,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Assemble OCI Image Manifest List',
          description: 'Creates top-level Multi-Arch Manifest List JSON that points to both platform layer digests.',
          kernelLogs: '[buildkit] manifest list created with mediaType: application/vnd.oci.image.index.v1+json',
          hardwareActivity: 'Manifest JSON output.',
          statusBadge: 'Manifest List'
        }
      ]
    }
  },
  {
    id: 'docker-compose-up',
    name: 'Multi-Container Microservices Orchestration',
    command: 'docker compose -f docker-compose.yml up -d --scale worker=3',
    category: 'advanced',
    tags: ['Compose', 'Orchestration', 'Scaling'],
    summary: 'Parses declarative YAML service topology, provisions shared networks & volumes, and scales services.',
    syntaxTokens: [
      { text: 'docker compose', type: 'subcommand', desc: 'Compose V2 subcommands' },
      { text: '-f docker-compose.yml', type: 'flag', desc: 'Specify Compose configuration file' },
      { text: 'up -d', type: 'flag', desc: 'Create and start containers in detached background mode' },
      { text: '--scale worker=3', type: 'flag', desc: 'Scale worker service instances to 3 replicas' }
    ],
    detailedDescription: 'Docker Compose compiles the YAML file into a Directed Acyclic Graph (DAG) of service dependencies (`depends_on`). It creates a project network, prepares named volumes, and invokes the Docker Engine API to spawn all containers in topological order with appropriate environment variables and inter-service DNS aliases.',
    flagsBreakdown: [
      { flag: '-d, --detach', desc: 'Detached mode: Run containers in the background', default: 'false' },
      { flag: '--build', desc: 'Build images before starting containers', default: 'false' },
      { flag: '--scale', desc: 'Scale SERVICE to NUM instances (e.g. --scale worker=3)', default: '1' }
    ],
    sampleOutput: `[+] Running 5/5
 Network myapp_default       Created
 Volume "myapp_pgdata"       Created
 Container myapp-db-1        Started
 Container myapp-api-1       Started
 Container myapp-worker-1    Started
 Container myapp-worker-2    Started
 Container myapp-worker-3    Started`,
    tips: ['Docker Compose V2 is embedded directly into the `docker` CLI (`docker compose`), replacing the legacy Python `docker-compose` binary.'],
    simulation: {
      type: 'compose-orchestration',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client (Compose V2)',
          title: 'YAML Parsing & Dependency DAG Construction',
          description: 'Client reads `docker-compose.yml`, builds dependency graph: db -> api -> workers, and expands scale replicas.',
          kernelLogs: '[strace] openat(AT_FDCWD, "docker-compose.yml", O_RDONLY) = 4\n[compose] DAG compiled: 3 services, 5 container instances',
          hardwareActivity: 'RAM DAG tree compilation.',
          statusBadge: 'YAML DAG Solved'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Bulk Network & Container API Pipeline',
          description: 'Sends sequential API requests creating network `myapp_default`, volume `myapp_pgdata`, and 5 container sandboxes.',
          kernelLogs: '[dockerd] msg="creating network myapp_default"\n[dockerd] msg="creating 5 container tasks"',
          hardwareActivity: 'Concurrent REST requests.',
          statusBadge: 'Batch Container API'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level',
          title: 'Kernel Spawns 5 Parallel Namespace Clusters',
          description: 'Kernel executes 5 `clone()` operations, provisions 5 veth interfaces, and attaches all to bridge `br-myapp`.',
          kernelLogs: '[kernel] 5 veth pairs created and attached to br-myapp\n[kernel] 5 distinct PID namespaces initialized',
          hardwareActivity: 'Hardware RAM allocated for 5 container process trees.',
          statusBadge: '5 Namespaces Up'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Microservices Communicating via Embedded DNS',
          description: 'All 5 containers resolve each other by service name (`db`, `api`, `worker`) through embedded DNS 127.0.0.11.',
          kernelLogs: '[container] api-1 resolved "db" to 172.20.0.2 in 0.4ms\n[container] 3 worker replicas processing Redis queue tasks',
          hardwareActivity: 'Inter-container TCP communication.',
          statusBadge: 'Topology Running'
        }
      ]
    }
  },
  {
    id: 'docker-hardware-passthrough',
    name: 'Hardware Bus & Kernel Passthrough',
    command: 'docker run -it --device=/dev/snd --ipc=host --pid=host ubuntu',
    category: 'advanced',
    tags: ['Hardware', 'Kernel', 'Devices', 'Host'],
    summary: 'Direct hardware device passthrough (audio card) and host kernel PID/IPC namespace sharing.',
    syntaxTokens: [
      { text: 'docker run -it', type: 'command', desc: 'Run container with interactive TTY' },
      { text: '--device=/dev/snd', type: 'flag', desc: 'Pass physical motherboard audio hardware device node into container' },
      { text: '--ipc=host', type: 'flag', desc: 'Share host shared memory segments and semaphores' },
      { text: '--pid=host', type: 'flag', desc: 'Share host PID namespace (container can see and kill all host processes)' },
      { text: 'ubuntu', type: 'image', desc: 'Target image' }
    ],
    detailedDescription: 'Bypasses standard container isolation: `--device=/dev/snd` creates major/minor device node in container `/dev` and grants cgroup device controller permissions. `--pid=host` skips `CLONE_NEWPID`, meaning container PID 1 is identical to host systemd PID 1! Used for low-level system monitoring, GPU CUDA drivers (`--gpus all`), and sound/video processing.',
    flagsBreakdown: [
      { flag: '--device', desc: 'Add a host device to the container (e.g. /dev/snd, /dev/ttyUSB0)', default: 'none' },
      { flag: '--pid', desc: 'PID namespace to use (host allows viewing all host processes)', default: 'isolated' },
      { flag: '--ipc', desc: 'IPC namespace to use (host shares host shared memory)', default: 'isolated' },
      { flag: '--gpus', desc: 'GPU devices to add to the container (e.g. all or device=0)', default: 'none' }
    ],
    sampleOutput: `root@host:/# ps -ef | head -n 5
UID     PID     PPID  C STIME TTY          TIME CMD
root      1        0  0 00:00 ?        00:00:02 /sbin/init splash
root      2        0  0 00:00 ?        00:00:00 [kthreadd]
root      3        2  0 00:00 ?        00:00:00 [rcu_gp]`,
    tips: ['Used when you need GPU hardware acceleration (NVIDIA CUDA) or direct access to physical sensors/USB ports.'],
    simulation: {
      type: 'hardware-passthrough',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Device Node & Namespace Mapping Parse',
          description: 'Client packages Devices struct (`/dev/snd` major 116) and PidMode: "host" in HostConfig.',
          kernelLogs: '[strace] "Devices": [{"PathOnHost": "/dev/snd", "PathInContainer": "/dev/snd"}]',
          hardwareActivity: 'CLI parameter serialization.',
          statusBadge: 'Device Node Config'
        },
        {
          stepNumber: 2,
          layerId: 'kernel',
          layerName: 'OS Kernel (cgroups devices controller)',
          title: 'cgroups Device Whitelist Programming',
          description: 'Kernel writes device permission rule `c 116:* rwm` into `/sys/fs/cgroup/devices.allow`, permitting raw hardware access.',
          kernelLogs: '[kernel] cgroup devices: allow char device 116:* rwm to container\n[kernel] mknod(/dev/snd/pcmC0D0p, S_IFCHR, 116, 16) inside container devfs',
          hardwareActivity: 'Motherboard hardware device node unlocked.',
          statusBadge: 'Hardware Device Unlocked'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (PCIe & Audio Chip)',
          title: 'Direct Motherboard Bus DMA Access',
          description: 'Container application directly drives motherboard Realtek/Intel HD Audio controller registers across PCIe bus without virtualization layer overhead.',
          kernelLogs: '[hardware] PCIe bus device 00:1f.3: DMA buffer mapped to container user space',
          hardwareActivity: 'Physical PCIe hardware register read/write.',
          statusBadge: 'Direct PCIe Bus Access'
        },
        {
          stepNumber: 4,
          layerId: 'app',
          layerName: 'Container Application',
          title: 'Direct Hardware & Host Process Visibility',
          description: 'Container can interact directly with physical hardware and inspect every host process.',
          kernelLogs: '[container] alsa audio device opened successfully\n[container] host PID 1 visible',
          hardwareActivity: 'Bare-metal speed hardware execution.',
          statusBadge: 'Bare-Metal Access'
        }
      ]
    }
  },
  {
    id: 'docker-save-load',
    name: 'Archive & Load Images Offline',
    command: 'docker save -o nginx-backup.tar nginx:alpine',
    category: 'advanced',
    tags: ['Images', 'Storage', 'Air-Gapped', 'Tar'],
    summary: 'Serializes all image layers, metadata, and manifest into a portable tar archive for air-gapped systems.',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'save', type: 'subcommand', desc: 'Save one or more images to a tar archive' },
      { text: '-o nginx-backup.tar', type: 'flag', desc: 'Output file path on host filesystem' },
      { text: 'nginx:alpine', type: 'image', desc: 'Target image' }
    ],
    detailedDescription: 'Packages the image manifest, configuration JSON, and all layer tarballs into a single standard tar file. Can be transferred via USB stick or secure network to an air-gapped server and imported with `docker load -i nginx-backup.tar`.',
    flagsBreakdown: [
      { flag: '-o, --output', desc: 'Write to a file, instead of STDOUT', default: 'STDOUT' }
    ],
    sampleOutput: `[==================================================>]  42.6MB/42.6MB
nginx-backup.tar created successfully (42.6 MB)`,
    tips: ['Combine with `gzip` to shrink file size before transferring: `docker save myimage | gzip > myimage.tar.gz`.'],
    simulation: {
      type: 'tar-export',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Save Stream Request',
          description: 'Sends `GET /v1.43/images/nginx:alpine/get` across socket.',
          kernelLogs: '[strace] write(3, "GET /v1.43/images/nginx:alpine/get HTTP/1.1...", 160) = 160',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'GET /images/get'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Pack Layers into Tarball Archive',
          description: 'dockerd streams manifest.json, repositories, and raw layer blobs into a continuous tar archive stream.',
          kernelLogs: '[dockerd] archiving 3 layers into tar stream',
          hardwareActivity: 'RAM streaming buffer.',
          statusBadge: 'Tar Packaging'
        },
        {
          stepNumber: 3,
          layerId: 'motherboard',
          layerName: 'Motherboard Hardware (Storage)',
          title: 'NVMe Sequential Write to Disk File',
          description: 'Client streams incoming bytes directly to `nginx-backup.tar` at maximum NVMe sequential write speed.',
          kernelLogs: '[nvme] sequential write 42.6MB to sector 0x918230 at 1.4 GB/s',
          hardwareActivity: 'High-speed sequential SSD write.',
          statusBadge: '42.6MB Saved'
        }
      ]
    }
  },
  {
    id: 'docker-events',
    name: 'Real-Time Daemon Event Bus',
    command: 'docker events --filter "type=container"',
    category: 'advanced',
    tags: ['Events', 'Monitoring', 'Daemon'],
    summary: 'Streams real-time event notifications emitted by the Docker engine (create, start, die, pause, kill).',
    syntaxTokens: [
      { text: 'docker', type: 'binary', desc: 'Docker CLI' },
      { text: 'events', type: 'subcommand', desc: 'Get real time events from the server' },
      { text: '--filter "type=container"', type: 'flag', desc: 'Filter events by object type (container, image, volume, network)' }
    ],
    detailedDescription: 'Opens a persistent HTTP streaming connection to `/events`. Whenever a container changes lifecycle state (attached, died, exec_create, health_status), the daemon broadcasts an event frame with precise Unix epoch timestamps.',
    flagsBreakdown: [
      { flag: '--filter', desc: 'Filter output based on conditions provided', default: 'none' },
      { flag: '--since', desc: 'Show all events created since timestamp', default: 'now' },
      { flag: '--format', desc: 'Format the output using the given Go template', default: 'text' }
    ],
    sampleOutput: `2026-10-18T00:04:12.182910291Z container create b8f9e219 (image=nginx:alpine, name=web-nginx)
2026-10-18T00:04:12.391829182Z network connect 4f8109a1 (container=b8f9e219, name=bridge)
2026-10-18T00:04:12.518291829Z container start b8f9e219 (image=nginx:alpine, name=web-nginx)
2026-10-18T00:04:18.918291829Z container stop b8f9e219 (image=nginx:alpine, name=web-nginx)
2026-10-18T00:04:19.012938192Z container die b8f9e219 (exitCode=0, name=web-nginx)`,
    tips: ['Used by automated service discovery agents (Consul, Traefik, Datadog) to auto-configure routing rules when containers boot.'],
    simulation: {
      type: 'event-stream',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Persistent Event Stream Socket',
          description: 'Client connects to `GET /v1.43/events?filters={"type":["container"]}`.',
          kernelLogs: '[strace] write(3, "GET /v1.43/events HTTP/1.1\\r\\n...", 180) = 180',
          hardwareActivity: 'Persistent socket connection.',
          statusBadge: 'GET /events'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host',
          title: 'Daemon Internal Pub/Sub Event Broadcast',
          description: 'dockerd publisher emits event struct to all subscribed subscriber channels whenever container state shifts.',
          kernelLogs: '[dockerd] pubsub: broadcast event "container start" to 1 listener',
          hardwareActivity: 'RAM broadcast channel.',
          statusBadge: 'Pub/Sub Dispatch'
        },
        {
          stepNumber: 3,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Real-Time Event Feed Rendering',
          description: 'Prints timestamped event logs to terminal as they occur.',
          kernelLogs: '[strace] write(1, "2026-10-18T00:04:12Z container create...", 110) = 110',
          hardwareActivity: 'Terminal output rendered.',
          statusBadge: 'Live Event Feed'
        }
      ]
    }
  },
  {
    id: 'docker-swarm-init',
    name: 'Initialize Swarm Cluster Orchestrator',
    command: 'docker swarm init --advertise-addr 192.168.1.10',
    category: 'advanced',
    tags: ['Swarm', 'Clustering', 'Raft', 'Orchestration'],
    summary: 'Activates Docker Swarm mode, initializes Raft consensus leader node, and generates worker join tokens.',
    syntaxTokens: [
      { text: 'docker swarm', type: 'subcommand', desc: 'Manage Swarm cluster' },
      { text: 'init', type: 'subcommand', desc: 'Initialize a swarm' },
      { text: '--advertise-addr 192.168.1.10', type: 'flag', desc: 'Advertised IP address for inter-node gossip and Raft consensus' }
    ],
    detailedDescription: 'Enables native Docker clustering. Generates a cryptographically secure root Certificate Authority (CA), starts an embedded Raft consensus datastore on port 2377, configures VXLAN Overlay network mesh on port 4789, and outputs join tokens with mutual TLS (mTLS) certificates.',
    flagsBreakdown: [
      { flag: '--advertise-addr', desc: 'Advertised address (format: <ip|interface>[:port])', default: 'auto-detected' },
      { flag: '--listen-addr', desc: 'Listen address (format: <ip|interface>[:port])', default: '0.0.0.0:2377' },
      { flag: '--autolock', desc: 'Lock manager with an encryption key requiring manual unlock after restart', default: 'false' }
    ],
    sampleOutput: `Swarm initialized: current node (d81ba9377a) is now a manager.

To add a worker to this swarm, run the following command:
    docker swarm join --token SWMTKN-1-49nj1... 192.168.1.10:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.`,
    tips: ['Swarm provides built-in rolling updates, health checks, declarative desired state, and automatic ingress routing mesh!'],
    simulation: {
      type: 'swarm-init',
      steps: [
        {
          stepNumber: 1,
          layerId: 'client',
          layerName: 'Docker Client',
          title: 'Swarm Init Request',
          description: 'Client calls `POST /v1.43/swarm/init` with advertise address.',
          kernelLogs: '[strace] write(3, "POST /v1.43/swarm/init HTTP/1.1\\r\\n...", 210) = 210',
          hardwareActivity: 'Socket exchange.',
          statusBadge: 'POST /swarm/init'
        },
        {
          stepNumber: 2,
          layerId: 'host',
          layerName: 'Docker Host (SwarmKit)',
          title: 'Raft Log Init & mTLS PKI Generation',
          description: 'SwarmKit initializes embedded Raft state machine, generates root CA certificate, and creates manager cryptographic node identity.',
          kernelLogs: '[swarmkit] raft: node d81ba9377a elected leader for term 1\n[swarmkit] CA certificate generated with 90-day rotation period',
          hardwareActivity: 'CPU executes RSA/ECDSA key generation.',
          statusBadge: 'Raft Leader Elected'
        },
        {
          stepNumber: 3,
          layerId: 'kernel',
          layerName: 'OS Kernel Level (VXLAN Overlay & Ports)',
          title: 'Kernel VXLAN Driver & Port Binding',
          description: 'Kernel opens Raft cluster control port (2377/tcp), node gossip port (7946/tcp/udp), and VXLAN UDP port (4789/udp).',
          kernelLogs: '[kernel] socket bound to 192.168.1.10:2377\n[kernel] vxlan: driver initialized for overlay network encapsulation',
          hardwareActivity: 'Network sockets opened.',
          statusBadge: 'VXLAN 4789 & Raft 2377'
        },
        {
          stepNumber: 4,
          layerId: 'client',
          layerName: 'Docker Client Display',
          title: 'Manager Status & Join Token Output',
          description: 'Displays Swarm manager status and prints secure worker join command.',
          kernelLogs: '[strace] write(1, "Swarm initialized: current node...", 280) = 280',
          hardwareActivity: 'Terminal print.',
          statusBadge: 'Swarm Active'
        }
      ]
    }
  }
];

// Combine and deduplicate commands from base, doc/docker volums.md, doc/docker cpu and memory.md, and doc/Docker-Cheat-Sheet.pdf
const seenCommandIds = new Set();
export const DOCKER_COMMANDS = [];

for (const cmd of [...BASE_COMMANDS, ...NEW_DOCKER_COMMANDS]) {
  if (!seenCommandIds.has(cmd.id)) {
    seenCommandIds.add(cmd.id);
    DOCKER_COMMANDS.push(cmd);
  }
}

export const CATEGORIES = [
  { id: 'all', label: 'All Commands', count: DOCKER_COMMANDS.length },
  { id: 'basic', label: 'Basic Commands', badge: 'Beginner', count: DOCKER_COMMANDS.filter(c => c.category === 'basic').length, desc: 'Container lifecycle, basic images, status inspection, tags & search' },
  { id: 'intermediate', label: 'Intermediate', badge: 'Mid-Level', count: DOCKER_COMMANDS.filter(c => c.category === 'intermediate').length, desc: 'Exec, logs, networking, volumes, bind mounts, file sync, diffs' },
  { id: 'advanced', label: 'Advanced Commands', badge: 'Expert', count: DOCKER_COMMANDS.filter(c => c.category === 'advanced').length, desc: 'Cgroups v2, CPU pinning, tmpfs, Capabilities, Swarm, Buildx, Prune' }
];

