---
title: sketchbook
layout: sketchbook
---

<div class="sketches">
  {% for sketch in site.sketchbook %}
    <a class="sketches__sketch" href="{{ sketch.url }}">
      <img class="sketches__sketch-hype" src="{{ sketch.hype }}" />
      <div class="sketches__sketch-meta">
        <h1 class="sketches__sketch-title">{{ sketch.title }}</h1>
      </div>
    </a>
  {% endfor %}
</div>
