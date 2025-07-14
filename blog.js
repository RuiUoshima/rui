const postBtn = document.getElementById("post-blog");
const titleInput = document.getElementById("blog-title");
const contentInput = document.getElementById("blog-content");
const imageInput = document.getElementById("blog-image");
const blogList = document.getElementById("blog-list");

let blogData = JSON.parse(localStorage.getItem("blogPosts")) || [];

function renderBlogs() {
  blogList.innerHTML = "";
  blogData.forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "blog-entry";

    const date = new Date(entry.timestamp).toLocaleString();

    div.innerHTML = `
      <h3>${entry.title}</h3>
      <div class="entry-meta">${date}</div>
      <p>${entry.content}</p>
      ${entry.image ? `<img src="${entry.image}" alt="Blog Image">` : ""}
      <button onclick="editBlog(${index})">Edit</button>
      <button onclick="deleteBlog(${index})">Delete</button>
    `;
    blogList.appendChild(div);
  });
}

postBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!title || !content) return;

  const savePost = (imageBase64 = null) => {
    if (postBtn.dataset.editing !== undefined) {
      const index = parseInt(postBtn.dataset.editing);
      blogData[index] = { title, content, image: imageBase64, timestamp: Date.now() };
      delete postBtn.dataset.editing;
      postBtn.textContent = "Post";
    } else {
      blogData.unshift({ title, content, image: imageBase64, timestamp: Date.now() });
    }

    localStorage.setItem("blogPosts", JSON.stringify(blogData));
    titleInput.value = "";
    contentInput.value = "";
    imageInput.value = "";
    renderBlogs();
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = () => savePost(reader.result);
    reader.readAsDataURL(imageFile);
  } else {
    savePost();
  }
});

window.editBlog = function(index) {
  const entry = blogData[index];
  titleInput.value = entry.title;
  contentInput.value = entry.content;
  postBtn.dataset.editing = index;
  postBtn.textContent = "Update";
};

window.deleteBlog = function(index) {
  if (confirm("Delete this blog post?")) {
    blogData.splice(index, 1);
    localStorage.setItem("blogPosts", JSON.stringify(blogData));
    renderBlogs();
  }
};

renderBlogs();

function renderBlogs() {
  blogList.innerHTML = "";
  blogData.forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "blog-entry";

    const date = new Date(entry.timestamp).toLocaleString();

    div.innerHTML = `
      <h3>${entry.title}</h3>
      <div class="entry-meta">${date}</div>
      <p>${entry.content}</p>
      ${entry.image ? `<img src="${entry.image}" alt="Blog Image">` : ""}
      <button onclick="editBlog(${index})">Edit</button>
      <button onclick="deleteBlog(${index})">Delete</button>

      <div class="comment-section">
        <h4>Comments</h4>
        <div class="comment-list" id="comments-${index}"></div>
        <input type="text" id="name-${index}" placeholder="Your name">
        <textarea id="comment-${index}" placeholder="Write a comment"></textarea>
        <button onclick="postComment(${index})">Post Comment</button>
      </div>
    `;
    blogList.appendChild(div);
    renderComments(index);
  });
}

function postComment(index) {
  const name = document.getElementById(`name-${index}`).value.trim();
  const text = document.getElementById(`comment-${index}`).value.trim();

  if (!text) return;

  const comments = JSON.parse(localStorage.getItem(`comments-${index}`) || "[]");
  comments.push({
    name: name || "Anonymous",
    text,
    date: new Date().toLocaleString()
  });
  localStorage.setItem(`comments-${index}`, JSON.stringify(comments));
  document.getElementById(`name-${index}`).value = "";
  document.getElementById(`comment-${index}`).value = "";
  renderComments(index);
}

function renderComments(index) {
  const comments = JSON.parse(localStorage.getItem(`comments-${index}`) || "[]");
  const list = document.getElementById(`comments-${index}`);
  list.innerHTML = "";
  comments.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `<strong>${c.name}</strong> <span class="comment-date">${c.date}</span><br>${c.text}`;
    list.appendChild(div);
  });
}
function renderComments(index) {
  const comments = JSON.parse(localStorage.getItem(`comments-${index}`) || "[]");
  const list = document.getElementById(`comments-${index}`);
  list.innerHTML = "";
  comments.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <strong>${c.name}</strong> <span class="comment-date">${c.date}</span><br>
      ${c.text}
      <button class="delete-comment" onclick="deleteComment(${index}, ${i})">Delete</button>
    `;
    list.appendChild(div);
  });
}
function deleteComment(blogIndex, commentIndex) {
  const comments = JSON.parse(localStorage.getItem(`comments-${blogIndex}`) || "[]");
  comments.splice(commentIndex, 1); // 1つだけ削除
  localStorage.setItem(`comments-${blogIndex}`, JSON.stringify(comments));
  renderComments(blogIndex);
}
