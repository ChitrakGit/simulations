// Comprehensive Docker Components & Architecture Topology Data
// Details every subsystem: dockerd, containerd, containerd-shim, runc, container, application, bridge, veth, iptables, overlayfs, kernel, hardware

export const DOCKER_COMPONENTS = [
  {
    id: 'client',
    name: 'Docker Client',
    shortName: 'CLI / API',
    subtitle: 'User Interface & Command Dispatcher',
    category: 'control-plane',
    iconName: 'Terminal',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    binary: '/usr/bin/docker',
    protocols: ['Unix Domain Socket (/var/run/docker.sock)', 'HTTP/1.1 REST API v1.43', 'TCP/TLS :2376'],
    role: 'Primary interface for users and automated CI/CD pipelines. Translates user commands (docker run, exec, build) into structured JSON HTTP API calls and streams terminal stdout/stderr.',
    responsibilities: [
      'Command-line syntax parsing and argument/flag validation',
      'Serializing container specifications into OCI-compliant JSON HostConfig payloads',
      'Communicating with the Docker daemon over local unix domain socket or remote TLS socket',
      'Multiplexing terminal stdin, stdout, and stderr with raw TTY handling'
    ],
    syscalls: [
      'socket(AF_UNIX, SOCK_STREAM, 0)',
      'connect("/var/run/docker.sock")',
      'write() / read() HTTP request/response stream',
      'ioctl(0, TIOCGWINSZ, ...)'
    ],
    interactions: {
      sendsTo: ['dockerd'],
      receivesFrom: ['dockerd']
    },
    hostPath: '/usr/bin/docker',
    inspectCommand: 'docker version && ls -l /var/run/docker.sock'
  },
  {
    id: 'dockerd',
    name: 'Docker Daemon (dockerd)',
    shortName: 'dockerd',
    subtitle: 'Engine Core & API Orchestrator',
    category: 'control-plane',
    iconName: 'Server',
    color: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    binary: '/usr/bin/dockerd',
    protocols: ['REST API Listener', 'gRPC (to containerd)', 'Netlink (to kernel network stack)'],
    role: 'The persistent core service of the Docker Engine. Provides the REST API, manages image builds and caching, handles named volumes, manages user-defined networks, and delegates execution to containerd.',
    responsibilities: [
      'Hosting Docker REST API endpoint on /var/run/docker.sock and optional TCP ports',
      'Managing local image layer cache, tagging, and registry authentication',
      'Orchestrating named volume lifecycle and local/remote volume plugins',
      'Managing Docker bridge/overlay networks and programming Linux iptables rules',
      'Translating Docker API container specs into containerd OCI container creation requests'
    ],
    syscalls: [
      'accept4() on socket fd',
      'epoll_wait() for non-blocking I/O multiplexing',
      'socket(AF_NETLINK, SOCK_RAW, NETLINK_ROUTE)',
      'openat("/var/lib/docker/...")'
    ],
    interactions: {
      sendsTo: ['containerd', 'iptables', 'bridge', 'overlayfs'],
      receivesFrom: ['client']
    },
    hostPath: '/usr/bin/dockerd',
    inspectCommand: 'systemctl status docker && journalctl -u docker -n 25 --no-pager'
  },
  {
    id: 'containerd',
    name: 'containerd',
    shortName: 'containerd',
    subtitle: 'OCI Container Lifecycle & Content Supervisor',
    category: 'control-plane',
    iconName: 'Layers',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    binary: '/usr/bin/containerd',
    protocols: ['gRPC API (/run/containerd/containerd.sock)', 'OCI Image Spec', 'OCI Runtime Spec'],
    role: 'A CNCF-graduated container runtime that oversees the entire container lifecycle of the host: image ingestion, content storage, snapshotting, container task execution, and supervision.',
    responsibilities: [
      'Serving gRPC requests from dockerd and Kubernetes Kubelet (via CRI)',
      'Unpacking container image layers into OverlayFS snapshot bundles',
      'Generating OCI config.json specifications for runc',
      'Spawning containerd-shim processes for running container tasks',
      'Monitoring container health, exit codes, and resource metrics'
    ],
    syscalls: [
      'bind("/run/containerd/containerd.sock")',
      'epoll_create1(EPOLL_CLOEXEC)',
      'clone(SIGCHLD) for shim spawning',
      'open("/var/lib/containerd/io.containerd.content.v1.content/...")'
    ],
    interactions: {
      sendsTo: ['shim', 'overlayfs'],
      receivesFrom: ['dockerd']
    },
    hostPath: '/usr/bin/containerd',
    inspectCommand: 'ctr -n moby containers list && containerd --version'
  },
  {
    id: 'shim',
    name: 'containerd-shim',
    shortName: 'shim',
    subtitle: 'Daemonless Lifecycle & I/O Anchor',
    category: 'control-plane',
    iconName: 'Anchor',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    binary: '/usr/bin/containerd-shim-runc-v2',
    protocols: ['TTRPC (low-overhead RPC)', 'UNIX FIFO pipes (stdin/stdout/stderr)', 'PTY Master/Slave'],
    role: 'A lightweight process dedicated to each running container instance. Anchors stdio streams, holds container file descriptors open, captures exit codes, and allows dockerd/containerd to be upgraded without terminating containers.',
    responsibilities: [
      'Decoupling the container process from the containerd daemon',
      'Holding container stdio FIFO pipes open to prevent EPIPE broken pipe errors',
      'Maintaining the container pseudo-terminal (PTY) master descriptor',
      'Capturing the container process exit status code and delivering it back to containerd',
      'Executing runc commands (create, start, kill, delete, exec)'
    ],
    syscalls: [
      'pipe2(O_NONBLOCK)',
      'open("/dev/pts/...", O_RDWR)',
      'wait4(container_pid, &status, WUNTRACED, NULL)',
      'write(exit_fifo, ...)'
    ],
    interactions: {
      sendsTo: ['runc', 'app'],
      receivesFrom: ['containerd']
    },
    hostPath: '/usr/bin/containerd-shim-runc-v2',
    inspectCommand: 'ps -ef | grep containerd-shim | grep -v grep'
  },
  {
    id: 'runc',
    name: 'runc (OCI Runtime)',
    shortName: 'runc',
    subtitle: 'Low-Level Linux Syscall Executor',
    category: 'control-plane',
    iconName: 'Zap',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    binary: '/usr/bin/runc',
    protocols: ['OCI Runtime Spec v1.0', 'Linux Kernel Syscall ABI'],
    role: 'The reference CLI tool for spawning and running containers according to OCI specifications. Translates config.json into Linux kernel syscalls (clone, pivot_root, cgroups, capabilities) and then exits.',
    responsibilities: [
      'Validating OCI config.json container specification bundle',
      'Executing clone() with namespace flags (CLONE_NEWPID, CLONE_NEWNET, etc.)',
      'Writing resource constraints to cgroups v2 controller files (cpu.max, memory.max)',
      'Chrooting and mounting rootfs using pivot_root()',
      'Dropping Linux capabilities and applying Seccomp system call filters',
      'Executing the application entrypoint via execve() and immediately terminating'
    ],
    syscalls: [
      'clone(CLONE_NEWNS|CLONE_NEWPID|CLONE_NEWNET|CLONE_NEWIPC|CLONE_NEWUTS)',
      'pivot_root("/run/containerd/.../rootfs", "/run/containerd/.../rootfs/oldroot")',
      'prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, ...)',
      'execve("/usr/sbin/nginx", ...)'
    ],
    interactions: {
      sendsTo: ['kernel', 'container', 'app'],
      receivesFrom: ['shim']
    },
    hostPath: '/usr/bin/runc',
    inspectCommand: 'runc --version && runc list'
  },
  {
    id: 'container',
    name: 'Container Boundary',
    shortName: 'Container Env',
    subtitle: 'Isolated Namespaces & Cgroup Envelope',
    category: 'container',
    iconName: 'ShieldCheck',
    color: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    binary: 'Linux Kernel Isolation Envelope',
    protocols: ['PID, MNT, NET, IPC, UTS, USER Namespaces', 'cgroups v2 hierarchy'],
    role: 'A logical sandbox envelope maintained by the Linux kernel. Provides process, network, mount, and user isolation without hardware virtualization overhead.',
    responsibilities: [
      'Isolating process tree: container sees its own PID 1 and descendants',
      'Isolating network stack: private loopback (lo) and container eth0 interface',
      'Isolating filesystem view: isolated root mount with OverlayFS rootfs',
      'Limiting hardware resource consumption via cgroups v2 memory and CPU ceilings',
      'Restricting kernel privileges using dropped Linux capabilities and Seccomp filters'
    ],
    syscalls: [
      'unshare()',
      'setns()',
      'mount("proc", "/proc", "proc", MS_NOSUID|MS_NODEV|MS_NOEXEC)'
    ],
    interactions: {
      sendsTo: ['app', 'veth', 'overlayfs'],
      receivesFrom: ['runc', 'kernel']
    },
    hostPath: '/proc/[pid]/ns/*',
    inspectCommand: 'ls -la /proc/$(docker inspect -f "{{.State.Pid}}" <container_id>)/ns/'
  },
  {
    id: 'app',
    name: 'Container Application',
    shortName: 'App (PID 1)',
    subtitle: 'Isolated User-Space Workload',
    category: 'container',
    iconName: 'Box',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    binary: '/usr/sbin/nginx (or node, python, go, java)',
    protocols: ['TCP/UDP Application Sockets', 'Virtual eth0 interface', 'stdio (fd 0, 1, 2)'],
    role: 'The user workload process running in Ring 3 user space. Executes inside container namespaces, listens on virtual network ports, writes to rootfs/volumes, and handles application traffic.',
    responsibilities: [
      'Running user application logic as PID 1 (or under init system)',
      'Listening on internal container ports (e.g. 0.0.0.0:80, 0.0.0.0:3000)',
      'Reading and writing files through the container virtual filesystem',
      'Streaming log output to stdout and stderr (picked up by containerd-shim)',
      'Handling signals (SIGTERM, SIGINT) for graceful shutdown'
    ],
    syscalls: [
      'socket(AF_INET, SOCK_STREAM, 0)',
      'bind(0.0.0.0:80)',
      'listen(fd, 511)',
      'accept4() / epoll_wait()',
      'write(1, "log line\\n", 9)'
    ],
    interactions: {
      sendsTo: ['veth', 'overlayfs', 'shim'],
      receivesFrom: ['shim', 'veth']
    },
    hostPath: 'Inside container rootfs',
    inspectCommand: 'docker top <container_name> && docker exec <container_name> ps aux'
  },
  {
    id: 'bridge',
    name: 'Linux Bridge (docker0)',
    shortName: 'docker0 Bridge',
    subtitle: 'Software Virtual L2 Ethernet Switch',
    category: 'networking',
    iconName: 'Network',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    binary: 'Kernel module: bridge.ko',
    protocols: ['Ethernet IEEE 802.1D', 'ARP Protocol', 'Subnet: 172.17.0.0/16 (default)'],
    role: 'A software-defined Layer 2 network switch implemented inside the host Linux kernel. Acts as the default gateway (172.17.0.1) for bridge-mode containers and switches packets between veth interfaces.',
    responsibilities: [
      'Forwarding Ethernet frames between attached host veth interfaces based on MAC table',
      'Serving as the default gateway IP (172.17.0.1) for containers on the default bridge',
      'Forwarding inter-container traffic directly at Layer 2 without host physical network exposure',
      'Passing outbound traffic to host IP routing table for NAT translation'
    ],
    syscalls: [
      'ioctl(fd, SIOCBRADDBR, "docker0")',
      'netlink RTM_NEWLINK',
      'br_handle_frame() in Linux net/bridge'
    ],
    interactions: {
      sendsTo: ['veth', 'iptables', 'kernel'],
      receivesFrom: ['veth', 'iptables', 'dockerd']
    },
    hostPath: '/sys/class/net/docker0',
    inspectCommand: 'ip addr show docker0 && bridge link show'
  },
  {
    id: 'veth',
    name: 'Virtual Ethernet Pair (veth)',
    shortName: 'veth Pair',
    subtitle: 'Bidirectional Inter-Namespace Cable',
    category: 'networking',
    iconName: 'Cable',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    binary: 'Kernel module: veth.ko',
    protocols: ['Point-to-Point Virtual Ethernet Cable', 'Cross-Namespace Tunnel'],
    role: 'A pair of interconnected virtual network interfaces acting like a virtual Ethernet patch cord. One end connects to the host docker0 bridge, while the other is injected into the container network namespace as eth0.',
    responsibilities: [
      'Bridging network traffic across the host network namespace and container network namespace',
      'Host end (e.g. veth9a4c1) is enslaved to docker0 bridge',
      'Peer end is moved into container netns and renamed to eth0 with IP (e.g. 172.17.0.2)',
      'Instant packet transfer in kernel memory with zero serialization overhead'
    ],
    syscalls: [
      'ip link add vethXXXX type veth peer name eth0',
      'ip link set eth0 netns <pid>',
      'veth_xmit() in Linux drivers/net/veth.c'
    ],
    interactions: {
      sendsTo: ['bridge', 'app'],
      receivesFrom: ['bridge', 'app']
    },
    hostPath: '/sys/class/net/veth*',
    inspectCommand: 'ip link show type veth && docker exec <container_name> ip addr show eth0'
  },
  {
    id: 'iptables',
    name: 'iptables / Netfilter NAT',
    shortName: 'iptables NAT',
    subtitle: 'Port Forwarding (DNAT) & Internet Egress (SNAT)',
    category: 'networking',
    iconName: 'Shield',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    binary: '/usr/sbin/iptables / nftables',
    protocols: ['Netfilter PREROUTING / POSTROUTING / FORWARD', 'DNAT (Port Forward)', 'MASQUERADE (SNAT)'],
    role: 'The Linux kernel packet filtering and Network Address Translation (NAT) engine. Programs Docker rules for port forwarding (host port 80 -> container port 80) and outbound container internet egress masquerading.',
    responsibilities: [
      'DNAT (Destination NAT): Translates incoming traffic to host port 80 -> container private IP (172.17.0.2:80)',
      'SNAT / MASQUERADE: Rewrites outbound container packets to host physical IP so containers can reach the internet',
      'Inter-container traffic filtering (ICC: inter-container communication policy)',
      'Protecting host services from unauthorized container network access'
    ],
    syscalls: [
      'setsockopt(fd, SOL_IP, IPT_SO_SET_REPLACE, ...)',
      'nf_hook_slow() in Linux net/netfilter',
      'iptables-restore / nft command execution'
    ],
    interactions: {
      sendsTo: ['bridge', 'kernel', 'hardware'],
      receivesFrom: ['hardware', 'bridge', 'dockerd']
    },
    hostPath: '/etc/iptables / kernel netfilter',
    inspectCommand: 'iptables -t nat -L DOCKER -n -v && sysctl net.ipv4.ip_forward'
  },
  {
    id: 'overlayfs',
    name: 'OverlayFS Storage Driver',
    shortName: 'OverlayFS',
    subtitle: 'Layered Copy-on-Write Union Filesystem',
    category: 'storage',
    iconName: 'HardDrive',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    binary: 'Kernel module: overlay.ko',
    protocols: ['VFS Union Mount', 'lowerdir (Read-Only Images)', 'upperdir (Container Read-Write)', 'merged (Unified View)'],
    role: 'The default Linux union filesystem driver for Docker. Merges multiple immutable image layers (lowerdir) with a single container scratch layer (upperdir) into a unified directory tree (merged).',
    responsibilities: [
      'Stacking read-only image layers efficiently without data duplication',
      'Providing instantaneous container creation: containers share image layers in memory',
      'Copy-on-Write (CoW): when a file is modified, it is copied up from lowerdir to upperdir before modification',
      'Whiteout support: deleting a lowerdir file creates a character device whiteout in upperdir'
    ],
    syscalls: [
      'mount("overlay", "/var/lib/docker/overlay2/.../merged", "overlay", 0, "lowerdir=...,upperdir=...,workdir=...")',
      'ovl_copy_up() in Linux fs/overlayfs'
    ],
    interactions: {
      sendsTo: ['kernel', 'hardware'],
      receivesFrom: ['dockerd', 'containerd', 'app']
    },
    hostPath: '/var/lib/docker/overlay2',
    inspectCommand: 'mount | grep overlay && docker info | grep "Storage Driver"'
  },
  {
    id: 'kernel',
    name: 'Host Linux Kernel (Ring 0)',
    shortName: 'Host Kernel',
    subtitle: 'Syscalls, Cgroups v2 & Hardware Arbiter',
    category: 'host',
    iconName: 'Cpu',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    binary: '/boot/vmlinuz-linux',
    protocols: ['x86_64 / arm64 System Call Interface', 'cgroups v2 hierarchy', 'VFS & Memory Management'],
    role: 'The privileged core of the operating system running in CPU Ring 0. Provides the fundamental isolation primitives (namespaces), enforces resource constraints (cgroups v2), and coordinates hardware access.',
    responsibilities: [
      'Managing CPU Completely Fair Scheduler (CFS) bandwidth quotas (cpu.max)',
      'Enforcing strict DDR RAM limits and triggering OOM killer (memory.max)',
      'Translating virtual memory addresses to physical RAM via MMU page tables',
      'Executing network packet routing and TCP/IP stack processing',
      'Arbitrating NVMe SSD storage access via Direct Memory Access (DMA)'
    ],
    syscalls: [
      'sys_clone()',
      'sys_pivot_root()',
      'sys_setns()',
      'sys_epoll_wait()',
      'mem_cgroup_out_of_memory()'
    ],
    interactions: {
      sendsTo: ['hardware', 'container', 'app', 'bridge'],
      receivesFrom: ['runc', 'dockerd', 'shim', 'hardware']
    },
    hostPath: '/boot/vmlinuz && /proc /sys',
    inspectCommand: 'uname -a && cat /proc/version'
  },
  {
    id: 'hardware',
    name: 'Motherboard & Silicon Hardware',
    shortName: 'Silicon HW',
    subtitle: 'CPU Ring 0/3, DDR5 RAM, NVMe DMA & NIC',
    category: 'hardware',
    iconName: 'Activity',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    binary: 'Physical Motherboard & Silicon Components',
    protocols: ['PCIe Gen 5 Bus', 'DDR5 Memory Channels', 'Ethernet PHY / MAC', 'CPU Hardware Interrupts (APIC)'],
    role: 'The physical computing substrate. Executes silicon instructions, switches privilege rings, handles memory translation, drives SSD flash blocks, and moves network packets across copper/fiber wires.',
    responsibilities: [
      'CPU Cores execute Ring 3 user instructions and transition to Ring 0 on syscalls',
      'Memory Management Unit (MMU) walks page tables for virtual-to-physical address translation',
      'NVMe SSD Controller executes Direct Memory Access (DMA) block writes for filesystem data',
      'Physical Network Interface Card (NIC) processes frame preamble, CRC, and triggers CPU IRQ'
    ],
    syscalls: [
      'Hardware APIC Interrupts',
      'PCIe DMA Transactions',
      'CPU MSR Register programming',
      'TLB (Translation Lookaside Buffer) flushes'
    ],
    interactions: {
      sendsTo: ['kernel', 'iptables'],
      receivesFrom: ['kernel']
    },
    hostPath: 'Physical Motherboard Hardware',
    inspectCommand: 'lscpu && lshw -C network && lspci'
  }
];

