import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  Search,
  ChevronDown,
  ChevronUp,
  Lock,
  Globe,
  Server,
  Database,
  Terminal,
  Mail,
  Network,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Radio,
  Zap,
  ArrowRight,
  Info,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// ─── Complete Protocol / Port Reference Data ─────────────────────────────────
const PORT_PROTOCOLS = [
  // ━━━━━━━━━━━━ TRANSPORT LAYER PROTOCOLS ━━━━━━━━━━━━
  {
    id: 'tcp',
    name: 'TCP',
    fullName: 'Transmission Control Protocol',
    category: 'Transport',
    portRange: '0 – 65535',
    protocol: 'TCP (6)',
    description: 'Connection-oriented transport protocol. Provides reliable, ordered, error-checked delivery of a stream of bytes between applications. Requires a 3-way handshake (SYN → SYN-ACK → ACK) before data transfer.',
    howItWorks: 'TCP segments data into packets, assigns sequence numbers, and retransmits lost segments. Flow control via sliding window and congestion control (CUBIC/BBR) prevent network overload. FIN/RST terminates sessions.',
    useCases: ['Web servers (HTTP/HTTPS)', 'Database connections', 'File transfers', 'Email', 'SSH sessions'],
    securityNote: 'Opening all TCP ports (0-65535) is extremely dangerous. Always restrict to specific required ports.',
    color: '#10b981',
    icon: 'Network'
  },
  {
    id: 'custom-tcp',
    name: 'Custom Protocol',
    fullName: 'Custom TCP Protocol Rule',
    category: 'Transport',
    portRange: 'User-defined',
    protocol: 'TCP (6)',
    description: 'Allows defining a custom TCP port rule for any non-standard application. Used when your service listens on a specific non-well-known TCP port.',
    howItWorks: 'The operating system TCP stack handles connection management identically to standard TCP. The only difference is the destination port number is user-specified for a proprietary or custom application.',
    useCases: ['Custom microservices', 'Game servers', 'Internal APIs on non-standard ports', 'Development/staging environments'],
    securityNote: 'Document all custom ports. Use security groups to restrict source IPs.',
    color: '#64748b',
    icon: 'Terminal'
  },
  {
    id: 'all-tcp',
    name: 'All TCP',
    fullName: 'All TCP Ports (0 – 65535)',
    category: 'Transport',
    portRange: '0 – 65535',
    protocol: 'TCP (6)',
    description: 'Opens every TCP port on the target instance. This grants access to all possible TCP services — HTTP, SSH, databases, and any other TCP listener.',
    howItWorks: 'The firewall/security group rule matches ANY TCP segment regardless of destination port. Every TCP service on the host becomes reachable from the allowed source.',
    useCases: ['Full internal VPC trust (not recommended for production)', 'Debugging/testing in isolated environments'],
    securityNote: '⚠️ HIGH RISK — Never expose All TCP to 0.0.0.0/0. Use only within private subnets with strict source CIDR restrictions.',
    color: '#ef4444',
    icon: 'AlertTriangle'
  },
  {
    id: 'all-udp',
    name: 'All UDP',
    fullName: 'All UDP Ports (0 – 65535)',
    category: 'Transport',
    portRange: '0 – 65535',
    protocol: 'UDP (17)',
    description: 'Opens every UDP port. UDP is connectionless — no handshake, no guaranteed delivery. Used for time-sensitive applications like streaming, DNS, and VPNs.',
    howItWorks: 'The security group allows ANY inbound UDP datagram regardless of destination port. Unlike TCP, there is no connection state; each datagram is independent.',
    useCases: ['VPN gateways', 'Media streaming clusters', 'Full internal trust zones'],
    securityNote: '⚠️ HIGH RISK — UDP amplification attacks are common. Never expose all UDP to the internet.',
    color: '#ef4444',
    icon: 'AlertTriangle'
  },

  // ━━━━━━━━━━━━ ICMP PROTOCOLS ━━━━━━━━━━━━
  {
    id: 'all-icmp-v4',
    name: 'All ICMP – IPv4',
    fullName: 'Internet Control Message Protocol (IPv4)',
    category: 'ICMP',
    portRange: 'N/A (Protocol 1)',
    protocol: 'ICMP (1)',
    description: 'Enables all IPv4 ICMP message types: Echo Request/Reply (ping), Destination Unreachable, Time Exceeded (traceroute), Redirect, and more.',
    howItWorks: 'ICMP operates at Layer 3 inside IP packets (Protocol number 1). It has no ports — instead uses Type and Code fields. Type 8/0 = ping, Type 11 = traceroute TTL expired, Type 3 = destination unreachable.',
    useCases: ['Network diagnostics (ping)', 'Path MTU discovery', 'Traceroute', 'Network monitoring (Nagios, Zabbix)'],
    securityNote: 'Allowing ICMP ping is generally safe. Consider blocking ICMP redirects (Type 5) to prevent MITM attacks.',
    color: '#a855f7',
    icon: 'Radio'
  },
  {
    id: 'all-icmp-v6',
    name: 'All ICMP – IPv6',
    fullName: 'Internet Control Message Protocol v6 (ICMPv6)',
    category: 'ICMP',
    portRange: 'N/A (Next Header 58)',
    protocol: 'ICMPv6 (58)',
    description: 'Enables all ICMPv6 message types including Neighbor Discovery (NDP), Router Advertisements, Echo Request/Reply, and Packet Too Big messages.',
    howItWorks: 'ICMPv6 is critical for IPv6 operation — it replaces ARP with Neighbor Discovery Protocol (NDP). Router Solicitation/Advertisement automate gateway discovery. Echo Request/Reply enable ping6.',
    useCases: ['IPv6 Neighbor Discovery', 'IPv6 ping (ping6)', 'Router advertisements', 'Path MTU discovery for IPv6'],
    securityNote: 'ICMPv6 is essential for IPv6 to function. Blocking it can break connectivity entirely. Filter selectively by type.',
    color: '#8b5cf6',
    icon: 'Radio'
  },

  // ━━━━━━━━━━━━ WILDCARD ━━━━━━━━━━━━
  {
    id: 'all-traffic',
    name: 'All Traffic',
    fullName: 'All Protocols, All Ports',
    category: 'Wildcard',
    portRange: 'ALL',
    protocol: 'ALL (-1)',
    description: 'Permits all inbound traffic regardless of protocol (TCP, UDP, ICMP, etc.) and port. This is the most permissive rule possible.',
    howItWorks: 'The security group matches every IP protocol number (0-255) and every port (0-65535). Effectively disables all inbound filtering for the matched source CIDR.',
    useCases: ['Intra-VPC trust for tightly coupled services', 'Testing/sandbox environments only'],
    securityNote: '🔴 CRITICAL RISK — Equivalent to no firewall. NEVER use with source 0.0.0.0/0 in production.',
    color: '#dc2626',
    icon: 'AlertTriangle'
  },

  // ━━━━━━━━━━━━ REMOTE ACCESS ━━━━━━━━━━━━
  {
    id: 'ssh',
    name: 'SSH',
    fullName: 'Secure Shell Protocol',
    category: 'Remote Access',
    portRange: '22',
    protocol: 'TCP (6)',
    description: 'Encrypted remote terminal access and command execution. Replaces insecure telnet. Supports key-based authentication, port forwarding, SCP/SFTP file transfer, and tunneling.',
    howItWorks: 'Client connects to TCP port 22. After TCP handshake, SSH version exchange occurs, then key exchange (Diffie-Hellman/ECDH) establishes an encrypted channel. User authenticates via password or public-key cryptography.',
    useCases: ['Remote server administration', 'Git over SSH', 'SCP / SFTP file transfers', 'SSH tunneling / port forwarding', 'Ansible automation'],
    securityNote: 'Use key-based auth (disable password auth). Restrict source IPs to bastion hosts or VPN CIDRs.',
    color: '#22c55e',
    icon: 'Terminal'
  },
  {
    id: 'rdp',
    name: 'RDP',
    fullName: 'Remote Desktop Protocol',
    category: 'Remote Access',
    portRange: '3389',
    protocol: 'TCP (6)',
    description: 'Microsoft proprietary protocol for graphical remote desktop sessions to Windows servers and workstations. Transmits display output, keyboard/mouse input, audio, clipboard, and device redirection.',
    howItWorks: 'Client connects to TCP 3389. RDP negotiates security (TLS/NLA/CredSSP), then establishes a virtual channel architecture. The server renders the desktop and streams compressed bitmap updates to the client.',
    useCases: ['Windows server administration', 'Remote workstation access', 'Virtual desktop infrastructure (VDI)', 'Windows bastion hosts'],
    securityNote: 'Never expose RDP to 0.0.0.0/0 — it is a top target for brute-force attacks. Use VPN or AWS SSM Session Manager instead.',
    color: '#0ea5e9',
    icon: 'Server'
  },
  {
    id: 'winrm-http',
    name: 'WinRM-HTTP',
    fullName: 'Windows Remote Management (HTTP)',
    category: 'Remote Access',
    portRange: '5985',
    protocol: 'TCP (6)',
    description: 'Microsoft WS-Management protocol over HTTP for remote PowerShell, WMI queries, and configuration management of Windows hosts.',
    howItWorks: 'WinRM uses SOAP-based XML messages over HTTP on port 5985. Supports Kerberos, NTLM, and Basic authentication. PowerShell remoting (Enter-PSSession, Invoke-Command) communicates through WinRM.',
    useCases: ['PowerShell remoting', 'Ansible Windows management', 'SCCM/DSC configuration', 'WMI remote queries'],
    securityNote: 'HTTP transport is unencrypted. Use only within private/trusted networks. Prefer WinRM-HTTPS (5986) for any cross-network communication.',
    color: '#0284c7',
    icon: 'Terminal'
  },
  {
    id: 'winrm-https',
    name: 'WinRM-HTTPS',
    fullName: 'Windows Remote Management (HTTPS)',
    category: 'Remote Access',
    portRange: '5986',
    protocol: 'TCP (6)',
    description: 'Encrypted version of WinRM using TLS/SSL certificates over HTTPS. Provides the same PowerShell remoting capabilities as WinRM-HTTP but with transport-layer encryption.',
    howItWorks: 'Identical to WinRM-HTTP but wrapped in TLS. Requires a valid SSL certificate on the target host. Client verifies the certificate before establishing the encrypted management session.',
    useCases: ['Secure PowerShell remoting across networks', 'Production Windows automation', 'Cross-domain management', 'Compliance-required environments'],
    securityNote: 'Preferred over WinRM-HTTP. Ensure certificates are properly managed and rotated.',
    color: '#0369a1',
    icon: 'Lock'
  },

  // ━━━━━━━━━━━━ EMAIL PROTOCOLS ━━━━━━━━━━━━
  {
    id: 'smtp',
    name: 'SMTP',
    fullName: 'Simple Mail Transfer Protocol',
    category: 'Email',
    portRange: '25',
    protocol: 'TCP (6)',
    description: 'The standard protocol for sending email between mail servers (MTA to MTA) and from mail clients to outgoing servers. Defined in RFC 5321.',
    howItWorks: 'Client connects to TCP 25, sends HELO/EHLO, then MAIL FROM, RCPT TO, DATA commands. The server relays the message to the recipient\'s MX (Mail Exchange) record destination. Supports STARTTLS for opportunistic encryption.',
    useCases: ['Email server-to-server relay', 'Outbound email sending', 'Transactional email systems (SES, Postfix)'],
    securityNote: 'Port 25 is commonly blocked by cloud providers to prevent spam. Use port 587 (submission) for authenticated sending.',
    color: '#f97316',
    icon: 'Mail'
  },
  {
    id: 'smtps',
    name: 'SMTPS',
    fullName: 'SMTP over SSL/TLS (Implicit TLS)',
    category: 'Email',
    portRange: '465',
    protocol: 'TCP (6)',
    description: 'SMTP with implicit TLS encryption from the start of the connection. Unlike STARTTLS on port 25/587, the entire session is encrypted from the first byte.',
    howItWorks: 'Client initiates a TLS handshake immediately upon connecting to TCP 465. After TLS is established, standard SMTP commands proceed inside the encrypted tunnel. No plaintext fallback is possible.',
    useCases: ['Secure email submission', 'Legacy mail clients requiring implicit TLS', 'Corporate mail gateways'],
    securityNote: 'More secure than STARTTLS as there is no plaintext negotiation phase vulnerable to downgrade attacks.',
    color: '#ea580c',
    icon: 'Lock'
  },
  {
    id: 'pop3',
    name: 'POP3',
    fullName: 'Post Office Protocol v3',
    category: 'Email',
    portRange: '110',
    protocol: 'TCP (6)',
    description: 'Email retrieval protocol that downloads messages from the server to a single client device. Messages are typically deleted from the server after download.',
    howItWorks: 'Client connects to TCP 110, authenticates with USER/PASS commands, then uses LIST, RETR, DELE to download and manage messages. POP3 downloads entire messages and optionally deletes them from the server.',
    useCases: ['Single-device email access', 'Offline email reading', 'Simple mail clients'],
    securityNote: 'POP3 transmits credentials in plaintext. Always use POP3S (port 995) instead for encrypted retrieval.',
    color: '#d97706',
    icon: 'Mail'
  },
  {
    id: 'pop3s',
    name: 'POP3S',
    fullName: 'POP3 over SSL/TLS',
    category: 'Email',
    portRange: '995',
    protocol: 'TCP (6)',
    description: 'Encrypted version of POP3. Wraps the entire POP3 session in a TLS tunnel, protecting credentials and email content from interception.',
    howItWorks: 'Client initiates TLS handshake on TCP 995 before any POP3 commands. After encryption is established, standard POP3 protocol operates inside the secure channel.',
    useCases: ['Secure email retrieval', 'Mobile email apps', 'Compliance-required mail access'],
    securityNote: 'Always prefer POP3S over POP3. Ensure server certificates are valid and trusted.',
    color: '#b45309',
    icon: 'Lock'
  },
  {
    id: 'imap',
    name: 'IMAP',
    fullName: 'Internet Message Access Protocol',
    category: 'Email',
    portRange: '143',
    protocol: 'TCP (6)',
    description: 'Advanced email access protocol that keeps messages on the server and supports folders, flags, search, and multi-device synchronization. Superior to POP3 for modern email workflows.',
    howItWorks: 'Client connects to TCP 143 and authenticates. IMAP maintains server-side message state — messages remain on the server. Supports IDLE command for real-time push notifications, partial message fetch, and server-side search.',
    useCases: ['Multi-device email sync (phone + desktop)', 'Webmail backends', 'Shared/team mailboxes', 'Server-side email search'],
    securityNote: 'Transmits credentials in plaintext without STARTTLS. Use IMAPS (port 993) for production.',
    color: '#ca8a04',
    icon: 'Mail'
  },
  {
    id: 'imaps',
    name: 'IMAPS',
    fullName: 'IMAP over SSL/TLS',
    category: 'Email',
    portRange: '993',
    protocol: 'TCP (6)',
    description: 'IMAP with implicit TLS encryption. All communication including authentication and email content is encrypted from connection start.',
    howItWorks: 'TLS handshake occurs immediately on TCP 993. After secure channel establishment, full IMAP protocol operates within the encrypted tunnel. Supports all IMAP features including IDLE push.',
    useCases: ['Production email servers', 'Corporate mail infrastructure', 'Mobile device email configuration'],
    securityNote: 'Standard for all modern IMAP deployments. Mandatory for compliance (HIPAA, SOC2).',
    color: '#a16207',
    icon: 'Lock'
  },

  // ━━━━━━━━━━━━ DNS ━━━━━━━━━━━━
  {
    id: 'dns-udp',
    name: 'DNS (UDP)',
    fullName: 'Domain Name System over UDP',
    category: 'DNS',
    portRange: '53',
    protocol: 'UDP (17)',
    description: 'Primary DNS transport. Most DNS queries and responses use UDP for speed — no connection overhead. Queries must fit within 512 bytes (or 4096 with EDNS0).',
    howItWorks: 'Client sends a single UDP datagram to port 53 containing the DNS query (e.g., A record for example.com). The resolver responds with a single UDP datagram containing the answer, authority, and additional sections.',
    useCases: ['Standard DNS resolution', 'Recursive resolvers', 'DNS caching servers', 'Internal DNS (Route 53, CoreDNS)'],
    securityNote: 'UDP DNS is susceptible to spoofing and amplification attacks. Consider DNSSEC validation and DNS over HTTPS/TLS.',
    color: '#06b6d4',
    icon: 'Globe'
  },
  {
    id: 'dns-tcp',
    name: 'DNS (TCP)',
    fullName: 'Domain Name System over TCP',
    category: 'DNS',
    portRange: '53',
    protocol: 'TCP (6)',
    description: 'Used for DNS responses exceeding 512 bytes (EDNS0 4096), zone transfers (AXFR/IXFR) between primary and secondary nameservers, and when UDP response has TC (Truncation) flag set.',
    howItWorks: 'Client establishes a TCP connection to port 53. A 2-byte length prefix precedes each DNS message. Zone transfers use TCP exclusively to reliably transfer entire DNS zone databases between authoritative servers.',
    useCases: ['DNS zone transfers (AXFR)', 'Large DNS responses (DNSSEC)', 'DNS over TLS (DoT, port 853)', 'Authoritative nameserver replication'],
    securityNote: 'Restrict TCP 53 access for zone transfers to known secondary nameserver IPs only.',
    color: '#0891b2',
    icon: 'Globe'
  },

  // ━━━━━━━━━━━━ WEB PROTOCOLS ━━━━━━━━━━━━
  {
    id: 'http',
    name: 'HTTP',
    fullName: 'Hypertext Transfer Protocol',
    category: 'Web',
    portRange: '80',
    protocol: 'TCP (6)',
    description: 'The foundation protocol of the World Wide Web. Defines request/response semantics (GET, POST, PUT, DELETE) for transferring hypertext documents, APIs, and web resources.',
    howItWorks: 'Client sends an HTTP request (method + path + headers + optional body) over TCP 80. Server processes the request and returns a status code (200 OK, 404 Not Found, 500 Error) with response headers and body.',
    useCases: ['Public websites', 'REST APIs', 'Health check endpoints', 'HTTP-to-HTTPS redirects', 'Load balancer listeners'],
    securityNote: 'HTTP is completely unencrypted. All data including passwords and cookies travel in plaintext. Always redirect to HTTPS.',
    color: '#f97316',
    icon: 'Globe'
  },
  {
    id: 'https',
    name: 'HTTPS',
    fullName: 'HTTP over TLS/SSL (Secure)',
    category: 'Web',
    portRange: '443',
    protocol: 'TCP (6)',
    description: 'HTTP encrypted with TLS. Provides confidentiality, integrity, and authentication. Modern web standard — browsers mark HTTP sites as "Not Secure". Supports HTTP/2 and HTTP/3 (QUIC).',
    howItWorks: 'After TCP handshake to port 443, a TLS handshake negotiates cipher suites and exchanges certificates. The server\'s identity is verified via X.509 certificate chain. All subsequent HTTP traffic is encrypted with AES-GCM or ChaCha20.',
    useCases: ['All production web traffic', 'API endpoints', 'WebSocket Secure (wss://)', 'OAuth/OIDC authentication flows'],
    securityNote: 'Use TLS 1.2+ (preferably 1.3). Enforce HSTS headers. Obtain certificates from trusted CAs (Let\'s Encrypt, ACM).',
    color: '#22c55e',
    icon: 'Lock'
  },

  // ━━━━━━━━━━━━ DIRECTORY ━━━━━━━━━━━━
  {
    id: 'ldap',
    name: 'LDAP',
    fullName: 'Lightweight Directory Access Protocol',
    category: 'Directory',
    portRange: '389',
    protocol: 'TCP (6)',
    description: 'Open protocol for accessing and maintaining distributed directory information services (users, groups, organizational units). Used for centralized authentication and authorization.',
    howItWorks: 'Client binds (authenticates) to the LDAP server on TCP 389, then performs operations: Search, Add, Delete, Modify, Compare against the Directory Information Tree (DIT). Data is organized in a hierarchical tree using Distinguished Names (DNs).',
    useCases: ['Active Directory queries', 'Centralized user authentication', 'Corporate address books', 'SSO integrations', 'Certificate lookups'],
    securityNote: 'LDAP transmits credentials in plaintext by default. Use LDAPS (port 636) or STARTTLS for production.',
    color: '#6366f1',
    icon: 'Database'
  },

  // ━━━━━━━━━━━━ FILE SHARING ━━━━━━━━━━━━
  {
    id: 'smb',
    name: 'SMB',
    fullName: 'Server Message Block (CIFS)',
    category: 'File Sharing',
    portRange: '445',
    protocol: 'TCP (6)',
    description: 'Network file sharing protocol primarily used in Windows environments. Provides shared access to files, printers, serial ports, and inter-process communication (IPC) between networked nodes.',
    howItWorks: 'Client connects to TCP 445 and negotiates SMB dialect (SMB2/SMB3). After authentication (NTLM/Kerberos), the client can create, read, write, and delete files on remote shares using tree connects and file handles. SMB3 supports encryption and multichannel.',
    useCases: ['Windows file shares (\\\\server\\share)', 'Network printers', 'Active Directory SYSVOL/NETLOGON', 'Cross-platform file sharing (Samba)'],
    securityNote: 'SMBv1 is critically vulnerable (WannaCry, EternalBlue). Disable SMBv1 and use SMBv3 with encryption. Never expose to internet.',
    color: '#0ea5e9',
    icon: 'Server'
  },
  {
    id: 'nfs',
    name: 'NFS',
    fullName: 'Network File System',
    category: 'File Sharing',
    portRange: '2049',
    protocol: 'TCP (6)',
    description: 'Distributed file system protocol originally developed by Sun Microsystems. Allows remote hosts to mount and access file systems over a network as if they were local.',
    howItWorks: 'NFS client mounts a remote export via TCP 2049 (NFSv4). The client sends RPC (Remote Procedure Call) requests for file operations (open, read, write, stat). NFSv4 consolidates all services onto a single port, unlike NFSv3 which required portmapper.',
    useCases: ['Linux/Unix shared storage', 'Kubernetes persistent volumes (EFS)', 'Home directory sharing', 'Application data mounts', 'CI/CD artifact storage'],
    securityNote: 'NFSv4 supports Kerberos authentication. Restrict access via export options and security groups. Avoid NFSv3 over untrusted networks.',
    color: '#14b8a6',
    icon: 'Server'
  },

  // ━━━━━━━━━━━━ DATABASE PROTOCOLS ━━━━━━━━━━━━
  {
    id: 'mssql',
    name: 'MSSQL',
    fullName: 'Microsoft SQL Server',
    category: 'Database',
    portRange: '1433',
    protocol: 'TCP (6)',
    description: 'Default listener port for Microsoft SQL Server relational database engine. Handles T-SQL queries, stored procedures, and database management operations via the TDS (Tabular Data Stream) protocol.',
    howItWorks: 'Client connects to TCP 1433 and initiates TDS protocol negotiation. Supports Windows Authentication (Kerberos/NTLM) and SQL Server Authentication (username/password). TDS frames carry SQL commands, result sets, and bulk data.',
    useCases: ['Enterprise .NET applications', 'Business intelligence (SSRS, SSAS)', 'ERP systems (SAP, Dynamics)', 'Azure SQL Database'],
    securityNote: 'Restrict to application server subnets. Enable TLS encryption for TDS. Use Windows Auth over SQL Auth when possible.',
    color: '#dc2626',
    icon: 'Database'
  },
  {
    id: 'mysql',
    name: 'MySQL / Aurora',
    fullName: 'MySQL / Amazon Aurora (MySQL-compatible)',
    category: 'Database',
    portRange: '3306',
    protocol: 'TCP (6)',
    description: 'Default port for MySQL and Aurora MySQL-compatible databases. Uses MySQL\'s proprietary client/server protocol for queries, transactions, and replication.',
    howItWorks: 'Server sends a handshake packet with capabilities and salt. Client responds with authentication (mysql_native_password, caching_sha2_password). After auth, the client sends COM_QUERY commands and receives result set packets with column definitions and row data.',
    useCases: ['LAMP/LEMP web stacks', 'WordPress / Drupal backends', 'AWS Aurora MySQL', 'Data warehousing', 'Replication clusters'],
    securityNote: 'Never expose 3306 to 0.0.0.0/0. Use SSL/TLS connections (--ssl-mode=REQUIRED). Restrict to app subnets.',
    color: '#f59e0b',
    icon: 'Database'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    fullName: 'PostgreSQL Database Server',
    category: 'Database',
    portRange: '5432',
    protocol: 'TCP (6)',
    description: 'Default port for PostgreSQL, the advanced open-source object-relational database. Uses a message-based protocol with frontend (client) and backend (server) message types.',
    howItWorks: 'Client sends a StartupMessage specifying database and user. Server may request password (MD5/SCRAM-SHA-256). After authentication, the client sends Query, Parse, Bind, Execute messages. Server responds with RowDescription, DataRow, and CommandComplete.',
    useCases: ['Enterprise web applications', 'PostGIS geospatial data', 'AWS RDS PostgreSQL / Aurora', 'TimescaleDB time-series', 'Supabase backend'],
    securityNote: 'Configure pg_hba.conf for strict IP-based access. Enable SSL (sslmode=require). Use SCRAM-SHA-256 authentication.',
    color: '#3b82f6',
    icon: 'Database'
  },
  {
    id: 'oracle-rds',
    name: 'Oracle-RDS',
    fullName: 'Oracle Database (TNS Listener)',
    category: 'Database',
    portRange: '1521',
    protocol: 'TCP (6)',
    description: 'Default port for Oracle Database TNS (Transparent Network Substrate) listener. Handles connection requests, load balancing, and service registration for Oracle instances.',
    howItWorks: 'Client sends a TNS Connect packet to port 1521 with a connect descriptor (host, port, service_name). The listener routes the connection to the appropriate Oracle instance. Authentication uses Oracle native or Kerberos. SQL*Net protocol carries SQL commands and results.',
    useCases: ['Enterprise Oracle databases', 'AWS RDS for Oracle', 'Oracle RAC clusters', 'SAP on Oracle', 'Financial systems'],
    securityNote: 'TNS listener is a high-value target. Restrict to app server subnets. Enable Oracle Advanced Security (TLS + encryption).',
    color: '#dc2626',
    icon: 'Database'
  },
  {
    id: 'redshift',
    name: 'Redshift',
    fullName: 'Amazon Redshift Data Warehouse',
    category: 'Database',
    portRange: '5439',
    protocol: 'TCP (6)',
    description: 'Default port for Amazon Redshift, a fully managed petabyte-scale data warehouse. Uses a PostgreSQL-compatible wire protocol over a custom port.',
    howItWorks: 'Redshift uses the PostgreSQL frontend/backend protocol on port 5439. Clients connect using standard PostgreSQL drivers (psycopg2, JDBC). Redshift\'s MPP (Massively Parallel Processing) engine distributes queries across compute nodes for analytical workloads.',
    useCases: ['Business intelligence (BI) dashboards', 'ETL/ELT data pipelines', 'Analytics and reporting', 'Data lake queries via Spectrum'],
    securityNote: 'Deploy in private subnets. Use VPC endpoints for S3 access. Enable audit logging and SSL encryption.',
    color: '#7c3aed',
    icon: 'Database'
  },
  {
    id: 'cassandra',
    name: 'CQLSH / Cassandra',
    fullName: 'Apache Cassandra CQL Native Transport',
    category: 'Database',
    portRange: '9042',
    protocol: 'TCP (6)',
    description: 'Default CQL (Cassandra Query Language) native transport port for Apache Cassandra — a distributed, wide-column NoSQL database designed for high availability and horizontal scalability with no single point of failure.',
    howItWorks: 'Clients connect to TCP 9042 using the CQL native protocol (binary, frame-based). After STARTUP and READY handshake, clients send QUERY frames with CQL statements. Cassandra uses consistent hashing to route queries to the correct replica nodes based on partition key.',
    useCases: ['Time-series IoT data', 'User activity tracking', 'Messaging platforms', 'AWS Keyspaces (managed Cassandra)', 'High-write throughput workloads'],
    securityNote: 'Enable client-to-node encryption (TLS). Use Cassandra RBAC for authentication. Restrict inter-node (7000/7001) and JMX (7199) ports.',
    color: '#2dd4bf',
    icon: 'Database'
  },

  // ━━━━━━━━━━━━ SPECIAL ━━━━━━━━━━━━
  {
    id: 'elastic-graphics',
    name: 'Elastic Graphics',
    fullName: 'Amazon Elastic Graphics (EGL)',
    category: 'Special',
    portRange: '2040',
    protocol: 'TCP (6)',
    description: 'Port used by Amazon Elastic Graphics to attach low-cost GPU acceleration to EC2 instances for OpenGL graphics rendering without requiring a full GPU instance.',
    howItWorks: 'An Elastic Graphics accelerator is attached to an EC2 instance via an ENI (Elastic Network Interface) on port 2040. The instance redirects OpenGL API calls over the network to the remote GPU accelerator, which renders frames and returns them.',
    useCases: ['3D visualization', 'Graphics-intensive applications', 'Remote workstation rendering', 'CAD/CAM applications on non-GPU instances'],
    securityNote: 'Only allow inbound from the Elastic Graphics network interface. This port should not be exposed to the internet.',
    color: '#f472b6',
    icon: 'Zap'
  }
];

