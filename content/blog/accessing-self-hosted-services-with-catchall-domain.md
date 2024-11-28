+++
title = "Simplifying self-hosted service access with a catchall domain"
date = "2024-11-18"
template = "post.html"
[extra]
tags = ["homelab", "pihole", "traefik", "dnsmasq", "self-hosted", "domain", "tailscale"]
description = "Here's how I used Traefik, Pi-hole, and home.arpa to streamline access with subdomains."
+++

I recently set up the first node for my homelab. While it was easy to spin up various services, accessing them wasn’t so straightforward —remembering ports for each service was a hassle 🤯. It really came together when I got a catchall domain working.

#### Why a Catchall Domain?  🌐

Traefik offers powerful tools for redirecting traffic and rewriting headers, but things don’t always go smoothly. Many Docker-based apps are built to assume they’re running at the root of a domain, that can cause unexpected behaviour 🛑. Rather than figure this out on an app by app basis, I could largely sidestep this problem by using sub-domains.

For the domain itself, many people default to `.local` for local services, but this can cause conflicts with mDNS. Others opt for a real domain, but that comes with two drawbacks: it costs money, and your DNS records are public. Turns out that `home.arpa` is specifically reserved by the IETF for home networking 🏡. It’s free, private and perfect for me since I don’t need to route public traffic to my homelab 🙌.

So this is the setup:

- I have a single node with a known IP (`192.168.1.20`).
- I will route all subdomains for `home.arpa` to my known node IP
- I will use a `home.arpa` subdomain for each service, e.g. `pihole.home.arpa`
- All traffic on port 80/443 (e.g. web traffic) hit will hit my reverse proxy (Traefik) on that device.
- I can set Traefik tags on my Nomad jobs to route them by `Host()`
- This means I can configure the subdomain in my Nomad job files and it will automagically work ✨!

#### DNS Configuration with Pi-hole 🛠️

So how to do a catchall? Turns out, Pi-hole already has **dnsmasq** built in, which can handle this easily 🤩. The simplest setup is adding an address entry like so:

```python
# in /etc/dnsmasq.d/09-home.conf
address=/.home.arpa/192.168.1.20
```

With this in place, every subdomain under `home.arpa` resolves to the IP address `192.168.1.20`. For example:

- `pihole.home.arpa` → 192.168.1.20
- `home-assistant.home.arpa` → 192.168.1.20

👌

```python
tags = [
    "traefik.enable=true",
    "traefik.http.routers.pihole.rule=Host(`pihole.home.arpa`)",
]
```

#### Handling Remote Access 🌍

This worked great for me on my LAN, but when I’m away from home, connecting via VPN it breaks because that IP is no longer valid ❌. Fortunately we can configure for this too, and include information about the subnets that each IP is relevant to:

```python
address=/.home.arpa/192.168.1.0/24/192.168.1.20  # LAN ip for node
address=/.home.arpa/100.64.0.0/10/100.66.66.66  # VPN ip for node
```

Now I can let networking magic ✨ route my traffic to the most appropriate IP, so long as we use the pihole as our DNS server, but
I don't want to use that for the rest of my traffic when I'm on the VPN, because it'll add a slow round trip to all my DNS queries.

#### Split DNS with Tailscale 🛡️

Tailscale makes this easy to fix with its **split DNS** feature. This allows you to delegate DNS resolution for a specific TLD (`home.arpa`), everything else can go to your regular server. To set it up:

1. Open the Tailscale admin panel.
2. Go to the **DNS** section.
3. Add a custom nameserver for `home.arpa`.
4. Done!

Now, whether I’m at home or connected via VPN, my services are easily accessible using their subdomains ☺️

Setting up a catchall domain with Traefik, Pi-hole, and `home.arpa` has made managing and accessing my homelab services easy. Subdomains keep everything organized and avoid the quirks of app-specific configurations, while Pi-hole and Tailscale handle DNS seamlessly for both local and remote access. With this setup, expanding my homelab feels even more straightforward.
