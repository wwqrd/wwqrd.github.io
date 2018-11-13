---
title: projects
layout: index
---

<div class="posts">
  {% for post in site.projects %}
    <a class="posts__post" href="{{ post.url }}">
      <div class="posts__post-meta">
        <h1 class="posts__post-title">{{ post.title }}</h1>
      </div>
      <div class="posts__post-hype">
        {{ post.hype }}
      </div>
    </a>
  {% endfor %}
</div>
