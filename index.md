---
title: wwqrd
layout: index
---

<div class="posts">
  {% for post in site.posts %}
    <a class="posts__post" href="{{ post.url }}">
      <div class="posts__post-meta">
        <h1 class="posts__post-title">{{ post.title }}</h1>
        <div class="posts__post-date">{{ post.date | date: "%a, %B %d" }}</div>
      </div>
      {% if post.hype %}
        <div class="posts__post-hype">
          {{ post.hype }}
        </div>
      {% endif %}
    </a>
  {% endfor %}
</div>
