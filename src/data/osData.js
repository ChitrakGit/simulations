// =========================================================================
// OPERATING SYSTEM ARCHITECTURE, KERNEL INTERNALS & HARDWARE BUS DATA
// Comprehensive models for Linux, Windows, macOS, CPU, Memory & NIC
// =========================================================================

export const OS_FLAVORS = [
  {
    id: 'linux',
    name: 'Linux (GNU/Linux)',
    kernelName: 'Linux Monolithic Modular Kernel 6.x',
    type: 'Monolithic with Dynamically Loadable Kernel Modules (LKM)',
    color: '#f59e0b',
    accentGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    badge: 'Open-Source • POSIX Master',
    badgeColor: '#fef3c7',
    icon: 'Terminal',
    tagline: 'High-performance monolithic kernel powering top supercomputers and cloud infrastructure',
    architecture: {
      syscallInterface: 'POSIX Syscall ABI (sysenter / syscall 0x80)',
      processScheduler: 'CFS (Completely Fair Scheduler) using Red-Black Trees (O(log N))',
      memoryManager: 'Buddy Allocator + SLUB Caches + Virtual Memory Paging (4KB/2MB/1GB)',
      fileSystemDefault: 'ext4 / Btrfs / XFS via VFS (Virtual File System) abstraction',
      ioSubsystem: 'io_uring (Async zero-copy ring buffers) + epoll (Edge/Level triggered)',
      networkStack: 'sk_buff socket buffers, Netfilter iptables/nftables, eBPF XDP drivers',
      securityModel: 'Discretionary (DAC: chmod/chown) + Mandatory (MAC: SELinux/AppArmor) + Linux Capabilities',
      shellEnvironment: 'Bash (default), Zsh, Fish'
    }
  },
  {
    id: 'windows',
    name: 'Microsoft Windows (NT)',
    kernelName: 'Windows NT Kernel 10.0 (ntoskrnl.exe)',
    type: 'Hybrid Microkernel-derived Architecture (HAL + Executive + Microkernel)',
    color: '#0ea5e9',
    accentGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    badge: 'Enterprise • Win32 / NT Subsystem',
    badgeColor: '#e0f2fe',
    icon: 'Cpu',
    tagline: 'Enterprise desktop & server operating system with rich Win32 API and asynchronous I/O completion ports',
    architecture: {
      syscallInterface: 'Windows Native API (Nt/Zw syscalls via KiSystemCall64)',
      processScheduler: 'Preemptive Multi-Level Feedback Queue with Dynamic Priority Boosting (0-31)',
      memoryManager: 'NT Virtual Memory Manager (VMM), Working Sets, Paged/Non-Paged Pools, Pagefile.sys',
      fileSystemDefault: 'NTFS (Master File Table MFT, USN Journal) / ReFS (Resilient File System)',
      ioSubsystem: 'I/O Completion Ports (IOCP) + I/O Request Packets (IRP)',
      networkStack: 'NDIS (Network Driver Interface Specification) + Windows Filtering Platform (WFP)',
      securityModel: 'Access Control Lists (DACL/SACL), Security Identifiers (SIDs), BitLocker, Windows Defender Credential Guard',
      shellEnvironment: 'PowerShell 7+, Windows Command Prompt (cmd.exe), Windows Terminal'
    }
  },
  {
    id: 'macos',
    name: 'Apple macOS (Darwin)',
    kernelName: 'XNU Kernel (X is Not Unix - Mach 3.0 + BSD + I/O Kit)',
    type: 'Hybrid Monolithic / Microkernel (Mach microkernel core wrapped with BSD layer)',
    color: '#a855f7',
    accentGradient: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)',
    badge: 'UNIX 03 Certified • Apple Silicon ARM64',
    badgeColor: '#f3e8ff',
    icon: 'Layers',
    tagline: 'UNIX certified workstation OS combining Mach IPC, BSD POSIX subsystem, and Apple Silicon unified memory',
    architecture: {
      syscallInterface: 'Mach Messages / Traps (mach_msg) + BSD POSIX Syscall table',
      processScheduler: 'Mach Thread Scheduler with Quality of Service (QoS) classes (User Interactive to Background)',
      memoryManager: 'Mach Virtual Memory (VM) with dynamic page compressor (RAM compression before swap)',
      fileSystemDefault: 'APFS (Apple File System) with 64-bit inodes, copy-on-write snapshots, and container sharing',
      ioSubsystem: 'I/O Kit (Object-oriented C++ driver framework) + kqueue / EVFILT event notification',
      networkStack: 'BSD Network Stack with mbuf clusters, Network.framework, PF (Packet Filter)',
      securityModel: 'System Integrity Protection (SIP), Gatekeeper, App Sandbox, TCC (Transparency, Consent & Control)',
      shellEnvironment: 'Zsh (default since macOS Catalina), Bash 3.2, Fish'
    }
  }
];

