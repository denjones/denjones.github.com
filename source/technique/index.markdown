---
layout: page
comments: false
sharing: false
footer: false
---

<div class="blog-index">
  {% assign index = true %}
  {% for post in site.categories["技術{technique}"] %}
  {% assign content = post.content %}
    <article>
     {% include article.html %}
    </article>
  {% endfor %}
    <div class="pagination">
      {% if paginator.next_page %}
        <a class="prev" href="{{paginator.next_page}}">&larr; 上頁</a>
      {% endif %}
      <a href="/blog/archives">文章列表</a>
      {% if paginator.previous_page %}
        <a class="next" href="{{paginator.previous_page}}">下頁 &rarr;</a>
      {% endif %}
    </div>
</div>