export const INTERACTION_FLOWS = [
  {
    id: 'flow-lifecycle',
    title: 'Container Creation & Execution Lifecycle',
    command: 'docker run -d -p 80:80 nginx',
    summary: 'Trace how a container is created from Docker CLI command down to runc, Linux namespaces, and Nginx PID 1 startup.',
    badge: 'Core Lifecycle',
    color: '#38bdf8',
    steps: [
      {
        stepIndex: 1,
        source: 'client',
        target: 'dockerd',
        title: 'Client Dispatches Container Run API Request',
        mechanism: 'Unix Domain Socket (/var/run/docker.sock)',
        protocol: 'HTTP/1.1 POST /containers/create & POST /containers/(id)/start',
        description: 'Docker CLI parses flags (-d, -p 80:80, nginx), serializes HostConfig JSON, and sends HTTP request to the local daemon socket.',
        dataPayload: '{"Image": "nginx", "PortBindings": {"80/tcp": [{"HostPort": "80"}]}}',
        details: 'The CLI client opens /var/run/docker.sock and issues an API call. If the daemon is remote, this can be TLS-secured TCP port 2376.'
      },
      {
        stepIndex: 2,
        source: 'dockerd',
        target: 'containerd',
        title: 'Daemon Prepares Bundle & Commands containerd',
        mechanism: 'gRPC over /run/containerd/containerd.sock',
        protocol: 'gRPC ContainerService.Create()',
        description: 'dockerd verifies image layers in OverlayFS, resolves network configuration, creates container metadata in memory, and instructs containerd via gRPC.',
        dataPayload: 'gRPC CreateContainerRequest { id: "b8f9e21...", rootfs: "/var/lib/docker/overlay2/..." }',
        details: 'dockerd delegates low-level execution to containerd, conforming to the modern modular decoupled architecture.'
      },
      {
        stepIndex: 3,
        source: 'containerd',
        target: 'shim',
        title: 'containerd Spawns Dedicated containerd-shim',
        mechanism: 'clone() Syscall & TTRPC Socket',
        protocol: 'POSIX Fork/Exec & TTRPC Pipe',
        description: 'containerd forks a dedicated containerd-shim-runc-v2 process. The shim will stay alive with the container to anchor stdio pipes and exit codes.',
        dataPayload: 'PID 14210 containerd-shim-runc-v2 -id b8f9e21 -namespace moby',
        details: 'Having a shim process per container enables "daemonless containers": dockerd or containerd can restart without terminating running containers.'
      },
      {
        stepIndex: 4,
        source: 'shim',
        target: 'runc',
        title: 'Shim Invokes OCI Runtime (runc)',
        mechanism: 'Execve /usr/bin/runc create',
        protocol: 'OCI Runtime Specification v1.0',
        description: 'The shim passes the OCI config.json bundle specification (specifying namespaces, cgroup limits, mounts, env) to the runc binary.',
        dataPayload: 'runc --root /run/containerd/runc/moby create --bundle /run/containerd/io.containerd.runtime.v2.task/moby/b8f9e21',
        details: 'runc reads the generated config.json which tells it exactly what Linux kernel isolation primitives to instantiate.'
      },
      {
        stepIndex: 5,
        source: 'runc',
        target: 'kernel',
        title: 'runc Invokes Kernel Namespaces & Cgroup Isolation',
        mechanism: 'Linux Syscalls (clone, unshare, pivot_root)',
        protocol: 'Linux Kernel System Call ABI',
        description: 'runc executes clone() with CLONE_NEWPID, CLONE_NEWNET, CLONE_NEWNS flags. It mounts rootfs using pivot_root(), applies cgroups v2 limits, and drops capabilities.',
        dataPayload: 'clone(CLONE_NEWNS|CLONE_NEWPID|CLONE_NEWNET|CLONE_NEWIPC|CLONE_NEWUTS); pivot_root(); write(cpu.max);',
        details: 'The Linux kernel provisions the isolated sandbox. Once setup is complete, runc calls execve() to start Nginx, and runc exits immediately.'
      },
      {
        stepIndex: 6,
        source: 'dockerd',
        target: 'bridge',
        title: 'Daemon Programs Bridge & iptables Port Forwarding',
        mechanism: 'Netlink Syscalls & iptables Rules',
        protocol: 'Linux Bridge & Netfilter NAT Table',
        description: 'dockerd plugs a veth pair into the docker0 bridge, assigns IP 172.17.0.2 to eth0, and adds an iptables DNAT rule forwarding host port 80 to container port 80.',
        dataPayload: 'iptables -t nat -A DOCKER -p tcp -m tcp --dport 80 -j DNAT --to-destination 172.17.0.2:80',
        details: 'The virtual network path is now live and ready to receive external network traffic.'
      },
      {
        stepIndex: 7,
        source: 'runc',
        target: 'app',
        title: 'Nginx Starts as PID 1 in Isolated User Space',
        mechanism: 'execve("/usr/sbin/nginx")',
        protocol: 'User-Space Application Execution (Ring 3)',
        description: 'runc transforms the cloned child process into Nginx. Nginx runs as PID 1 in its private PID namespace, opens socket on 0.0.0.0:80, and streams logs to the shim.',
        dataPayload: 'PID 1: nginx: master process /usr/sbin/nginx -g daemon off; listening on 0.0.0.0:80',
        details: 'The container is now fully active. runc has terminated; containerd-shim continues monitoring Nginx PID 1.'
      }
    ]
  },
  {
    id: 'flow-inbound-network',
    title: 'Inbound Network Traffic & Port Forwarding',
    command: 'curl http://192.168.1.100:80 (Host -> Container:80)',
    summary: 'Trace an incoming TCP HTTP packet from the physical NIC down through iptables DNAT, docker0 bridge, veth pair, and into Nginx.',
    badge: 'Networking Flow',
    color: '#f59e0b',
    steps: [
      {
        stepIndex: 1,
        source: 'hardware',
        target: 'kernel',
        title: 'Physical NIC Receives Packet & Fires Hardware IRQ',
        mechanism: 'PCIe Direct Memory Access (DMA) & APIC Interrupt',
        protocol: 'Ethernet Frame 802.3 / IP Packet',
        description: 'Incoming TCP SYN packet hits host physical NIC (eth0). The NIC hardware DMA engine writes packet into host RAM ring buffer and fires CPU interrupt.',
        dataPayload: 'TCP SYN: Src 192.168.1.50:54321 -> Dst 192.168.1.100:80',
        details: 'CPU core switches to kernel Ring 0 interrupt handler and schedules NAPI polling to drain the network ring buffer.'
      },
      {
        stepIndex: 2,
        source: 'kernel',
        target: 'iptables',
        title: 'Netfilter PREROUTING Evaluates iptables DNAT Rule',
        mechanism: 'Linux Netfilter Hook (NF_INET_PRE_ROUTING)',
        protocol: 'iptables nat Table / DOCKER Chain',
        description: 'Kernel passes packet into Netfilter. The DOCKER chain identifies destination port 80 and rewrites the destination IP to container IP 172.17.0.2:80 (DNAT).',
        dataPayload: 'DNAT: 192.168.1.100:80 rewritten to 172.17.0.2:80',
        details: 'Connection tracking (conntrack) creates a state table entry so reply packets will automatically have their source rewritten back to host IP.'
      },
      {
        stepIndex: 3,
        source: 'iptables',
        target: 'bridge',
        title: 'Routing Engine Directs Packet to docker0 Bridge',
        mechanism: 'Kernel IP Routing Table (ip_route_input_noref)',
        protocol: 'Linux Kernel L3 Forwarding',
        description: 'Kernel routing table checks destination 172.17.0.2, sees it belongs to docker0 subnet (172.17.0.0/16), and forwards frame onto the docker0 software bridge.',
        dataPayload: 'Forwarding sk_buff to bridge dev "docker0"',
        details: 'Host routing acts as virtual gateway between the physical LAN and the internal Docker container subnet.'
      },
      {
        stepIndex: 4,
        source: 'bridge',
        target: 'veth',
        title: 'docker0 Bridge Switches Frame to veth Interface',
        mechanism: 'Layer 2 MAC Forwarding Table (FDB)',
        protocol: 'Ethernet Frame 802.1D Switching',
        description: 'docker0 bridge inspects container MAC address in its forwarding database (FDB) and switches the Ethernet frame to port veth9a4c1.',
        dataPayload: 'MAC 02:42:ac:11:00:02 forwarded out veth9a4c1',
        details: 'The software bridge mimics a physical hardware L2 switch entirely within kernel memory.'
      },
      {
        stepIndex: 5,
        source: 'veth',
        target: 'container',
        title: 'veth Cable Crosses Network Namespace into Container',
        mechanism: 'veth_xmit() Memory Queue Transfer',
        protocol: 'Linux Netns Boundary Crossing',
        description: 'Packet leaves host namespace via veth9a4c1 and instantly appears on peer interface eth0 inside the container network namespace.',
        dataPayload: 'Crosses netns boundary: veth9a4c1 -> container eth0',
        details: 'Zero physical serialization overhead: Linux veth driver simply reassigns the socket buffer sk_buff pointer to the peer interface.'
      },
      {
        stepIndex: 6,
        source: 'container',
        target: 'app',
        title: 'TCP Socket Buffer Wakes Up Nginx Worker (epoll)',
        mechanism: 'epoll_wait() Event & recvfrom() Syscall',
        protocol: 'TCP Handshake Complete / HTTP Request Read',
        description: 'Kernel delivers packet to container TCP socket buffer. Nginx worker process blocked in epoll_wait() wakes up, calls accept4(), and reads the HTTP GET request.',
        dataPayload: 'HTTP/1.1 GET / -> 200 OK (Content-Type: text/html)',
        details: 'Nginx processes the request in isolated user space (Ring 3) and sends the HTTP response back through the exact reverse path.'
      }
    ]
  },
  {
    id: 'flow-outbound-network',
    title: 'Outbound Internet Access & MASQUERADE (SNAT)',
    command: 'curl -I https://api.github.com (Container -> External)',
    summary: 'Trace an outbound container request reaching out to the public internet using default gateway routing and iptables MASQUERADE (SNAT).',
    badge: 'Egress NAT Flow',
    color: '#10b981',
    steps: [
      {
        stepIndex: 1,
        source: 'app',
        target: 'container',
        title: 'App Calls connect() on Virtual eth0 Interface',
        mechanism: 'socket() & connect() Syscalls',
        protocol: 'TCP SYN: 172.17.0.2:48920 -> 140.82.121.4:443',
        description: 'Container application resolves external domain via Docker embedded DNS (127.0.0.11) and calls connect() to initiate TCP handshake with GitHub API.',
        dataPayload: 'SYN Packet: Src: 172.17.0.2, Dst: 140.82.121.4 (GitHub)',
        details: 'Container network namespace has its own routing table with default gateway pointed to 172.17.0.1 (docker0).'
      },
      {
        stepIndex: 2,
        source: 'container',
        target: 'veth',
        title: 'Packet Traverses veth Cable Out of Container',
        mechanism: 'veth Tunneling',
        protocol: 'Point-to-Point Virtual Ethernet Cable',
        description: 'Container kernel sends frame out of eth0. It travels across the virtual cable pair and emerges on host interface veth9a4c1.',
        dataPayload: 'veth frame transfer to host netns',
        details: 'Moves from container isolated network namespace into host root network namespace.'
      },
      {
        stepIndex: 3,
        source: 'veth',
        target: 'bridge',
        title: 'docker0 Receives Frame at Default Gateway (172.17.0.1)',
        mechanism: 'Linux Bridge Ingress',
        protocol: 'ARP & L2 Ethernet Frame',
        description: 'The frame enters docker0 bridge. Since destination IP (140.82.121.4) is external, the bridge hands it to the host IP forwarding engine.',
        dataPayload: 'L3 Forwarding handoff on docker0',
        details: 'Requires sysctl net.ipv4.ip_forward=1 enabled on the host Linux kernel.'
      },
      {
        stepIndex: 4,
        source: 'bridge',
        target: 'iptables',
        title: 'iptables POSTROUTING Applies MASQUERADE (SNAT)',
        mechanism: 'Netfilter POSTROUTING Chain MASQUERADE',
        protocol: 'Source NAT (SNAT)',
        description: 'Because private IP 172.17.0.2 cannot route on the public internet, iptables rewrites source IP from 172.17.0.2 to the host physical public IP (e.g. 192.168.1.100).',
        dataPayload: 'SNAT: Src IP 172.17.0.2 replaced with Host IP 192.168.1.100',
        details: 'Host conntrack maps container private port to a host dynamic source port so replies can be demultiplexed back to the container.'
      },
      {
        stepIndex: 5,
        source: 'iptables',
        target: 'hardware',
        title: 'Physical NIC Transmits Frame to Gateway Router',
        mechanism: 'PCIe DMA Ring Buffer & Physical Transceiver',
        protocol: 'Physical Ethernet 802.3 / Internet WAN',
        description: 'The rewritten packet is placed in physical NIC transmit (TX) ring buffer. NIC hardware transmits the frame over copper/fiber cable to the router.',
        dataPayload: 'Packet egress on physical eth0 to default gateway',
        details: 'The container successfully reaches the global internet without requiring a dedicated public IP address.'
      }
    ]
  },
  {
    id: 'flow-exec-session',
    title: 'Interactive Exec Session Injection',
    command: 'docker exec -it my_container bash',
    summary: 'Trace how Docker injects a new process into existing namespaces using setns() and streams terminal I/O back through containerd-shim.',
    badge: 'Exec Injection',
    color: '#ec4899',
    steps: [
      {
        stepIndex: 1,
        source: 'client',
        target: 'dockerd',
        title: 'Client Allocates Local PTY & Sends Exec API Request',
        mechanism: 'Unix Socket (/var/run/docker.sock)',
        protocol: 'POST /v1.43/containers/my_container/exec',
        description: 'Docker CLI sets terminal to raw mode, queries terminal window size (TIOCGWINSZ), and requests an exec instance with TTY and stdin attached.',
        dataPayload: '{"AttachStdin": true, "AttachStdout": true, "Tty": true, "Cmd": ["bash"]}',
        details: 'Client keeps socket open in bidirectional streaming mode.'
      },
      {
        stepIndex: 2,
        source: 'dockerd',
        target: 'containerd',
        title: 'dockerd Directs containerd Task Service',
        mechanism: 'gRPC over containerd.sock',
        protocol: 'gRPC TaskService.Exec()',
        description: 'dockerd tells containerd to register a new sub-task inside the container sandbox and connects the stream pipes.',
        dataPayload: 'ExecProcessRequest { exec_id: "exec-9210", terminal: true }',
        details: 'containerd notifies the existing containerd-shim anchoring this container.'
      },
      {
        stepIndex: 3,
        source: 'containerd',
        target: 'shim',
        title: 'Shim Allocates PTY Master/Slave Pair',
        mechanism: 'open("/dev/ptmx") Syscall',
        protocol: 'Linux Pseudo-Terminal Subsystem',
        description: 'containerd-shim allocates a new PTY master and slave pair (/dev/pts/X) for the upcoming bash session to handle line buffering and escape sequences.',
        dataPayload: 'PTY pair: master_fd=7, slave_fd="/dev/pts/2"',
        details: 'Allows interactive shells like bash to render cursor colors, Ctrl+C signals, and command tab completion.'
      },
      {
        stepIndex: 4,
        source: 'shim',
        target: 'runc',
        title: 'Shim Calls runc exec Targeting Container PID 1',
        mechanism: 'runc exec Command',
        protocol: 'OCI Exec Protocol',
        description: 'Shim runs runc exec with the container ID, target PTY descriptors, and bash command arguments.',
        dataPayload: 'runc --root ... exec --process-label ... my_container bash',
        details: 'runc does not create a new container; it joins the existing one.'
      },
      {
        stepIndex: 5,
        source: 'runc',
        target: 'kernel',
        title: 'runc Executes setns() to Join Existing Namespaces',
        mechanism: 'setns() Syscalls on /proc/[pid]/ns/*',
        protocol: 'Linux Kernel Namespace Joining ABI',
        description: 'runc opens the namespace descriptors of container PID 1 (/proc/14820/ns/mnt, pid, net, ipc) and invokes setns() for each namespace.',
        dataPayload: 'setns(open("/proc/14820/ns/pid"), CLONE_NEWPID); setns(..., CLONE_NEWNS);',
        details: 'The calling process is instantaneously transported into the container isolated view.'
      },
      {
        stepIndex: 6,
        source: 'kernel',
        target: 'app',
        title: 'Bash Shell Starts Inside Container & Streams I/O',
        mechanism: 'execve("/bin/bash") & PTY I/O Multiplexing',
        protocol: 'Bidirectional Terminal Stdio Multiplexing',
        description: 'runc executes /bin/bash. The user sees a root@container prompt. Every keystroke from the CLI client travels through dockerd -> containerd -> shim -> PTY -> bash.',
        dataPayload: 'bash prompt rendered: "root@b8f9e2193b21:/# "',
        details: 'The new bash process shares the exact same memory, filesystem, and network view as the main Nginx process.'
      }
    ]
  },
  {
    id: 'flow-overlayfs-cow',
    title: 'OverlayFS Storage Layering & Copy-on-Write (CoW)',
    command: 'echo "hello" >> /usr/share/nginx/html/index.html',
    summary: 'Trace a disk write operation as OverlayFS detects a read-only lower layer file, performs atomic copy-up to upperdir, and writes to physical SSD flash.',
    badge: 'Storage & CoW Flow',
    color: '#06b6d4',
    steps: [
      {
        stepIndex: 1,
        source: 'app',
        target: 'container',
        title: 'Application Calls open() with Write Flags',
        mechanism: 'openat() Syscall',
        protocol: 'VFS openat(AT_FDCWD, "index.html", O_WRONLY|O_APPEND)',
        description: 'Process requests write access to index.html, which originally belongs to the immutable base image layer.',
        dataPayload: 'openat("index.html", O_WRONLY|O_CREAT|O_APPEND, 0666)',
        details: 'The process is completely unaware that it is operating on a multi-layered union filesystem.'
      },
      {
        stepIndex: 2,
        source: 'container',
        target: 'overlayfs',
        title: 'OverlayFS Driver Intercepts VFS Operation',
        mechanism: 'Linux VFS File Operations (ovl_open)',
        protocol: 'OverlayFS Union Filesystem Driver',
        description: 'OverlayFS driver inspects the merged directory. It determines index.html exists in read-only lowerdir, but not yet in writable upperdir.',
        dataPayload: 'File lookup: lowerdir="/var/lib/docker/overlay2/layer1/diff", upperdir=ABSENT',
        details: 'OverlayFS enforces copy-on-write semantics to preserve image layer immutability.'
      },
      {
        stepIndex: 3,
        source: 'overlayfs',
        target: 'kernel',
        title: 'Kernel Executes Atomic Copy-Up (ovl_copy_up)',
        mechanism: 'ovl_copy_up_one() in Linux fs/overlayfs',
        protocol: 'Kernel Page Cache Duplicate & Metadata Sync',
        description: 'Kernel allocates page cache, reads the original file from lowerdir, creates an identical copy in upperdir, and copies ownership, permissions, and extended attributes.',
        dataPayload: 'Copy-up: duplicate 612 bytes to /var/lib/docker/overlay2/container-upper/diff/index.html',
        details: 'The base image layer remains untouched and byte-identical across the entire cluster.'
      },
      {
        stepIndex: 4,
        source: 'kernel',
        target: 'hardware',
        title: 'NVMe Controller Writes Data Blocks via PCIe DMA',
        mechanism: 'PCIe NVMe Direct Memory Access (DMA)',
        protocol: 'NVMe Command: Write 4K Block',
        description: 'Kernel flushes modified memory pages to host NVMe drive. The NVMe controller writes the new bytes to physical NAND flash storage cells.',
        dataPayload: 'NVMe DMA write to host SSD block address 0x3F8A20',
        details: 'Future reads of index.html by the container will now be served directly from upperdir.'
      }
    ]
  },
  {
    id: 'flow-container-dns',
    title: 'Container-to-Container DNS & Service Discovery',
    command: 'docker exec web ping -c 1 db (Embedded DNS 127.0.0.11)',
    summary: 'Trace how Docker embedded DNS at 127.0.0.11 dynamically resolves service names in user-defined bridge networks and routes packets over local veth interfaces without NAT.',
    badge: 'DNS Discovery Flow',
    color: '#06b6d4',
    steps: [
      {
        stepIndex: 1,
        source: 'app',
        target: 'container',
        title: 'Application Sends DNS Query for "db"',
        mechanism: 'UDP Socket Syscall on Port 53',
        protocol: 'DNS Query (RFC 1035): A record for "db"',
        description: 'Web application initiates a lookup for "db". Container /etc/resolv.conf directs queries to nameserver 127.0.0.11.',
        dataPayload: 'UDP 172.20.0.2:53421 -> 127.0.0.11:53 (Query: db. A)',
        details: 'In user-defined bridge networks, Docker overrides the default resolv.conf to point to its embedded resolver.'
      },
      {
        stepIndex: 2,
        source: 'container',
        target: 'kernel',
        title: 'Kernel Netfilter Traps Query to Embedded Resolver',
        mechanism: 'iptables PREROUTING in Container Netns',
        protocol: 'Embedded Resolver Netfilter Interception',
        description: 'Loopback rule inside the container network namespace intercepts traffic to 127.0.0.11 and routes it to Docker daemon embedded resolver thread.',
        dataPayload: 'Trap 127.0.0.11:53 to Docker Daemon internal DNS thread',
        details: 'The resolver knows all container names and aliases attached to this specific user-defined network.'
      },
      {
        stepIndex: 3,
        source: 'dockerd',
        target: 'container',
        title: 'Embedded Resolver Returns Container IP (172.20.0.3)',
        mechanism: 'DNS Response Packet Injection',
        protocol: 'DNS Response: db -> 172.20.0.3 (TTL: 600s)',
        description: 'Embedded resolver looks up "db" in network IPAM table, finds Postgres container IP 172.20.0.3, and sends response back to web app.',
        dataPayload: 'DNS Answer: db -> 172.20.0.3',
        details: 'If name is external (e.g. google.com), embedded DNS transparently forwards to host upstream DNS resolvers.'
      },
      {
        stepIndex: 4,
        source: 'app',
        target: 'veth',
        title: 'Web App Sends TCP SYN Directly to 172.20.0.3:5432',
        mechanism: 'connect() Syscall on Virtual eth0 Interface',
        protocol: 'TCP SYN: 172.20.0.2 -> 172.20.0.3:5432',
        description: 'Web app connects directly to database private IP. Packet leaves container eth0 and enters the connected veth pair.',
        dataPayload: 'TCP SYN: 172.20.0.2:41200 -> 172.20.0.3:5432',
        details: 'No host port mapping (-p) is needed! Traffic remains completely internal to the virtual bridge.'
      },
      {
        stepIndex: 5,
        source: 'veth',
        target: 'bridge',
        title: 'User-Defined Bridge Switches Frame to Target veth',
        mechanism: 'Layer 2 Bridge FDB Table Switching',
        protocol: 'Software L2 Switch (br-backend)',
        description: 'The user-defined bridge inspects target MAC 02:42:ac:14:00:03 and switches the frame directly to Postgres container veth peer.',
        dataPayload: 'Switching frame: veth_web -> br_backend -> veth_db',
        details: 'Zero NAT or masquerading is involved. Communication occurs at near-native kernel memory bus speeds.'
      },
      {
        stepIndex: 6,
        source: 'bridge',
        target: 'app',
        title: 'Postgres Accepts Connection & Handshake Completes',
        mechanism: 'accept4() Syscall on Port 5432',
        protocol: 'TCP SYN-ACK Response',
        description: 'Postgres receives TCP connection, sends SYN-ACK, and database queries proceed securely inside the private virtual network.',
        dataPayload: 'PostgreSQL connection established on private subnet',
        details: 'External network attackers cannot see or touch port 5432 because it was never published on host interfaces.'
      }
    ]
  },
  {
    id: 'flow-sidecar-network',
    title: 'Sidecar Pattern: Shared Network Namespace',
    command: 'docker run --network container:web nicolaka/netshoot',
    summary: 'Trace how two containers share the exact same network stack (NETNS), loopback interface (127.0.0.1), and port table using the Linux CLONE_NEWNET primitive (Kubernetes Pod model).',
    badge: 'Sidecar & Pod Flow',
    color: '#a855f7',
    steps: [
      {
        stepIndex: 1,
        source: 'client',
        target: 'dockerd',
        title: 'User Requests Shared Network Namespace (--network container:web)',
        mechanism: 'Docker CLI API Call to dockerd',
        protocol: 'POST /containers/create with NetworkMode: "container:web"',
        description: 'User commands Docker to run a sidecar or debugging container attached directly to an existing container network stack.',
        dataPayload: '{"HostConfig": {"NetworkMode": "container:web_app"}}',
        details: 'This instructs the runtime not to create a new network namespace for the new container.'
      },
      {
        stepIndex: 2,
        source: 'dockerd',
        target: 'containerd',
        title: 'dockerd Locates Parent Container Netns Descriptor',
        mechanism: 'Kernel procfs Netns Lookup',
        protocol: 'gRPC Container Create Spec',
        description: 'Docker inspects PID of container "web" and locates its network namespace at /proc/[web_pid]/ns/net.',
        dataPayload: 'Netns path: /proc/18920/ns/net',
        details: 'Docker informs containerd that the new container must join this existing namespace file descriptor.'
      },
      {
        stepIndex: 3,
        source: 'containerd',
        target: 'runc',
        title: 'runc Generates OCI Spec with Shared Namespace Path',
        mechanism: 'OCI config.json Spec Assembly',
        protocol: 'OCI Linux Namespace Specification',
        description: 'runc is instructed to omit creating a new CLONE_NEWNET namespace and instead link to /proc/18920/ns/net.',
        dataPayload: '{"type": "network", "path": "/proc/18920/ns/net"}',
        details: 'Other namespaces (PID, MNT, UTS) can remain separate or shared based on user configuration.'
      },
      {
        stepIndex: 4,
        source: 'runc',
        target: 'kernel',
        title: 'runc Calls setns(CLONE_NEWNET) to Join Target Stack',
        mechanism: 'setns() System Call',
        protocol: 'Linux Kernel Namespace Joining ABI',
        description: 'runc calls setns(fd, CLONE_NEWNET). The sidecar process is instantly placed into the exact same network stack as the web container.',
        dataPayload: 'setns(open("/proc/18920/ns/net"), CLONE_NEWNET)',
        details: 'No new veth pair or bridge port is created. Zero additional memory or routing overhead.'
      },
      {
        stepIndex: 5,
        source: 'kernel',
        target: 'app',
        title: 'Sidecar & Web App Communicate Over Localhost (127.0.0.1)',
        mechanism: 'Shared Loopback (lo) & IP Stack',
        protocol: 'Local Inter-Process Socket (127.0.0.1)',
        description: 'The sidecar container can now curl http://localhost:8080 or run tcpdump -i eth0 to sniff traffic on the web app interface.',
        dataPayload: 'Localhost communication: 127.0.0.1:8080 accessible to both containers',
        details: 'This is the exact operating system primitive behind Kubernetes Pods, Envoy service mesh proxies, and cloud observability sidecars!'
      }
    ]
  }
];