// =========================================================================
// MOTHERBOARD & INTERNET CARD (NIC) HARDWARE SUBSYSTEMS
// =========================================================================

export const HARDWARE_COMPONENTS = [
  {
    id: 'hw-cpu',
    name: 'Multi-Core CPU & Execution Units',
    category: 'Processor',
    color: '#38bdf8',
    details: 'x86_64 / ARM64 execution cores. Houses Arithmetic Logic Units (ALU), Floating Point Units (FPU), General Purpose Registers (RAX, RBX, RCX, RDX, RSP, RIP), CR3 Page Directory Base Register, and Ring 0/Ring 3 privilege modes.'
  },
  {
    id: 'hw-cache',
    name: 'L1, L2 & L3 Cache Hierarchy',
    category: 'Cache Memory',
    color: '#06b6d4',
    details: 'Ultra-low latency SRAM on CPU die. L1 (~1ns latency, 64KB per core), L2 (~4ns latency, 1MB per core), L3 Unified Smart Cache (~12ns latency, shared across all CPU cores).'
  },
  {
    id: 'hw-ram',
    name: 'DDR5 System RAM & Memory Controller',
    category: 'Main Memory',
    color: '#10b981',
    details: 'Dual-channel DDR5 synchronous DRAM (~6400 MT/s). Managed by the integrated CPU Memory Controller (IMC) via physical address bus. Stores OS kernel text, user process virtual pages, page tables, and buffer caches.'
  },
  {
    id: 'hw-pcie',
    name: 'PCIe 5.0 Root Complex & High-Speed Bus',
    category: 'Interconnect Bus',
    color: '#818cf8',
    details: 'Peripheral Component Interconnect Express (PCIe Gen 5, up to 32 GT/s per lane). Connects CPU directly to discrete graphics, NVMe SSD storage, and the Gigabit/10G Internet Card (NIC).'
  },
  {
    id: 'hw-nic',
    name: 'Gigabit/10G Internet Card (NIC)',
    category: 'Network Hardware',
    color: '#a855f7',
    details: 'Network Interface Controller mounted on motherboard PCIe slot. Contains MAC Controller, Direct Memory Access (DMA) engine, RX/TX Ring Buffers in host RAM, Hardware Checksum Offload engines, and physical Ethernet PHY (RJ-45 / SFP+).'
  },
  {
    id: 'hw-apic',
    name: 'Advanced Programmable Interrupt Controller (APIC / MSI-X)',
    category: 'Interrupts',
    color: '#ec4899',
    details: 'Dispatches hardware interrupts (IRQ) to CPU cores. Uses Message Signaled Interrupts (MSI-X) enabling modern NICs to trigger dedicated interrupts directly into specific CPU cores for ultra-high throughput packet processing.'
  },
  {
    id: 'hw-storage',
    name: 'PCIe 4.0 NVMe SSD Storage Controller',
    category: 'Block Storage',
    color: '#f59e0b',
    details: 'Non-Volatile Memory Express solid-state storage. Directly communicates with kernel block I/O layer via submission/completion queue pairs over PCIe, providing up to 7,500 MB/s sequential read.'
  }
];

// =========================================================================
// REAL-WORLD SIMULATION SCENARIOS (DUAL FLOW: XYFLOW & DEFAULT FLOW)
// =========================================================================

