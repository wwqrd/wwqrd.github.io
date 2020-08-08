---
title: wwqrd
layout: index
---

<div class="posts">
  {% for post in site.posts %}
    <a class="posts__post" href="{{ post.url }}">
      <div class="posts__post-date">{{ post.date | date: "%a, %B %e" }}</div>
      <h3 class="posts__post-title">{{ post.title }}</h3>
    </a>
  {% endfor %}
</div>
