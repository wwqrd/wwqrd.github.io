---
title: projects
layout: index
---

<div class="posts">
  <p><em>Caveat: These projects are well old. I need to post some updated ones!</em></p>
  {% assign projects = site.projects | sort: 'date' | reverse %}
  {% for project in projects %}
    <a class="posts__post" href="{{ project.url }}">
      <div class="posts__post-meta">
        <h1 class="posts__post-title">{{ project.title }}</h1>
      </div>
      <div class="posts__post-hype">
        {{ project.hype }}
      </div>
    </a>
  {% endfor %}
</div>