// ─── Category definitions with colors ────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All Protocols', color: '#94a3b8', count: PORT_PROTOCOLS.length },
  { id: 'Transport', label: 'Transport', color: '#10b981' },
  { id: 'ICMP', label: 'ICMP', color: '#a855f7' },
  { id: 'Wildcard', label: 'Wildcard', color: '#dc2626' },
  { id: 'Remote Access', label: 'Remote Access', color: '#22c55e' },
  { id: 'Email', label: 'Email', color: '#f97316' },
  { id: 'DNS', label: 'DNS', color: '#06b6d4' },
  { id: 'Web', label: 'Web', color: '#f97316' },
  { id: 'Directory', label: 'Directory', color: '#6366f1' },
  { id: 'File Sharing', label: 'File Sharing', color: '#0ea5e9' },
  { id: 'Database', label: 'Database', color: '#f59e0b' },
  { id: 'Special', label: 'Special', color: '#f472b6' }
];

// ─── Icon resolver ───────────────────────────────────────────────────────────
const ICON_MAP = {
  Network, Globe, Server, Database, Terminal, Mail, Lock, AlertTriangle, Radio, Zap, Shield, Wifi, Layers
};

export default function SecurityGroupPortRef() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [copiedPort, setCopiedPort] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProtocol(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProtocol) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProtocol]);

  // Filter protocols
  const filteredProtocols = useMemo(() => {
    let result = PORT_PROTOCOLS;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.portRange.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    PORT_PROTOCOLS.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    counts['all'] = PORT_PROTOCOLS.length;
    return counts;
  }, []);

  const handleCopyPort = (port) => {
    navigator.clipboard.writeText(port).catch(() => {});
    setCopiedPort(port);
    setTimeout(() => setCopiedPort(null), 1500);
  };

  const IconComponent = (iconName) => ICON_MAP[iconName] || Shield;

  // Selected protocol navigation indices
  const currentProtoIndex = selectedProtocol
    ? PORT_PROTOCOLS.findIndex(p => p.id === selectedProtocol.id)
    : -1;
  const prevProto = currentProtoIndex > 0
    ? PORT_PROTOCOLS[currentProtoIndex - 1]
    : PORT_PROTOCOLS[PORT_PROTOCOLS.length - 1];
  const nextProto = currentProtoIndex >= 0 && currentProtoIndex < PORT_PROTOCOLS.length - 1
    ? PORT_PROTOCOLS[currentProtoIndex + 1]
    : PORT_PROTOCOLS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ─── Header Banner ─────────────────────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(245, 158, 11, 0.06) 30%, rgba(15, 23, 42, 0.92) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.35)'
            }}>
              <Shield size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: '#ffffff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                Security Group Port & Protocol Reference
                <span className="badge" style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  fontSize: '0.68rem'
                }}>
                  {PORT_PROTOCOLS.length} Rules
                </span>
                <span className="badge" style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fde68a',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  fontSize: '0.68rem'
                }}>
                  AWS / Cloud Firewalls
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Complete reference for inbound security group rules — protocols, ports, descriptions, and how each protocol works at the wire level.
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fca5a5' }}>
              <Shield size={12} />
              Inbound Rules Reference
            </span>
            <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>
              TCP · UDP · ICMP · ALL
            </span>
          </div>
        </div>

        {/* ─── Search Bar ───────────────────────────────────────────── */}
        <div style={{
          marginTop: '16px',
          position: 'relative'
        }}>
          <Search size={16} color="#64748b" style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search protocols, ports, or descriptions... (e.g. SSH, 443, database)"
            style={{
              width: '100%',
              padding: '11px 16px 11px 40px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.4)',
              color: '#e2e8f0',
              fontSize: '0.84rem',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
        </div>

        {/* ─── Category Filter Pills ────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '14px',
          flexWrap: 'wrap'
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  fontSize: '0.76rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive
                    ? `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`
                    : 'rgba(0, 0, 0, 0.3)',
                  border: isActive
                    ? `1px solid ${cat.color}`
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 0 12px ${cat.color}44` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {cat.label}
                <span style={{
                  fontSize: '0.64rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#fff' : 'var(--text-dim)'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Results Count ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4px',
        fontSize: '0.76rem',
        color: 'var(--text-dim)'
      }}>
        <span>
          Showing <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{filteredProtocols.length}</span> of {PORT_PROTOCOLS.length} protocols
          {searchQuery && <span style={{ color: '#fca5a5' }}> matching "{searchQuery}"</span>}
        </span>
        <span style={{ fontFamily: 'monospace', color: '#64748b' }}>
          Click any card or table row to view full details in popup
        </span>
      </div>

      {/* ─── Protocol Cards Grid (Compact & Non-extending) ───────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '14px'
      }}>
        {filteredProtocols.map((proto) => {
          const Icon = IconComponent(proto.icon);
          const isRisky = proto.securityNote?.includes('⚠️') || proto.securityNote?.includes('🔴');

          return (
            <div
              key={proto.id}
              className="glass-panel"
              onClick={() => setSelectedProtocol(proto)}
              style={{
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                background: 'rgba(15, 23, 42, 0.82)',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${proto.color}55`;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 24px -6px ${proto.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top row: Icon, Name, Category pill, High Risk badge, and Port */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '9px',
                    background: `${proto.color}18`,
                    border: `1px solid ${proto.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} color={proto.color} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.94rem', fontWeight: '700', color: '#ffffff' }}>
                        {proto.name}
                      </span>
                      <span style={{
                        fontSize: '0.64rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: `${proto.color}18`,
                        color: proto.color,
                        fontWeight: '600',
                        border: `1px solid ${proto.color}30`
                      }}>
                        {proto.category}
                      </span>
                      {isRisky && (
                        <span style={{
                          fontSize: '0.60rem',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: 'rgba(239, 68, 68, 0.18)',
                          color: '#fca5a5',
                          fontWeight: '700',
                          border: '1px solid rgba(239, 68, 68, 0.35)'
                        }}>
                          HIGH RISK
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {proto.fullName}
                    </div>
                  </div>
                </div>

                {/* Port badge with copy */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyPort(proto.portRange);
                  }}
                  title={`Copy port: ${proto.portRange}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#38bdf8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {copiedPort === proto.portRange ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
                  {proto.portRange}
                </button>
              </div>

              {/* Middle preview description (compact, 2 lines) */}
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.4em'
              }}>
                {proto.description}
              </div>

              {/* Bottom footer: Protocol type and "View Details" button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.72rem'
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#94a3b8',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  {proto.protocol}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProtocol(proto);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: `linear-gradient(135deg, ${proto.color}15, rgba(0,0,0,0.3))`,
                    border: `1px solid ${proto.color}35`,
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = proto.color;
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${proto.color}15, rgba(0,0,0,0.3))`;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  <Eye size={12} />
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Empty State ───────────────────────────────────────────── */}
      {filteredProtocols.length === 0 && (
        <div className="glass-panel" style={{
          padding: '40px 20px',
          borderRadius: '16px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <Search size={36} color="#475569" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
            No protocols match your search
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Try searching for a different port number, protocol name, or category.
          </div>
        </div>
      )}

      {/* ─── Quick Reference Summary Table ─────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>
              Quick Reference — All Ports & Protocols
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Click any row or description to open full details popup
          </span>
        </div>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.78rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {['Protocol', 'Port', 'Transport', 'Category', 'Description'].map((h) => (
                <th key={h} style={{
                  padding: '10px 12px',
                  textAlign: 'left',
                  color: 'var(--text-dim)',
                  fontWeight: '700',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PORT_PROTOCOLS.map((proto) => (
              <tr
                key={proto.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background 0.15s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedProtocol(proto)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '9px 12px', fontWeight: '600', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: proto.color,
                      flexShrink: 0,
                      boxShadow: `0 0 6px ${proto.color}55`
                    }} />
                    {proto.name}
                  </span>
                </td>
                <td style={{
                  padding: '9px 12px',
                  fontFamily: 'var(--font-mono)',
                  color: '#38bdf8',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}>
                  {proto.portRange}
                </td>
                <td style={{
                  padding: '9px 12px',
                  fontFamily: 'var(--font-mono)',
                  color: '#94a3b8',
                  fontSize: '0.74rem',
                  whiteSpace: 'nowrap'
                }}>
                  {proto.protocol}
                </td>
                <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: `${proto.color}15`,
                    color: proto.color,
                    fontWeight: '600'
                  }}>
                    {proto.category}
                  </span>
                </td>
                <td style={{
                  padding: '9px 12px',
                  color: 'var(--text-muted)',
                  maxWidth: '460px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        color: '#cbd5e1'
                      }}
                      title="Click row to read full unabridged description"
                    >
                      {proto.description}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProtocol(proto);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        fontSize: '0.68rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}
                      title="Open full description & wire mechanics popup"
                    >
                      <Eye size={11} />
                      Full Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Footer Tip ────────────────────────────────────────────── */}
      <div style={{
        padding: '14px 18px',
        borderRadius: '10px',
        background: 'rgba(245, 158, 11, 0.06)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontSize: '0.78rem',
        color: '#fde68a',
        lineHeight: '1.55'
      }}>
        <AlertTriangle size={16} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <strong>Best Practice:</strong> Always follow the Principle of Least Privilege — only open the specific ports your application requires, restrict source CIDRs to known IP ranges, and never use <code style={{
            padding: '1px 5px',
            borderRadius: '3px',
            background: 'rgba(0,0,0,0.35)',
            fontSize: '0.76rem',
            fontFamily: 'var(--font-mono)',
            color: '#fca5a5'
          }}>0.0.0.0/0</code> for sensitive protocols like SSH, RDP, or databases.
        </div>
      </div>

      {/* ─── Protocol Detail Popup Modal ────────────────────────────── */}
      {selectedProtocol && (() => {
        const ModalIcon = IconComponent(selectedProtocol.icon);
        const isModalRisky = selectedProtocol.securityNote?.includes('⚠️') || selectedProtocol.securityNote?.includes('🔴');

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(5, 8, 16, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProtocol(null);
            }}
          >
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '760px',
                maxHeight: '88vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '18px',
                border: `1px solid ${selectedProtocol.color}45`,
                background: 'linear-gradient(160deg, rgba(20, 28, 48, 0.98) 0%, rgba(10, 15, 30, 0.99) 100%)',
                boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px ${selectedProtocol.color}20`,
                overflow: 'hidden',
                animation: 'fadeIn 0.18s ease-out'
              }}
            >
              {/* ── Modal Header ── */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: `linear-gradient(90deg, ${selectedProtocol.color}10 0%, rgba(255,255,255,0.02) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${selectedProtocol.color}20`,
                    border: `1px solid ${selectedProtocol.color}45`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 0 16px ${selectedProtocol.color}35`
                  }}>
                    <ModalIcon size={24} color={selectedProtocol.color} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '800',
                        color: '#ffffff'
                      }}>
                        {selectedProtocol.name}
                      </h3>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '5px',
                        background: `${selectedProtocol.color}22`,
                        color: selectedProtocol.color,
                        fontWeight: '700',
                        border: `1px solid ${selectedProtocol.color}40`
                      }}>
                        {selectedProtocol.category}
                      </span>
                      {isModalRisky && (
                        <span style={{
                          fontSize: '0.64rem',
                          padding: '2px 7px',
                          borderRadius: '5px',
                          background: 'rgba(239, 68, 68, 0.18)',
                          color: '#fca5a5',
                          fontWeight: '800',
                          border: '1px solid rgba(239, 68, 68, 0.4)'
                        }}>
                          HIGH RISK
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginTop: '3px'
                    }}>
                      {selectedProtocol.fullName}
                    </div>
                  </div>
                </div>

                {/* Navigation & Close controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => setSelectedProtocol(prevProto)}
                    title={`Previous: ${prevProto.name}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#cbd5e1';
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedProtocol(nextProto)}
                    title={`Next: ${nextProto.name}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#cbd5e1';
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedProtocol(null)}
                    title="Close (Esc)"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#fca5a5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ef4444';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                      e.currentTarget.style.color = '#fca5a5';
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* ── Modal Scrollable Body ── */}
              <div style={{
                padding: '24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {/* 4-Specs Metric Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '10px'
                }}>
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Port / Range
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px'
                    }}>
                      <span style={{ fontSize: '1rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                        {selectedProtocol.portRange}
                      </span>
                      <button
                        onClick={() => handleCopyPort(selectedProtocol.portRange)}
                        title="Copy port"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {copiedPort === selectedProtocol.portRange ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Protocol
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: '#e2e8f0', marginTop: '4px' }}>
                      {selectedProtocol.protocol}
                    </div>
                  </div>

                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Category
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: selectedProtocol.color, marginTop: '4px' }}>
                      {selectedProtocol.category}
                    </div>
                  </div>

                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Firewall Direction
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>
                      Inbound Rule
                    </div>
                  </div>
                </div>

                {/* Complete Unabridged Description */}
                <div>
                  <div style={{
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Info size={14} color="#38bdf8" />
                    Full Description
                  </div>
                  <p style={{
                    fontSize: '0.88rem',
                    color: '#f1f5f9',
                    lineHeight: '1.7',
                    margin: 0,
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {selectedProtocol.description}
                  </p>
                </div>

                {/* Wire-level Mechanics: How It Works */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${selectedProtocol.color}10 0%, rgba(0,0,0,0.4) 100%)`,
                  border: `1px solid ${selectedProtocol.color}25`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    color: selectedProtocol.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '10px'
                  }}>
                    <Zap size={14} />
                    How It Works (Wire-Level Mechanics)
                  </div>
                  <p style={{
                    fontSize: '0.84rem',
                    color: '#e2e8f0',
                    lineHeight: '1.65',
                    margin: 0
                  }}>
                    {selectedProtocol.howItWorks}
                  </p>
                </div>

                {/* Common Use Cases */}
                <div>
                  <div style={{
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '10px'
                  }}>
                    Common Use Cases & Deployments
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '8px'
                  }}>
                    {selectedProtocol.useCases.map((uc, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        fontSize: '0.82rem',
                        color: '#cbd5e1',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.28)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <CheckCircle2 size={14} color={selectedProtocol.color} style={{ flexShrink: 0 }} />
                        <span>{uc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Note Alert */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: isModalRisky ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.08)',
                  border: isModalRisky ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <Shield
                    size={18}
                    color={isModalRisky ? '#fca5a5' : '#86efac'}
                    style={{ marginTop: '2px', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: isModalRisky ? '#fca5a5' : '#86efac',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '4px'
                    }}>
                      Security & Firewall Hardening
                    </div>
                    <div style={{
                      fontSize: '0.82rem',
                      color: isModalRisky ? '#fecaca' : '#bbf7d0',
                      lineHeight: '1.55'
                    }}>
                      {selectedProtocol.securityNote}
                    </div>
                  </div>
                </div>

                {/* Cloud Security Group Rule Representation */}
                <div>
                  <div style={{
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px'
                  }}>
                    Cloud Security Group Inbound Rule
                  </div>
                  <div style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(0, 0, 0, 0.4)'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Type</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Protocol</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Port Range</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Recommended Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '10px 12px', fontWeight: '700', color: '#ffffff' }}>{selectedProtocol.name}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{selectedProtocol.protocol}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: '700' }}>{selectedProtocol.portRange}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: isModalRisky ? '#fca5a5' : '#86efac' }}>
                            {isModalRisky ? '10.0.0.0/16 or Bastion SG' : '0.0.0.0/0 (Internet)'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ── Modal Footer ── */}
              <div style={{
                padding: '14px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(0, 0, 0, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Rule {currentProtoIndex + 1} of {PORT_PROTOCOLS.length}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleCopyPort(selectedProtocol.portRange)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.28)',
                      color: '#38bdf8',
                      fontSize: '0.76rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedPort === selectedProtocol.portRange ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                    Copy Port ({selectedProtocol.portRange})
                  </button>

                  <button
                    onClick={() => setSelectedProtocol(null)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.76rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
