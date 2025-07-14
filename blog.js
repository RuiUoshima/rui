<script>
  import {
    initializeApp
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

  // 🔐 自分の Firebase 設定を使って書き換えてください
  const firebaseConfig = {
    apiKey: "AIzaSyB5mzne8udXUBHfTRs2FOGSXLFVLtuP6-A",
    authDomain: "myhomepage-79e04.firebaseapp.com",
    projectId: "myhomepage-79e04",
    storageBucket: "myhomepage-79e04.appspot.com",
    messagingSenderId: "534104786677",
    appId: "1:534104786677:web:4825f0357d37b5b160a7bc"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const postBtn = document.getElementById("post-blog");
  const titleInput = document.getElementById("blog-title");
  const contentInput = document.getElementById("blog-content");
  const imageInput = document.getElementById("blog-image");
  const blogList = document.getElementById("blog-list");

  // 投稿処理
  postBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!title || !content) return;

    let imageUrl = null;

    if (imageFile) {
      const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    await addDoc(collection(db, "blogs"), {
      title,
      content,
      image: imageUrl,
      timestamp: serverTimestamp()
    });

    titleInput.value = "";
    contentInput.value = "";
    imageInput.value = "";
  });

  // リアルタイム表示
  const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    blogList.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.timestamp?.toDate().toLocaleString() || "Loading...";

      const div = document.createElement("div");
      div.className = "blog-entry";
      div.innerHTML = `
        <h3>${data.title}</h3>
        <div class="entry-meta">${date}</div>
        <p>${data.content}</p>
        ${data.image ? `<img src="${data.image}" alt="Blog Image" style="max-width: 200px; border-radius: 10px;">` : ""}
        <hr>
      `;
      blogList.appendChild(div);
    });
  });
</script>
