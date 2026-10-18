import React, { useState } from 'react';
import {
  Terminal,
  Network,
  Activity,
  FolderTree,
  ChevronRight,
  Copy,
  Check,
  Command
} from 'lucide-react';

import { OS_FLAVORS } from '../../data/osData';

export default function OSKernelExplorer({ activeOS = 'linux', setActiveOS }) {
  const [selectedSubsystem, setSelectedSubsystem] = useState('kernel');
  const [selectedTopicId, setSelectedTopicId] = useState('syscalls');
  const [copiedId, setCopiedId] = useState(null);

  const currentOSData = OS_FLAVORS.find(o => o.id === activeOS) || OS_FLAVORS[0];

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Structured breakdown for Linux, Windows, macOS across the 9 required categories
  const osModules = {
    linux: {
      kernel: {
        title: '2.1.1 Linux Kernel Architecture',
        topics: [
          {
            id: 'syscalls',
            num: '2.1.1.1',
            title: 'System Calls (ABI & Entry)',
            desc: 'The binary interface between user space and kernel space. Uses the `syscall` instruction (x86_64) which traps via Interrupt Descriptor Table into `entry_SYSCALL_64`. Reads syscall number from RAX (e.g., 0=read, 1=write, 2=open, 56=clone, 59=execve).',
            cli: 'strace -c -f -p $(pgrep nginx)',
            internals: 'arch/x86/entry/entry_64.S -> do_syscall_64() -> sys_call_table[RAX]'
          },
          {
            id: 'process',
            num: '2.1.1.2',
            title: 'Process Management & CFS',
            desc: 'Represented by `struct task_struct` in `<linux/sched.h>`. Scheduled by the Completely Fair Scheduler (CFS) using Red-Black trees ordered by `vruntime`. Supports POSIX threads through the `clone()` system call with shared `CLONE_VM` flags.',
            cli: 'ps -eo pid,ppid,comm,vsize,rss,cls,pri,rtprio',
            internals: 'kernel/sched/fair.c -> pick_next_task_fair() -> context_switch()'
          },
          {
            id: 'memory',
            num: '2.1.1.3',
            title: 'Memory Management (Buddy & SLUB)',
            desc: 'Manages physical pages using the Buddy Allocator (orders 0 to 10 for power-of-two 4KB page blocks). Small objects allocated via SLUB cache (`kmem_cache`). Virtual memory mapped via 4-level or 5-level page tables with page fault demand-zero allocation.',
            cli: 'cat /proc/meminfo | grep -E "MemTotal|Active|Dirty|Slab|PageTables"',
            internals: 'mm/page_alloc.c -> alloc_pages() & mm/slub.c -> kmem_cache_alloc()'
          },
          {
            id: 'filesystem',
            num: '2.1.1.4',
            title: 'File System Management & VFS',
            desc: 'The Virtual File System (VFS) abstracts all storage. Key objects: `super_block` (filesystem metadata), `inode` (file metadata and block addresses), `dentry` (directory name-to-inode cache), and `file` (open file descriptor offset). Default filesystems: ext4, Btrfs, XFS.',
            cli: 'df -Th && lsblk -f',
            internals: 'fs/vfs.c -> vfs_read() -> file->f_op->read_iter()'
          },
          {
            id: 'io',
            num: '2.1.1.5',
            title: 'I/O Management (io_uring & epoll)',
            desc: 'Provides high-throughput asynchronous block & network I/O. `io_uring` uses dual memory-mapped ring buffers (Submission Queue & Completion Queue) enabling zero-syscall asynchronous operations. `epoll` provides O(1) event notification for scalable servers.',
            cli: 'iostat -xz 1 5',
            internals: 'io_uring/io_uring.c & fs/eventpoll.c'
          },
          {
            id: 'network',
            num: '2.1.1.6',
            title: 'Network Management (sk_buff & Netfilter)',
            desc: 'Kernel packet representation via `struct sk_buff` (socket buffer). Packets traverse Netfilter hooks (PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING) handled by nftables/iptables. High-speed packet processing accelerated via eBPF XDP (eXpress Data Path).',
            cli: 'ip -s link show && ss -tulpn',
            internals: 'net/core/skbuff.c & net/netfilter/core.c'
          },
          {
            id: 'security',
            num: '2.1.1.7',
            title: 'Security Management (SELinux & Capabilities)',
            desc: 'Enforces Discretionary Access Control (DAC: owner, group, other permissions) plus Mandatory Access Control (MAC: SELinux type enforcement, AppArmor profiles). Drops root privileges using Linux Capabilities (`cap_net_bind_service`, `cap_sys_admin`).',
            cli: 'sestatus && getcap /usr/bin/ping',
            internals: 'security/selinux/hooks.c & kernel/capability.c'
          },
          {
            id: 'features',
            num: '2.1.1.8',
            title: 'Other Features: Namespaces & cgroups v2',
            desc: 'The fundamental primitives underpinning containerization (Docker, Kubernetes). Namespaces isolate system resources (PID, Mount, Net, IPC, UTS, User, Cgroup). Control Groups (cgroups v2) enforce resource limits on CPU, Memory, I/O, and Process IDs.',
            cli: 'lsns && cat /sys/fs/cgroup/cgroup.controllers',
            internals: 'kernel/cgroup/cgroup.c & kernel/nsproxy.c'
          }
        ]
      },
      shell: {
        title: '2.1.2 Linux Shell Environments',
        topics: [
          { id: 'bash', num: '2.1.2.1', title: 'Bash (Bourne Again Shell)', desc: 'Standard default GNU shell. Supports shell expansions, programmable tab completion, arrays, process substitution `<(command)`, and `.bashrc` profile customization.', cli: 'bash --version && echo $BASH_VERSION' },
          { id: 'zsh', num: '2.1.2.2', title: 'Zsh (Z Shell)', desc: 'Advanced interactive shell with rich auto-correction, path expansion (`cd /u/l/b` -> `/usr/local/bin`), floating prompt engines, and Oh-My-Zsh plugin ecosystems.', cli: 'zsh --version' },
          { id: 'fish', num: '2.1.2.3', title: 'Fish (Friendly Interactive Shell)', desc: 'Modern user-centric shell offering auto-suggestions based on history, syntax highlighting as you type, and web-based configuration out of the box without complex scripting.', cli: 'fish --version' },
          { id: 'other-shells', num: '2.1.2.4', title: 'Other Shells (sh, ksh, dash)', desc: 'Lightweight POSIX-compliant shells. Debian/Ubuntu uses `dash` as `/bin/sh` for high-speed system startup scripts with minimal memory footprint.', cli: 'ls -l /bin/sh' }
        ]
      },
      tools: {
        title: '2.1.3 System Tools & Diagnostics',
        topics: [
          { id: 'perf', num: '2.1.3.1', title: 'perf & eBPF bpftrace', desc: 'Hardware performance counters (instructions per cycle, cache misses) and dynamic kernel tracing.', cli: 'perf top --sort comm,dso' },
          { id: 'strace', num: '2.1.3.2', title: 'strace (System Call Tracer)', desc: 'Attaches to running processes via `ptrace` to intercept and print all syscalls and signals.', cli: 'strace -tt -e trace=network,file ls -l' },
          { id: 'lsof', num: '2.1.3.3', title: 'lsof & fuser (File Inspection)', desc: 'Lists all open files, sockets, pipes, and devices held by processes.', cli: 'lsof -i :80 -i :443' }
        ]
      }
    },
    windows: {
      kernel: {
        title: '2.2.1 Windows NT Kernel Architecture (ntoskrnl.exe)',
        topics: [
          {
            id: 'syscalls',
            num: '2.2.1.1',
            title: 'System Calls (SSDT & KiSystemCall64)',
            desc: 'Windows user-mode calls Win32 API functions (`kernel32.dll` -> `ntdll.dll`). ntdll issues `syscall` instruction with index in EAX. Kernel dispatches via the System Service Dispatch Table (SSDT) through `KiSystemCall64`.',
            cli: 'Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, BuildNumber',
            internals: 'ntdll!NtCreateFile -> KiSystemCall64 -> nt!NtCreateFile'
          },
          {
            id: 'process',
            num: '2.2.1.2',
            title: 'Process Management (EPROCESS & Threads)',
            desc: 'Processes represented by executive `EPROCESS` block and microkernel `KPROCESS`. Threads represented by `ETHREAD`. Scheduled across 32 priority levels with dynamic priority boosting on I/O completions and active GUI focus.',
            cli: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10',
            internals: 'nt!PspCreateProcess -> nt!KeInsertQueueApc'
          },
          {
            id: 'memory',
            num: '2.2.1.3',
            title: 'Memory Management (NT VMM & Working Sets)',
            desc: 'NT Virtual Memory Manager allocates virtual address descriptors (VAD). Divides memory into Working Sets, Paged Pool (can be swapped to `pagefile.sys`), and Non-Paged Pool (guaranteed physical RAM residency for drivers).',
            cli: 'Get-Counter -Counter "\\Memory\\Available MBytes", "\\Memory\\Page Faults/sec"',
            internals: 'nt!MiAllocateVirtualMemory & nt!MmAccessFault'
          },
          {
            id: 'filesystem',
            num: '2.2.1.4',
            title: 'File System Management (NTFS & ReFS)',
            desc: 'NTFS relies on the Master File Table (MFT) where every file is an MFT record with attributes ($DATA, $INDEX_ALLOCATION). Uses USN (Update Sequence Number) change journal and transactional logging for crash resilience.',
            cli: 'fsutil fsinfo volumeinfo C:',
            internals: 'ntfs.sys -> FltMgr.sys (Filter Manager)'
          },
          {
            id: 'io',
            num: '2.2.1.5',
            title: 'I/O Management (I/O Completion Ports - IOCP)',
            desc: 'Asynchronous I/O packets called IRPs (I/O Request Packets) are queued to hardware drivers. High-scale servers use I/O Completion Ports (IOCP) to achieve thread-pool concurrency with minimal context switching.',
            cli: 'Get-WmiObject Win32_DiskDrive | Select-Object DeviceID, Model, InterfaceType',
            internals: 'nt!IoAllocateIrp -> nt!IoCallDriver -> nt!NtCreateIoCompletion'
          },
          {
            id: 'network',
            num: '2.2.1.6',
            title: 'Network Management (NDIS & WFP)',
            desc: 'Network Driver Interface Specification (NDIS) abstracts physical NICs. Windows Filtering Platform (WFP) inspects and filters network traffic at socket, transport, and IP levels (used by Windows Defender Firewall).',
            cli: 'Get-NetAdapter | Format-Table -AutoSize && Get-NetTCPConnection',
            internals: 'ndis.sys & tcpip.sys & fwpkclnt.sys'
          },
          {
            id: 'security',
            num: '2.2.1.7',
            title: 'Security Management (SIDs, ACLs & BitLocker)',
            desc: 'Objects secured via Security Descriptors containing Owner SID and Discretionary Access Control Lists (DACL). Enforces Virtualization-Based Security (VBS), Credential Guard, and full disk encryption via BitLocker TPM.',
            cli: 'icacls "C:\\Windows\\System32"',
            internals: 'nt!SeAccessCheck & cng.sys (Cryptography Next Gen)'
          }
        ]
      },
      shell: {
        title: '2.2.2 Windows Shell & Command Environments',
        topics: [
          { id: 'powershell', num: '2.2.2.1', title: 'PowerShell 7+ (Core & Desktop)', desc: 'Object-oriented command-line shell and scripting language built on .NET. Pipes structured objects rather than plain text streams.', cli: '$PSVersionTable' },
          { id: 'cmd', num: '2.2.2.2', title: 'Windows Command Prompt (cmd.exe)', desc: 'Legacy command interpreter compatible with MS-DOS batch scripts and vintage enterprise tooling.', cli: 'cmd /c ver' },
          { id: 'wsl-bash', num: '2.2.2.3', title: 'WSL2 Bash (Linux Subsystem on NT)', desc: 'Runs full Linux ELF64 binaries on Hyper-V virtualized Linux kernel side-by-side with Windows NT.', cli: 'wsl --status' }
        ]
      },
      tools: {
        title: '2.2.3 Windows System Tools & Sysinternals',
        topics: [
          { id: 'procmon', num: '2.2.3.1', title: 'Process Monitor (ProcMon)', desc: 'Real-time filesystem, registry, and process/thread activity monitor using kernel minifilter drivers.', cli: 'Get-Process -Name svchost | Select-Object Id, Handles, Threads' },
          { id: 'eventvwr', num: '2.2.3.2', title: 'Windows Event Viewer', desc: 'Centralized diagnostic logging engine for System, Application, and Security audit logs.', cli: 'Get-WinEvent -LogName System -MaxEvents 5' }
        ]
      }
    },
    macos: {
      kernel: {
        title: '2.3.1 Apple macOS XNU Kernel Architecture',
        topics: [
          {
            id: 'syscalls',
            num: '2.3.1.1',
            title: 'System Calls (Mach Traps & BSD Syscalls)',
            desc: 'Dual-persona kernel: Mach microkernel traps (`mach_msg()` for IPC and hardware threads) + BSD POSIX system call table (`sysent[]` providing standard POSIX file, socket, and process APIs).',
            cli: 'sw_vers && uname -a',
            internals: 'osfmk/mach/mach_traps.h & bsd/kern/syscalls.master'
          },
          {
            id: 'process',
            num: '2.3.1.2',
            title: 'Process Management (Mach Threads & QoS)',
            desc: 'Processes (`struct proc`) hold Mach tasks. Threads scheduled according to Quality of Service (QoS) classes: User Interactive, User Initiated, Default, Utility, and Background.',
            cli: 'ps -Arc -o pid,command,%cpu,time | head -n 10',
            internals: 'osfmk/kern/sched_prim.c -> thread_select()'
          },
          {
            id: 'memory',
            num: '2.3.1.3',
            title: 'Memory Management (Mach VM & Compressor)',
            desc: 'Unified memory architecture on Apple Silicon. Mach VM uses an in-memory Page Compressor to compress inactive pages in RAM with negligible latency before writing to SSD swap.',
            cli: 'vm_stat && memory_pressure',
            internals: 'osfmk/vm/vm_pageout.c -> vm_compressor'
          },
          {
            id: 'filesystem',
            num: '2.3.1.4',
            title: 'File System Management (APFS)',
            desc: 'Apple File System (APFS) optimized for flash/SSD storage. Features 64-bit inode numbers, container-level space sharing across volumes, copy-on-write crash-safe cloning, and snapshot capability.',
            cli: 'diskutil apfs list',
            internals: 'apfs.kext -> b-tree volume catalog'
          },
          {
            id: 'io',
            num: '2.3.1.5',
            title: 'I/O Management (I/O Kit & kqueue)',
            desc: 'Object-oriented C++ driver framework (I/O Kit) providing dynamic power management and device matching. User-space scalable event loop powered by `kqueue` and Grand Central Dispatch (GCD).',
            cli: 'ioreg -l | head -n 25',
            internals: 'iokit/IOKit/IOService.h & bsd/kern/kern_event.c'
          },
          {
            id: 'network',
            num: '2.3.1.6',
            title: 'Network Management (BSD Stack & Network.framework)',
            desc: 'BSD networking stack using `mbuf` memory buffers. Traffic filtered using OpenBSD Packet Filter (PF). High-level app networking accelerated via Network.framework and NSURLSession.',
            cli: 'netstat -nr && ifconfig en0',
            internals: 'bsd/net/pf.c & bsd/kern/uipc_mbuf.c'
          },
          {
            id: 'security',
            num: '2.3.1.7',
            title: 'Security Management (SIP, Gatekeeper & Sandbox)',
            desc: 'System Integrity Protection (SIP) locks `/System` and `/bin` from root modification. Gatekeeper validates Apple code signatures & notarization. TCC protects microphone, camera, and disk access.',
            cli: 'csrutil status && spctl --status',
            internals: 'bsd/kern/kern_tcc.c & security/sandbox.kext'
          },
          {
            id: 'features',
            num: '2.3.1.8',
            title: 'Other Features: Rosetta 2 & Apple Silicon Metal',
            desc: 'Rosetta 2 provides ahead-of-time (AOT) and JIT translation of x86_64 instructions into ARM64 instructions with hardware memory order emulation (TSO mode). Metal provides direct GPU hardware compute.',
            cli: 'arch -x86_64 uname -m',
            internals: 'Apple Silicon Hardware TSO (Total Store Ordering) toggle'
          }
        ]
      },
      shell: {
        title: '2.3.2 macOS Shell & Terminal Subsystem',
        topics: [
          { id: 'macos-zsh', num: '2.3.2.1', title: 'Zsh (Default macOS Shell)', desc: 'Default login shell since macOS Catalina (10.15). Configured via `~/.zshrc`. Supports zsh completion and Homebrew paths.', cli: 'echo $SHELL' },
          { id: 'macos-bash', num: '2.3.2.2', title: 'Bash 3.2 (Legacy GPLv2)', desc: 'Retained at `/bin/bash` for backwards compatibility with legacy shell scripts.', cli: '/bin/bash --version' },
          { id: 'macos-fish', num: '2.3.2.3', title: 'Fish & Custom Terminals', desc: 'Installed via Homebrew (`brew install fish`). Often paired with iTerm2 or Alacritty with GPU acceleration.', cli: 'which fish' }
        ]
      },
      tools: {
        title: '2.3.3 macOS System Tools & DTrace',
        topics: [
          { id: 'dtrace', num: '2.3.3.1', title: 'DTrace & fs_usage', desc: 'Dynamic tracing framework developed by Sun and integrated into XNU. `fs_usage` traces live filesystem calls.', cli: 'sudo fs_usage -w -f filesys' },
          { id: 'activitymon', num: '2.3.3.2', title: 'Activity Monitor & top', desc: 'Visual process monitor showing real-time CPU energy impact, unified memory compression, and GPU usage.', cli: 'top -o cpu' }
        ]
      }
    }
  };

  const currentModule = osModules[activeOS]?.[selectedSubsystem] || osModules.linux.kernel;
  const currentTopic = currentModule.topics.find(t => t.id === selectedTopicId) || currentModule.topics[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* OS Flavor Switcher Pills */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FolderTree size={20} color="#c084fc" />
          <div>
            <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#ffffff' }}>
              Operating System Subsystem Explorer
            </span>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Deep technical inspection of Kernel, Shell, Memory, Filesystem & Security
            </div>
          </div>
        </div>

        {/* 3 OS Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '10px' }}>
          {OS_FLAVORS.map((os) => {
            const isSel = os.id === activeOS;
            return (
              <button
                key={os.id}
                onClick={() => {
                  if (setActiveOS) setActiveOS(os.id);
                  setSelectedSubsystem('kernel');
                  setSelectedTopicId('syscalls');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isSel ? '700' : '500',
                  color: isSel ? '#ffffff' : 'var(--text-muted)',
                  background: isSel ? os.accentGradient : 'transparent',
                  border: isSel ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{os.name.split(' ')[0]}</span>
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: isSel ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)',
                  color: isSel ? '#ffffff' : os.color
                }}>
                  {os.id.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Explorer Grid: Left Tree Navigation, Right Content View */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) minmax(440px, 2.2fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Subsystem & Topic Hierarchy Tree */}
        <div className="glass-panel" style={{
          padding: '18px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Subsystem Category Selector: Kernel, Shell, System Tools */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => {
                setSelectedSubsystem('kernel');
                setSelectedTopicId('syscalls');
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '0.76rem',
                fontWeight: selectedSubsystem === 'kernel' ? '700' : '500',
                borderRadius: '6px',
                border: 'none',
                background: selectedSubsystem === 'kernel' ? 'rgba(168, 85, 247, 0.3)' : 'transparent',
                color: selectedSubsystem === 'kernel' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Kernel Core
            </button>
            <button
              onClick={() => {
                setSelectedSubsystem('shell');
                setSelectedTopicId(activeOS === 'windows' ? 'powershell' : (activeOS === 'macos' ? 'macos-zsh' : 'bash'));
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '0.76rem',
                fontWeight: selectedSubsystem === 'shell' ? '700' : '500',
                borderRadius: '6px',
                border: 'none',
                background: selectedSubsystem === 'shell' ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
                color: selectedSubsystem === 'shell' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Shells
            </button>
            <button
              onClick={() => {
                setSelectedSubsystem('tools');
                setSelectedTopicId(activeOS === 'windows' ? 'procmon' : (activeOS === 'macos' ? 'dtrace' : 'perf'));
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '0.76rem',
                fontWeight: selectedSubsystem === 'tools' ? '700' : '500',
                borderRadius: '6px',
                border: 'none',
                background: selectedSubsystem === 'tools' ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                color: selectedSubsystem === 'tools' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Tools
            </button>
          </div>

          <div style={{ fontSize: '0.74rem', fontWeight: '800', color: currentOSData.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {currentModule.title}
          </div>

          {/* Topics List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {currentModule.topics.map((t) => {
              const isSel = t.id === selectedTopicId;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: isSel ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSel ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.05)',
                    color: isSel ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: isSel ? '#c084fc' : 'var(--text-dim)', fontWeight: '700' }}>
                      {t.num}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: isSel ? '700' : '400' }}>
                      {t.title}
                    </span>
                  </div>
                  <ChevronRight size={14} color={isSel ? '#c084fc' : 'var(--text-dim)'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Topic Technical View */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.3) 0%, rgba(15, 23, 42, 0.95) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: currentOSData.color, fontWeight: '800' }}>
                Section {currentTopic.num} • {activeOS.toUpperCase()}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', margin: '4px 0 0 0' }}>
                {currentTopic.title}
              </h2>
            </div>
            <span className="badge" style={{ background: `${currentOSData.color}25`, color: currentOSData.color, border: `1px solid ${currentOSData.color}50` }}>
              {currentOSData.kernelName.split(' ')[0]} {currentOSData.kernelName.split(' ')[1]}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: '1.65', margin: 0 }}>
            {currentTopic.desc}
          </p>

          {/* Kernel Source Internals Location */}
          {currentTopic.internals && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                Underlying Kernel Subsystem Implementation
              </span>
              <code style={{ fontSize: '0.8rem', color: '#a7f3d0', fontFamily: 'monospace' }}>
                {currentTopic.internals}
              </code>
            </div>
          )}

          {/* Real-World CLI Command */}
          {currentTopic.cli && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#090d16',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto' }}>
                <Terminal size={16} color="#38bdf8" />
                <code style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.84rem', fontWeight: '600' }}>
                  $ {currentTopic.cli}
                </code>
              </div>
              <button
                onClick={() => copyCode(currentTopic.cli, currentTopic.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: copiedId === currentTopic.id ? '#34d399' : '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.74rem'
                }}
              >
                {copiedId === currentTopic.id ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedId === currentTopic.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          {/* OS Architecture Snapshot Card */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Syscall Interface</div>
              <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: '600' }}>{currentOSData.architecture.syscallInterface}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Process Scheduler</div>
              <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: '600' }}>{currentOSData.architecture.processScheduler.split('(')[0]}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Memory Management</div>
              <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: '600' }}>{currentOSData.architecture.memoryManager.split('+')[0]}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Default File System</div>
              <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: '600' }}>{currentOSData.architecture.fileSystemDefault.split('via')[0]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
