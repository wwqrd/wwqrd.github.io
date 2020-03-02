---
title: sketchbook
layout: index
variant: wide
---
{% assign image_media_types = ".png .jpg" | split: " " %}

<div class="sketches">
  {% assign sketches = site.sketchbook | sort: 'date' | reverse %}
  {% for sketch in sketches %}
    {% assign hype_media_type = sketch.hype | slice: -4, 4 %}
    <a class="sketches__sketch" href="{{ sketch.url }}">
      <div class="sketches__sketch-hype">
        {% if image_media_types contains hype_media_type %}
          <img src="{{ sketch.hype }}" />
        {% else %}
          <div>{{ sketch.hype }}{{ hype_media }}</div>
        {% endif %}
      </div>

      <div class="sketches__sketch-meta">
        <h1 class="sketches__sketch-title">{{ sketch.title }}</h1>
      </div>
    </a>
  {% endfor %}
</div>
