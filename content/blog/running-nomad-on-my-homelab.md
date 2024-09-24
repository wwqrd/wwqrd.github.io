+++
title = "Running Nomad On My Home Lab"
date = "2024-10-17"
template = "post.html"
tags = ["homelab", "nomad", "consul", "traefik", "kubernetes"]
+++

I've had Nomad running on my homelab for over a month now, and I’m still really excited about it 🎉. It’s been fun and surprisingly simple! This post is about the transition from a patchwork of small utilities to an orchestrated home lab setup, and why it was Nomad that stuck.

## Background

I’ve been running essential utilities on Raspberry Pis for a while: Pi-hole for DNS filtering, an AirPlay speaker 🎶, and environment sensors logging to Adafruit’s MQTT broker. It was all very ad-hoc.

I wanted to add more services but manage them in a more organized way. While I’d used tools like Puppet for machine setups before, this time I wanted a containerized approach to lower the chances of breaking services. Since we use Kubernetes at work, I thought it’d be fun to try it at home — I had more to learn than I expected! 😅

### The Vision

> Run a small Kubernetes cluster on Raspberry Pis, supported by second-hand mini-PCs to handle more resource-heavy applications.

It sounded fun at the time, but I quickly found myself buried in complexity.

## Jumping In

I started with some lightweight Kubernetes distributions: microk8s and k3s. Both were great, and setup was easy enough. I found k3s snappier on my low-end hardware. But as I started to try and setup my applications I kept hitting road blocks.

I could’ve used Helm charts to get started, but I wanted to understand the setup. I tried creating my own configs using public Helm charts as a reference, but I kept breaking things without knowing why. Debugging a system you don’t fully understand is tough. Progress slowed to a crawl, and the project languished for months. Kubernetes just didn’t fit with the limited time I could dedicate to the project (a couple of hours a week at most) ⏳.

## New Energy

Despite the frustrations, I was commited the idea of a neatly orchestrated home lab. I decided to focus on learning the fundamentals. It's easy to think you have a good handle on things, when you've been using them forever. Like networking, I've set up plenty of home networks before ...but do I really know what a Docker bridge is? I dove into some amazing YouTube videos (thank you [NetworkChuck](https://www.youtube.com/@NetworkChuck)), and things started to click. I could feel my understanding growing.

I stumbled across mentions of Nomad in some `/r/homelab` discussions. Since Kubernetes hadn’t gotten me very far, I figured why not give Nomad a try? Feeling inspired and more confident in my understanding, in just a couple of hours:

1. I got Nomad running as a service -- 💪
2. Discovered the web interface for easy monitoring -- 👌
3. Created a Pi-hole job… and it worked on the first try! -- 🙌

Nomad seemed simple by comparison — but not in a bad way. I felt I could actually understand what I was doing.

```go
// Example config, running server and client on the same machine as
// a single node cluster. Not suitable for production but great for me!

data_dir  = "/opt/nomad/data"
bind_addr = "0.0.0.0"
datacenter = "section9"

server {
  enabled          = true
  bootstrap_expect = 1 // 1 node "cluster" xD
}

client {
  enabled = true

  servers = ["127.0.0.1"]

  options = {
    "docker.volumes.enabled" = "true"
    "docker.privileged.enabled" = "true"
  }
}
```

## Why Nomad is Nice

### Baby Steps

The best part about Nomad? It's _not_ Kubernetes. Because Nomad does less (do one thing well) I was able to learn at my own pace without feeling overwhelmed. With the web control panel, I get immediate feedback on what I'm doing. On my single-node setup, it’s just an orchestrator (and a one node scheduler in my case 😆). And that’s really all I need for my homelab.

### Grows with You

Once I had a few applications up and running, I wanted easier access to them. I was binding different ports statically to the host and using bookmarks to remember them. That’s when I added Consul and Traefik.

These new tools expanded my setup naturally. There were bumps along the way. I didn’t fully understand how Traefik tags worked at first, and I still had to manually add entries to the client `/etc/hosts` file for domain name resolution. But this time, I only had a few new concepts to tackle. I was able to slowly build things out, one piece at a time, and really get to grips with what I was doing without feeling lost.

### Enter 6 Billion Daemons

Fast forward, and I’ve got 11 different apps running, running accross 1-3 containers each.

The whole thing really came together when I set up a wildcard `*.home.arpa` DNS entry using Pi-hole and dnsmasq. That means I can just specify a new subdomain for a service in the traefik tags on the Nomad job spec, and boom — it works instantly on the with no extra config.

For example, I recently add the Memos app to start drafting this blog post. It took about 15 mins and here's the job spec:

```go
job "memos" {
  type = "service"

  group "memos" {
    count = 1

    service {
      name = "memos-web"
      port = "memos-web"

      tags = [
        "traefik.enable=true",
        "traefik.http.routers.memos.rule=Host(`memos.home.arpa`)",
      ]
    }

    network {
      port "memos-web" {
        to = 5230
      }
    }

    task "memos" {
      driver = "docker"

      config {
        image = "neosmemo/memos:stable"
        ports = ["memos-web"]
        volumes = ["/srv/section9/memos:/var/opt/memos"]
      }
    }
  }
}
```

## It Wasn’t All Plain Sailing

I broke my Consul and Nomad setups a couple of times 🤦‍♂️, I didn’t understand which parts should bind to which networks for example. Through trial and error 🔧, I learned more about how they integrate together, and what they do, and why.

My configurations are perfect. I'm binding to the host for file storage, instead of using CSI volumes. I have a couple of passwords hardcoded into my specs 🔒. My server is essentially a personal device on a private network, so I’m okay with it for now. Just remind me not to publish those files 😉

## What’s Next?

- Use Vault for secret management, and ditch the passwords 🔑
- My next project is to set up a local Certificate Authority (CA) so I can get my apps running https 🔐.
- Add another machine so it's actually a cluster 😄

Interestingly, I’m now in a much better position to work with Kubernetes, but I don't feel the need to anymore. Nomad works beautifully for my requirements 💯.
