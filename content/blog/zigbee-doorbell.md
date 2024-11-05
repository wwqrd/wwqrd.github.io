+++
title = "Building a Smart Doorbell with Zigbee, MQTT, and Raspberry Pi"
date = "2024-11-04"
template = "post.html"
[extra]
tags = ["homelab", "zigbee", "mqtt", "iot"]
hype = "Learn how I created a smart doorbell using Zigbee, MQTT, and a Raspberry Pi. This simple DIY project adds sound alerts and notifications through Home Assistant, all powered by my homelab setup."
+++

This is a smart doorbell project that came together right after I set up a Zigbee + MQTT hub.

One of my first goals after setting up my [homelab](/blog/running-nomad-on-my-homelab/) was to set up a hub for smart home automation. With Nomad, setting up all the prerequisites was straightforward:

- [Mosquitto](https://mosquitto.org/) — an MQTT broker
- [zigbee2mqtt](https://www.zigbee2mqtt.io/) — a bridge between Zigbee and MQTT
- [Home Assistant](https://www.home-assistant.io/) — a dashboard and control center for smart home devices

Zigbee2MQTT was a fantastic surprise: it’s practically plug-and-play and extremely powerful. I’m using an open hardware Zigbee dongle and a few well-known compatible devices, so I expected it to work, but I was blown away by how seamless it was. I made sure the z2m instance had access to the right `/dev/` on the host, turned on pairing mode, and it instantly started sending data to my MQTT instance.

Nomad HCL for Zigbee2MQTT:
```go
job "zigbee2mqtt" {
  type = "service"

  group "zigbee2mqtt" {
    count = 1

    service {
      name = "zigbee2mqtt-web"
      port = "http"

      tags = [
        "traefik.enable=true",
        "traefik.http.routers.z2m.rule=Host(`z2m.home.arpa`)",
      ]
    }

    network {
      port "http" {
        to = 8080
      }
    }

    task "server" {
      driver = "docker"

      env {
        TZ = "Europe/London"
      }

      config {
        image = "koenkk/zigbee2mqtt"

        privileged = "true"

        ports = [
          "http",
        ]

        volumes = [
            "/srv/section9/zigbee2mqtt/data:/app/data",
        ]

        // Access zigbee dongle
        devices = [
          {
            host_path = "/dev/serial/by-id/usb-1a86_USB_Serial-if00-port0"
            container_path = "/dev/ttyACM0"
          },
        ]
      }
    }
  }
}

```

## The doorbell project

I’d already picked up a few affordable Zigbee sensors and controls, hoping to find some interesting uses for them.

Then, inspiration struck: my doorbell is broken. Eventually I want to fix it, it’s nice looking retro bakerlite thing, but the contacts are burnt out. My initial plan was to replace it temporarily with a wireless model, but why not make a smart doorbell instead?

I had already paired a Zigbee switch and verified it was sending data smoothly to MQTT. And since I had a Raspberry Pi set up as a hi-fi speaker (my “Pi-Fi”), it was all ready to go — typically used with AirPlay, but essentially a Linux box with a [hi-fi amp hat].

I just needed to play a sound in response to an MQTT event. So, I downloaded a doorbell sound, tested it with `aplay`, and ran a `mosquitto_sub` to confirm the topic I needed to subscribe to. Sound, check. Events, check.

<div class="embed">
  <img src="/assets/images/blog/speaker.jpg" class="centered" />
  <p>The speaker and zigbee button.</p>
</div>

…And then the dreaded bikeshedding brain kicked in: “Should I write a program for this? What language? JS/Node is familiar, but maybe I should try something new? Which MQTT library? Should I launch `aplay` from the app, or find an audio library?” Thankfully I snapped out of it — why not keep it simple and use the command-line tools I’d just tested? KISS.

After a quick search, I [found an example](https://stackoverflow.com/questions/73560635/subscribe-a-bash-script-to-run-when-mqtt-message-is-received) and adapted it to my needs:

```bash
#!/usr/bin/env sh

echo "Starting doorbell..."

# `home.arpa` is the mqtt broker
# `zigbee2mqtt/cmd/controls/doorbell/action` is the topic published by z2m when the button is pressed
mosquitto_sub -h home.arpa -t zigbee2mqtt/cmd/controls/doorbell/action |
    while read payload ; do
       echo "Doorbell rang!"
       aplay /opt/doorbell/doorbell.wav
    done

echo "Doorbell stopped."
```

I set up the necessary systemd configuration to run this as a service on the Pi-Fi.

I was tempted to post a video, but filming a speaker playing a sound isn’t that compelling 😂

And the final cherry on top: Home Assistant can also subscribe to MQTT and includes an automation feature. Now, when the doorbell is pressed, I get a notification — even on my watch!

<div class="embed">
  <img src="/assets/images/blog/watch.jpg" class="centered" />
  <p>Home assistant notification on my watch.</p>
</div>

This was so satisfying to implement — simple in approach, but fully leaning into the sophisticated software stack I already have running.