export const OS_SIMULATION_SCENARIOS = [
  {
    id: 'sim-command-network',
    title: '1. Network Command: curl https://example.com (Shell -> Kernel -> Motherboard -> NIC)',
    category: 'Network & Command Execution',
    badge: 'Hardware Bus & Internet Card',
    description: 'Complete trace of issuing a network command in shell: parsing, fork()+exec(), syscall socket()/connect(), Ring 3 to Ring 0 context switch, kernel TCP/IP stack encapsulation, DMA to NIC ring buffer, and PCIe bus transmission out of the Internet Card.',
    steps: [
      {
        stepNum: 1,
        title: 'Shell Parse & User-Space Command Invocation',
        hardware: 'CPU Core 0 (Ring 3 User Mode) & L1 Cache',
        software: 'Bash / Zsh Shell Subsystem',
        action: 'User presses Enter on `curl https://example.com`. Shell reads standard input, parses tokens, resolves `/usr/bin/curl` from $PATH, and calls `fork()` + `execve()` system calls.',
        telemetry: { mode: 'Ring 3 (User)', syscall: 'execve()', registers: 'RAX=0x3B, RDI=0x7ffd01, RSI=0x7ffd10', bus: 'Internal CPU Pipeline', latency: '0.02 µs' },
        activeNodes: ['node-shell', 'node-cpu']
      },
      {
        stepNum: 2,
        title: 'Syscall Trap & Privilege Transition (Ring 3 -> Ring 0)',
        hardware: 'CPU Interrupt Descriptor Table (IDT) & APIC',
        software: 'Linux / Windows / macOS Kernel Trap Handler',
        action: 'CPU executes `syscall` instruction. Hardware switches CPU privilege from Ring 3 (User) to Ring 0 (Kernel). CPU saves user registers onto kernel stack and redirects Program Counter (RIP) to `entry_SYSCALL_64`.',
        telemetry: { mode: 'Ring 0 (Supervisor)', syscall: 'socket(AF_INET, SOCK_STREAM, 0)', registers: 'CR3 unchanged, CS=0x10 (Kernel Code)', bus: 'CPU Core Register Bank', latency: '0.05 µs' },
        activeNodes: ['node-cpu', 'node-kernel']
      },
      {
        stepNum: 3,
        title: 'Virtual Memory & Page Table Translation',
        hardware: 'CPU MMU (Memory Management Unit) & TLB',
        software: 'OS Virtual Memory Manager & Page Tables',
        action: 'Kernel looks up socket buffer memory in virtual space. MMU queries Translation Lookaside Buffer (TLB). On TLB hit, 48-bit virtual address translates instantaneously into 64-bit DDR5 physical RAM address via CR3 page tables.',
        telemetry: { mode: 'Ring 0 (Kernel)', mmu: 'TLB Hit (4KB Page)', virtAddr: '0x7fffde401000', physAddr: '0x000000014a801000', bus: 'CPU to IMC Bus', latency: '0.08 µs' },
        activeNodes: ['node-kernel', 'node-ram']
      },
      {
        stepNum: 4,
        title: 'Socket Buffers & Protocol Encapsulation (TCP/IP)',
        hardware: 'DDR5 Main Memory Controller (IMC)',
        software: 'Kernel Network Subsystem (sk_buff / TCP Stack)',
        action: 'Kernel allocates an `sk_buff` packet container in DDR5 RAM. TCP three-way handshake SYN is constructed. IP header (192.168.1.100 -> 93.184.216.34) and Ethernet header with default gateway MAC are prepended.',
        telemetry: { mode: 'Ring 0 (Kernel)', payload: 'TCP SYN (Seq=1001, Window=64240)', bufferSize: '1,514 bytes', bus: 'DDR5-6400 Channel A/B', latency: '0.35 µs' },
        activeNodes: ['node-kernel', 'node-ram']
      },
      {
        stepNum: 5,
        title: 'PCIe Direct Memory Access (DMA) Transfer to Internet Card',
        hardware: 'PCIe 5.0 Root Complex & Motherboard Traces',
        software: 'NIC Device Driver (e.g., e1000e / igc / ixgbe)',
        action: 'NIC driver writes physical RAM address descriptor to the NIC TX Ring Buffer. Motherboard PCIe bus triggers Bus Master Direct Memory Access (DMA). Packet data streams directly from DDR5 RAM across motherboard PCIe lanes into the Internet Card without burdening CPU.',
        telemetry: { mode: 'Hardware DMA', pcieLanes: 'PCIe Gen5 x4 (16 GB/s)', dmaChannel: 'Descriptor #12', bus: 'PCIe 5.0 Bus Matrix', latency: '0.22 µs' },
        activeNodes: ['node-ram', 'node-pcie', 'node-nic']
      },
      {
        stepNum: 6,
        title: 'Internet Card (NIC) Transmission onto Ethernet Wire',
        hardware: 'Gigabit/10G NIC MAC & Physical PHY Layer',
        software: 'NIC Firmware & Transceiver Controller',
        action: 'Internet Card computes 32-bit CRC Frame Check Sequence (FCS) in hardware. Physical Ethernet PHY modulates electrical/optical signals out the RJ-45 copper port or SFP+ fiber onto the local network switch.',
        telemetry: { mode: 'Physical Layer (L1)', linkSpeed: '10,000 Mbps Full-Duplex', fcs: '0x8f2c3d1e (Valid)', wire: 'Cat6A RJ45 Copper', latency: '0.12 µs' },
        activeNodes: ['node-nic']
      },
      {
        stepNum: 7,
        title: 'MSI-X Interrupt & Asynchronous Completion to Shell',
        hardware: 'APIC / MSI-X Interrupt Controller',
        software: 'NIC Interrupt Service Routine (ISR) & epoll/IOCP',
        action: 'Once packet transmits, NIC issues an MSI-X hardware interrupt on IRQ line. APIC interrupts CPU Core 2. Kernel executes ISR, cleans TX ring descriptor, wakes waiting curl process via `epoll_wait()`, and curl prints response to terminal stdout!',
        telemetry: { mode: 'Ring 0 -> Ring 3', irq: 'MSI-X Vector 48 on CPU Core 2', event: 'EPOLLOUT (Socket Connected)', bus: 'APIC Bus', latency: '0.40 µs' },
        activeNodes: ['node-nic', 'node-kernel', 'node-shell']
      }
    ]
  },
  {
    id: 'sim-process-fork-exec',
    title: '2. Process Creation: fork() + execve() Process Lifecycle',
    category: 'Process & CPU Scheduling',
    badge: 'PCB, CoW & Context Switch',
    description: 'Detailed execution of UNIX process creation: duplicating the parent Process Control Block (task_struct), Copy-on-Write (CoW) page sharing, binary ELF/PE loading, CPU scheduling, and context switching.',
    steps: [
      {
        stepNum: 1,
        title: 'Parent Invokes fork() / clone() System Call',
        hardware: 'CPU Core 1 (Ring 3 -> Ring 0)',
        software: 'Parent Process & Linux Kernel clone() Syscall',
        action: 'Parent process calls `fork()`. CPU enters kernel mode. Kernel allocates new `task_struct` (Linux) or `EPROCESS` (Windows) in kernel memory and assigns a unique PID.',
        telemetry: { syscall: 'clone(SIGCHLD)', newPID: '4289', ppid: '1024', state: 'TASK_UNINTERRUPTIBLE' },
        activeNodes: ['node-shell', 'node-kernel']
      },
      {
        stepNum: 2,
        title: 'Copy-On-Write (CoW) Virtual Memory Duplication',
        hardware: 'CPU MMU & Page Table Registers',
        software: 'Kernel Memory Manager (mm_struct)',
        action: 'Rather than copying entire gigabytes of RAM, kernel copies only the Page Table entries, marking all child pages as READ-ONLY. Physical RAM is shared until child writes to a page.',
        telemetry: { memorySaved: '98.5%', pageFlags: 'VM_READ | VM_SHARED', cowTriggered: 'False (Deferred until write)' },
        activeNodes: ['node-kernel', 'node-ram']
      },
      {
        stepNum: 3,
        title: 'execve() Binary Loader & ELF Header Parse',
        hardware: 'NVMe SSD Storage Controller & PCIe Bus',
        software: 'OS Binary Loader (do_execveat_common)',
        action: 'Child process calls `execve("/bin/ls")`. Kernel clears old address space, reads the ELF header from NVMe SSD, maps `.text` (code), `.data`, `.bss`, and sets up initial user stack with argv & envp.',
        telemetry: { binaryFormat: 'ELF 64-bit LSB executable', entryPoint: '0x401020', stackBase: '0x7ffd00000000' },
        activeNodes: ['node-storage', 'node-kernel', 'node-ram']
      },
      {
        stepNum: 4,
        title: 'CPU Scheduler (CFS) Assigns Timeslice',
        hardware: 'CPU Core Scheduling Engine',
        software: 'Completely Fair Scheduler (CFS)',
        action: 'CFS calculates child virtual runtime (`vruntime`). Child task is inserted into the CPU runqueue Red-Black tree. Scheduler preempts lower priority tasks to dispatch child process.',
        telemetry: { scheduler: 'SCHED_NORMAL (CFS)', nice: '0', priority: '120', vruntime: '14209582 ns' },
        activeNodes: ['node-kernel', 'node-cpu']
      },
      {
        stepNum: 5,
        title: 'Hardware Context Switch & User Mode Entry',
        hardware: 'CPU General Registers & CR3 Register',
        software: 'Kernel switch_to() Assembly Routine',
        action: 'CPU updates CR3 register with child page directory base address. Flushes non-global TLB entries. Restores child registers and jumps to user-space entry point (Ring 3). Process executes!',
        telemetry: { contextSwitchTime: '1.2 µs', cr3Value: '0x00000001b9204000', privilege: 'Ring 3 User Mode' },
        activeNodes: ['node-cpu', 'node-shell']
      }
    ]
  },
  {
    id: 'sim-virtual-memory-pagefault',
    title: '3. Virtual Memory & Paging: Page Fault (#PF Exception) Flow',
    category: 'Memory Management',
    badge: 'TLB, CR3 & Page Replacement',
    description: 'Hardware and OS steps when a thread accesses unmapped or swapped memory: CPU #PF trap, page table walk, page fault handler, allocating a physical frame, reading from swap/SSD, and updating the TLB.',
    steps: [
      {
        stepNum: 1,
        title: 'Virtual Memory Address Access & TLB Miss',
        hardware: 'CPU MMU & Instruction Execution Unit',
        software: 'User Process Accessing 0x00007f901a004000',
        action: 'CPU executes `mov (%rax), %rbx`. MMU queries L1/L2 TLB for virtual address tag `0x00007f901a004`. Tag is not present in cache: Hardware TLB Miss occurs.',
        telemetry: { event: 'TLB Miss', virtAddr: '0x00007f901a004000', tlbLookups: '2 cycles (0.8 ns)' },
        activeNodes: ['node-cpu']
      },
      {
        stepNum: 2,
        title: 'Hardware Page Table Walk (4-Level Paging)',
        hardware: 'CPU MMU Hardware Table Walker',
        software: 'x86_64 4-Level Paging (PML4 -> PDPT -> PD -> PT)',
        action: 'MMU reads CR3 to locate PML4 table in RAM. Steps through PML4 -> PDPT -> Page Directory -> Page Table. Reads Present bit: P=0. Hardware raises Interrupt Vector 14 (Page Fault #PF).',
        telemetry: { exception: 'Interrupt 14 (#PF)', cr2Register: '0x00007f901a004000 (Fault Address)', errorCode: '0x0004 (User read, page not present)' },
        activeNodes: ['node-cpu', 'node-ram']
      },
      {
        stepNum: 3,
        title: 'Kernel Page Fault Handler (do_page_fault)',
        hardware: 'CPU Core Interrupt Dispatcher',
        software: 'Kernel Memory Subsystem (handle_mm_fault)',
        action: 'Kernel intercepts #PF. Inspects process `vm_area_struct` memory maps. Verifies address is valid in heap/mmap space (not a segfault). Identifies page must be allocated or read from SSD swapfile.',
        telemetry: { faultType: 'Demand Paging / Minor Fault', vmaFlags: 'VM_READ | VM_WRITE', action: 'Allocate Physical Frame' },
        activeNodes: ['node-kernel']
      },
      {
        stepNum: 4,
        title: 'Buddy Allocator Assigns Physical 4KB Frame in RAM',
        hardware: 'DDR5 Main Memory Controller',
        software: 'Buddy Allocator & SLUB Subsystem',
        action: 'Kernel buddy allocator finds free 4KB physical page frame in NUMA Node 0. Zeroes out memory for security (`clear_page`). If page was swapped, triggers NVMe SSD read via DMA.',
        telemetry: { physFrame: '0x1c8000', pageSize: '4,096 bytes (4KB)', numaNode: '0' },
        activeNodes: ['node-kernel', 'node-ram']
      },
      {
        stepNum: 5,
        title: 'Page Table Entry Update & IRET Execution',
        hardware: 'CPU MMU & Instruction Pipeline',
        software: 'set_pte_at() & iret Instruction',
        action: 'Kernel writes physical address into Page Table, sets Present bit (P=1), Read/Write (R/W=1), and User (U=1). Executes `iret` (interrupt return). CPU retries the faulting instruction: access succeeds instantaneously!',
        telemetry: { pteFlags: 'Present | RW | User | Accessed', totalPenalty: '4.8 µs', status: 'Instruction Completed' },
        activeNodes: ['node-kernel', 'node-cpu']
      }
    ]
  },
  {
    id: 'sim-concurrency-deadlock',
    title: '4. Concurrency & Deadlocks: Mutex Synchronization & Banker\'s Algorithm',
    category: 'Concurrency & Deadlocks',
    badge: 'Semaphores, Mutex & Coffman Conditions',
    description: 'Interactive visualization of multithreaded synchronization, race conditions, atomic compare-and-swap (CAS), mutex lock acquisition via futex, and deadlock detection via Banker\'s Algorithm.',
    steps: [
      {
        stepNum: 1,
        title: 'Thread A & Thread B Compete for Shared Critical Section',
        hardware: 'Dual CPU Cores (Core 0 & Core 1)',
        software: 'POSIX pthreads / Windows Win32 Threads',
        action: 'Thread A on Core 0 and Thread B on Core 1 execute simultaneously, attempting to update a shared bank account balance in RAM. Without synchronization, a race condition causes data corruption.',
        telemetry: { balance: '$1,000', threadA_op: 'Withdraw $200', threadB_op: 'Deposit $300', state: 'Race Condition Hazard' },
        activeNodes: ['node-cpu', 'node-ram']
      },
      {
        stepNum: 2,
        title: 'Atomic Compare-And-Swap (CAS) Mutex Lock',
        hardware: 'CPU Cache Coherency (MESI Protocol)',
        software: 'pthread_mutex_lock() / futex',
        action: 'Thread A executes atomic `LOCK CMPXCHG` assembly instruction. Hardware locks memory bus / cache line. Thread A succeeds in setting mutex flag from 0 to 1 and enters critical section.',
        telemetry: { instruction: 'LOCK CMPXCHG', lockOwner: 'Thread A', mesiState: 'Modified (M)', status: 'Lock Acquired' },
        activeNodes: ['node-cpu', 'node-ram']
      },
      {
        stepNum: 3,
        title: 'Thread B Contention & Kernel Futex Wait Queue',
        hardware: 'APIC Timer & CPU Runqueue',
        software: 'Linux sys_futex() / Windows WaitForSingleObject()',
        action: 'Thread B attempts to acquire the locked mutex. CAS fails. Rather than burning 100% CPU spinning, Thread B calls `futex(FUTEX_WAIT)`. Kernel puts Thread B to sleep and context switches Core 1 to another task.',
        telemetry: { threadB_state: 'TASK_INTERRUPTIBLE (Sleeping)', futexQueue: 'Wait queue head', cpuUsage: '0% (Idle Sleep)' },
        activeNodes: ['node-kernel', 'node-cpu']
      },
      {
        stepNum: 4,
        title: 'Deadlock Circular Wait Check (Coffman Conditions)',
        hardware: 'Resource Allocation Graph Engine',
        software: 'OS Deadlock Detection & Banker\'s Algorithm',
        action: 'If Thread A holds Resource 1 and requests Resource 2, while Thread B holds Resource 2 and requests Resource 1, a Circular Wait occurs. Banker\'s Algorithm calculates if system remains in a Safe State.',
        telemetry: { mutualExclusion: 'True', holdAndWait: 'True', noPreemption: 'True', circularWait: 'Detected (Deadlock Alert)' },
        activeNodes: ['node-kernel']
      },
      {
        stepNum: 5,
        title: 'Thread A Unlocks & Kernel Wakes Thread B',
        hardware: 'CPU Inter-Processor Interrupt (IPI)',
        software: 'pthread_mutex_unlock() & futex(FUTEX_WAKE)',
        action: 'Thread A finishes balance update ($1,000 - $200 = $800), executes atomic unlock, and calls `futex(FUTEX_WAKE)`. Kernel sends IPI interrupt to wake Thread B. Thread B executes safely!',
        telemetry: { finalBalance: '$1,100 (Consistent)', wakeLat: '1.4 µs', safety: 'No Deadlock Occurred' },
        activeNodes: ['node-cpu', 'node-kernel', 'node-ram']
      }
    ]
  }
];