export const COMPONENT_ZONES = [
  { id: 'all', label: 'All Components', count: DOCKER_COMPONENTS.length },
  { id: 'control-plane', label: 'Control Plane Engine', count: DOCKER_COMPONENTS.filter(c => c.category === 'control-plane').length, desc: 'Docker CLI, dockerd daemon, containerd, containerd-shim, runc' },
  { id: 'container', label: 'Container & App Space', count: DOCKER_COMPONENTS.filter(c => c.category === 'container').length, desc: 'Container sandbox envelope, namespaces, application PID 1' },
  { id: 'networking', label: 'Networking Stack', count: DOCKER_COMPONENTS.filter(c => c.category === 'networking').length, desc: 'docker0 Linux bridge, veth virtual cables, iptables NAT' },
  { id: 'storage', label: 'Storage & Filesystem', count: DOCKER_COMPONENTS.filter(c => c.category === 'storage').length, desc: 'OverlayFS union mount, lowerdir/upperdir CoW, named volumes' },
  { id: 'host-hardware', label: 'Host Kernel & Silicon', count: DOCKER_COMPONENTS.filter(c => ['host', 'hardware'].includes(c.category)).length, desc: 'Linux kernel Ring 0, cgroups v2, CPU Ring 3/0, DDR5 RAM, NVMe' }
];