// =========================================================================
// OS TUTORIAL & CURRICULUM CHAPTERS (THE 14 CORE TOPICS + 3 OS BREAKDOWNS)
// =========================================================================

export const OS_TUTORIAL_CHAPTERS = [
  {
    id: 'chap-process-threads',
    title: '1. Processes & Threads: Architecture, States & PCB',
    subtitle: 'From Process Control Blocks (PCB) to User/Kernel Threads & Concurrency Models',
    badge: 'Core Primitive',
    color: '#38bdf8',
    summary: 'A Process is an executing instance of a program with isolated address space, while a Thread is the smallest unit of CPU scheduling sharing memory within a process.',
    sections: [
      {
        heading: 'Process Control Block (PCB / task_struct)',
        content: 'The operating system kernel tracks every process through a data structure called the Process Control Block (PCB). In Linux, this is `struct task_struct`, in Windows it is `EPROCESS` / `KPROCESS`, and in macOS it is `struct proc`.',
        keyPoints: [
          'PID (Process ID) & PPID (Parent Process ID)',
          'CPU Registers state (Instruction Pointer RIP, Stack Pointer RSP, General Registers)',
          'Process State: Running (R), Interruptible Sleep (S), Uninterruptible Disk Sleep (D), Zombie (Z), Stopped (T)',
          'Memory Management Info: Pointers to page directories (CR3 register) and virtual memory areas (mm_struct)',
          'Open File Descriptors table (stdin 0, stdout 1, stderr 2, sockets, pipes)',
          'Security Credentials: Real/Effective UID/GID, SELinux security context, Windows SIDs'
        ]
      },
      {
        heading: 'Processes vs Threads (Thread Control Block - TCB)',
        content: 'While processes are isolated by hardware page tables, threads within the same process share the heap, data, and code segments, but each thread possesses its own private stack, registers, and program counter.',
        table: {
          headers: ['Dimension', 'Process', 'Thread'],
          rows: [
            ['Memory Space', 'Separate isolated virtual address spaces (MMU enforced)', 'Shared address space (heap, global variables, code)'],
            ['Creation Cost', 'Heavyweight (copies page tables, file descriptors, VFS)', 'Lightweight (allocates stack & registers only)'],
            ['Context Switch Overhead', 'High (~1.5µs - flushes TLB, swaps CR3 register)', 'Low (~0.2µs - registers only, TLB remains valid)'],
            ['Inter-Communication', 'Requires IPC: Sockets, Pipes, Shared Memory, Message Queues', 'Direct memory reads/writes (requires synchronization: Mutex)']
          ]
        }
      }
    ]
  },
  {
    id: 'chap-cpu-scheduling',
    title: '2. CPU Scheduling: CFS, Multilevel Queues & Real-Time',
    subtitle: 'How OS kernels multiplex multiple threads across CPU cores with fairness and latency limits',
    badge: 'Performance Engine',
    color: '#10b981',
    summary: 'CPU Scheduling determines which thread in the Ready queue receives the next timeslice on a physical CPU core.',
    sections: [
      {
        heading: 'Scheduling Algorithms Comparison',
        content: 'Modern general-purpose operating systems employ sophisticated preemptive schedulers to balance interactive latency with batch throughput.',
        keyPoints: [
          'First-Come, First-Served (FCFS): Non-preemptive, susceptible to convoy effect.',
          'Shortest Job First (SJF) / Shortest Remaining Time First (SRTF): Mathematically optimal average wait time, but requires impossible future knowledge of CPU burst duration.',
          'Round Robin (RR): Preemptive with fixed quantum (e.g. 10-20ms). Highly interactive, prevents starvation.',
          'Completely Fair Scheduler (CFS - Linux): Models an ideal multi-tasking CPU using Red-Black Trees. Tracks `vruntime` (virtual runtime); task with lowest vruntime executes next.',
          'Windows Priority Scheduler: 32 priority levels (0-31). Dynamic priority boosting for GUI foreground window, I/O completions, and starvation avoidance.'
        ]
      }
    ]
  },
  {
    id: 'chap-memory-virtual',
    title: '3. Memory Management, Virtual Memory, Paging & Segmentation',
    subtitle: 'CR3 Register, Multi-Level Page Tables, TLB Cache, and Demand Paging',
    badge: 'Hardware Silicon',
    color: '#a855f7',
    summary: 'Virtual Memory creates the illusion that each process possesses a private, contiguous address space (up to 128TB on 64-bit systems) backed by physical RAM and SSD swap storage.',
    sections: [
      {
        heading: 'Paging vs Segmentation',
        content: 'Early systems used Segmentation (variable-sized logical units like code, data, stack). Modern x86_64 and ARM64 architectures use Flat-Paging with 4KB (or 2MB/1GB Huge Pages) fixed-size blocks.',
        keyPoints: [
          'Virtual Address -> Physical Address translation handled by CPU MMU (Memory Management Unit).',
          'Page Directory Base Register (CR3 in x86_64, TTBR0/1 in ARM64) points to top-level page table in physical RAM.',
          'x86_64 4-Level Paging: PML4 (Page Map Level 4) -> PDPT (Page Directory Pointer Table) -> PD (Page Directory) -> PT (Page Table).',
          'Translation Lookaside Buffer (TLB): High-speed hardware associative cache on CPU die caching recent virtual-to-physical address mappings (~0.5ns latency).'
        ]
      },
      {
        heading: 'Page Fault (#PF Exception Vector 14) Lifecycle',
        content: 'When an instruction accesses a virtual address whose Page Table entry has Present Bit = 0, the CPU triggers a Page Fault (#PF) interrupt, pausing the thread and delegating resolution to the OS kernel.',
        keyPoints: [
          'Minor Page Fault: The physical page is already in RAM (e.g. shared library or demand-zero page), kernel simply maps the PTE.',
          'Major Page Fault: The page was evicted to SSD swap/pagefile. Kernel initiates disk DMA read, suspends process, and resumes when loaded.',
          'Invalid Fault (Segmentation Fault / Access Violation): Virtual address is outside allocated VMAs. Kernel dispatches SIGSEGV to terminate process.'
        ]
      }
    ]
  },
  {
    id: 'chap-concurrency-sync',
    title: '4. Concurrency, Synchronization, Semaphores & Monitors',
    subtitle: 'Atomic Operations, Race Conditions, Mutex, Futex, Condition Variables & Monitors',
    badge: 'Thread Safety',
    color: '#ec4899',
    summary: 'When multiple threads execute concurrently on multi-core processors, access to shared memory must be serialized to prevent race conditions and data corruption.',
    sections: [
      {
        heading: 'Synchronization Primitives',
        content: 'From hardware atomic instructions to high-level language constructs:',
        keyPoints: [
          'Atomic Test-and-Set / Compare-And-Swap (CAS): Hardware primitives locking the cache line (MESI coherency) to update values atomically.',
          'Spinlock: Busy-waits in a tight loop. Extremely fast for microsecond locks in kernel ISRs, but wastes CPU in user space.',
          'Mutex (Mutual Exclusion): Binary lock. If locked, calling thread yields CPU and sleeps in kernel wait queue.',
          'Counting Semaphore: Integer counter initialized to N. `wait()` (P) decrements; if < 0, thread sleeps. `signal()` (V) increments and wakes sleeping thread.',
          'Monitor: High-level language encapsulation (Java `synchronized`, C# `lock`) providing mutual exclusion plus condition variables (`wait()`, `notifyAll()`).'
        ]
      }
    ]
  },
  {
    id: 'chap-deadlocks',
    title: '5. Deadlocks: The 4 Coffman Conditions & Banker\'s Algorithm',
    subtitle: 'Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait & Prevention Strategies',
    badge: 'System Reliability',
    color: '#f59e0b',
    summary: 'A Deadlock is a state where a set of processes are permanently blocked because each process holds a resource and waits for another resource held by another process in the set.',
    sections: [
      {
        heading: 'The 4 Necessary Coffman Conditions',
        content: 'A deadlock can occur IF AND ONLY IF all four conditions hold simultaneously:',
        keyPoints: [
          '1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.',
          '2. Hold and Wait: A process must be concurrently holding at least one resource and requesting additional resources.',
          '3. No Preemption: Resources cannot be forcibly seized from a process; they can only be released voluntarily.',
          '4. Circular Wait: A closed loop chain of processes {P0, P1, ..., Pn} exists such that P0 waits for resource held by P1, and Pn waits for resource held by P0.'
        ]
      },
      {
        heading: 'Deadlock Handling Strategies',
        content: 'How modern operating systems mitigate deadlocks:',
        keyPoints: [
          'Ostrich Algorithm: Stick your head in the sand and ignore deadlocks if they are rare (used by most general-purpose OSs!).',
          'Deadlock Prevention: Break one of the 4 Coffman conditions (e.g. enforce strict global acquisition ordering to eliminate circular wait).',
          'Deadlock Avoidance (Banker\'s Algorithm): Dynamically inspect every resource allocation to verify the system never leaves a Safe State.',
          'Detection and Recovery: Maintain a Resource Allocation Graph (RAG), periodically run cycle detection (Tarjan/DFS), and kill or roll back deadlocked processes.'
        ]
      }
    ]
  },
  {
    id: 'chap-file-systems',
    title: '6. File System Architecture & I/O Management',
    subtitle: 'VFS, Inodes vs MFT, Journaling, Block Allocation, DMA & Interrupt Handling',
    badge: 'Persistent Storage',
    color: '#06b6d4',
    summary: 'File systems organize raw storage sectors into logical hierarchical directories, files, and metadata with crash consistency guarantees.',
    sections: [
      {
        heading: 'Virtual File System (VFS) Layer',
        content: 'The OS kernel provides a uniform abstraction layer (VFS in Linux/macOS) so user-space programs call `open()`, `read()`, `write()` identically whether the storage is local ext4, NTFS, APFS, NFS, or /proc virtual pseudo-filesystem.',
        keyPoints: [
          'Superblock: Filesystem metadata, block size, total inodes, free blocks.',
          'Inode (Index Node): Represents a file/directory. Contains file size, owner UID/GID, permissions, timestamps, and pointers to data blocks (does NOT store the filename!).',
          'Dentry (Directory Entry): Caches file names and maps them to their respective inode numbers.',
          'File Object: Represents an open file instance created by `open()`, tracking file pointer offset and open flags.'
        ]
      }
    ]
  },
  {
    id: 'chap-os-triad',
    title: '7. OS Architecture Comparison: Linux vs Windows vs macOS',
    subtitle: 'Monolithic vs Hybrid vs Mach Microkernel, Driver Frameworks & System Call ABIs',
    badge: 'Kernel Deep Dive',
    color: '#6366f1',
    summary: 'Comprehensive architectural breakdown comparing the three dominant modern operating system kernels.',
    sections: [
      {
        heading: 'Kernel Architectures Compared',
        content: 'Understanding the low-level architectural divergence between Linux, Windows NT, and Apple macOS XNU.',
        table: {
          headers: ['Feature', 'Linux (GNU/Linux)', 'Windows (NT Kernel)', 'macOS (Darwin XNU)'],
          rows: [
            ['Kernel Design', 'Monolithic with Loadable Kernel Modules', 'Hybrid Microkernel-derived (Executive + HAL)', 'Hybrid: Mach 3.0 microkernel + BSD POSIX'],
            ['Syscall Dispatch', 'syscall / sysenter -> entry_SYSCALL_64', 'KiSystemCall64 -> SSDT (System Service Dispatch)', 'Mach traps (mach_msg) + BSD sysent table'],
            ['I/O Framework', 'io_uring / epoll / VFS', 'I/O Completion Ports (IOCP) / IRPs', 'I/O Kit (C++) / kqueue / GCD'],
            ['Default File System', 'ext4 / Btrfs / XFS', 'NTFS / ReFS', 'APFS (Apple File System)'],
            ['Packet Filter', 'Netfilter (iptables/nftables) & eBPF XDP', 'Windows Filtering Platform (WFP) / NDIS', 'PF (Packet Filter) & Network.framework'],
            ['Security Architecture', 'DAC + SELinux / AppArmor + Capabilities', 'DACLs + SACLs + SIDs + BitLocker', 'SIP (Rootless) + Gatekeeper + Sandbox'],
            ['Default Shell', 'Bash / Zsh', 'PowerShell 7+ / cmd.exe', 'Zsh (zsh)']
          ]
        }
      }
    ]
  }
];
