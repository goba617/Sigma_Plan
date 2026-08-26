console.log("更新1")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { query, orderBy,  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCdhEarcKX1C51IdMHqV-t8Ka7SDM702ss",
  authDomain: "sigma-4eb67.firebaseapp.com",
  projectId: "sigma-4eb67",
  storageBucket: "sigma-4eb67.firebasestorage.app",
  messagingSenderId: "246620482813",
  appId: "1:246620482813:web:6ed3b69f0619654a446294",
  measurementId: "G-3JPVTVEKQ4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let eTitle = document.getElementById("eventTitle");
let eContent = document.getElementById("eventContent");
let newTitle = document.getElementById("changeinfoTitle").value;
let newContent = document.getElementById("changeinfoContent").value;
let moreinfomation = document.getElementById("moreinfoContent").value;

document.getElementById("addEventBtn").addEventListener("click", function() {
    document.getElementById("enterEvent").style.display = "flex";
});

document.getElementById("leaveEventBtn").addEventListener("click", function() {
    document.getElementById("enterEvent").style.display = "none";
});

document.getElementById("leaveChangeinfoBtn").addEventListener("click", function() {
    document.getElementById("changeinfo-modal").style.display = "none";
});
document.getElementById("saveEventBtn").addEventListener("click", async function() {
    eTitle = document.getElementById("eventTitle");
    eContent = document.getElementById("eventContent");

    document.getElementById("enterEvent").style.display = "none";

  const docRef = await addDoc(collection(db, "events"), {
    title: eTitle.value,
    content: eContent.value,
    order: Date.now()
});


    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = docRef.id;
    const title = document.createElement("h2");
    const content = document.createElement("p");
    const moreinfo = document.createElement("p");
    const finish = document.createElement("input");
    finish.type = "checkbox";
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "選個顏色:D";
    const cardColor = document.createElement("input");
    cardColor.type = "color";
    const changeinfo = document.createElement("button");
    changeinfo.textContent = "改些資訊";
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "刪除";
    removeBtn.addEventListener("click", async function() {
      if (card.dataset.id) {
        await deleteDoc(doc(db, "events", card.dataset.id));
    }
        card.remove();
    },{ once: true });

changeinfo.addEventListener("click", function() {
  document.getElementById("changeinfo-modal").style.display = "flex";
  document.getElementById("changeinfoTitle").value = title.textContent;
  document.getElementById("changeinfoContent").value = content.textContent;

  const saveBtn = document.getElementById("saveChangeinfoBtn");
  saveBtn.addEventListener("click",  async function() {

    const newTitle = document.getElementById("changeinfoTitle").value;
    const newContent = document.getElementById("changeinfoContent").value;
    const moreinfomation = document.getElementById("moreinfoContent").value;

    if (card.dataset.id) {
    await updateDoc(doc(db, "events", card.dataset.id), {
        title: newTitle,
        content: newContent,
        moreinfo: moreinfomation
    });
  }
    title.textContent = newTitle;
    content.textContent = newContent;
    moreinfo.textContent = "補充: " + moreinfomation;

    document.getElementById("changeinfo-modal").style.display = "none";
  }, { once: true });
});
    cardColor.addEventListener("input", function() {
        card.style.backgroundColor = cardColor.value;
    });

    title.textContent = eTitle.value;
    content.textContent = eContent.value;
    moreinfo.textContent = "More info: ";
    cardColor.value = "#ffffff";

    card.appendChild(title);
    card.appendChild(content);
    card.appendChild(moreinfo);
    card.appendChild(finish);
    colorLabel.appendChild(cardColor);
    card.appendChild(colorLabel);
    card.appendChild(changeinfo);
    card.appendChild(removeBtn);

    document.getElementById("allText").appendChild(card);


});
async function loadData() {
  const q = query(collection(db, "events"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        
        // 直接在這裡產生卡片 DOM
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.id = docSnap.id; // 綁定雲端 ID

        const title = document.createElement("h2");
        const content = document.createElement("p");
        const moreinfo = document.createElement("p");
        const finish = document.createElement("input");
        finish.type = "checkbox";
        const colorLabel = document.createElement("label");
        colorLabel.textContent = "選個顏色:D";
        const cardColor = document.createElement("input");
        cardColor.type = "color";
        
        const changeinfo = document.createElement("button");
        changeinfo.textContent = "改些資訊";
        
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "刪除";
        
        removeBtn.addEventListener("click", async function() {
            if (card.dataset.id) {
                await deleteDoc(doc(db, "events", card.dataset.id));
            }
            card.remove();
        }, { once: true });

        changeinfo.addEventListener("click", function() {
            document.getElementById("changeinfo-modal").style.display = "flex";
            document.getElementById("changeinfoTitle").value = title.textContent;
            document.getElementById("changeinfoContent").value = content.textContent;

            const saveBtn = document.getElementById("saveChangeinfoBtn");
            saveBtn.addEventListener("click", async function() {
                const newTitle = document.getElementById("changeinfoTitle").value;
                const newContent = document.getElementById("changeinfoContent").value;
                const moreinfomation = document.getElementById("moreinfoContent").value;

                if (card.dataset.id) {
                    await updateDoc(doc(db, "events", card.dataset.id), {
                        title: newTitle,
                        content: newContent,
                        moreinfo: moreinfomation
                    });
                }
                title.textContent = newTitle;
                content.textContent = newContent;
                moreinfo.textContent = "補充: " + moreinfomation;

                document.getElementById("changeinfo-modal").style.display = "none";
            }, { once: true });
        });

        cardColor.addEventListener("input", function() {
            card.style.backgroundColor = cardColor.value;
        });

        // 將抓下來的資料填入卡片中
        title.textContent = data.title;
        content.textContent = data.content;
        moreinfo.textContent = data.moreinfo ? "補充: " + data.moreinfo : "More info: ";
        cardColor.value = "#ffffff";

        card.appendChild(title);
        card.appendChild(content);
        card.appendChild(moreinfo);
        card.appendChild(finish);
        colorLabel.appendChild(cardColor);
        card.appendChild(colorLabel);
        card.appendChild(changeinfo);
        card.appendChild(removeBtn);

        document.getElementById("allText").appendChild(card);
    });
}

loadData();

const container = document.getElementById("allText");
new Sortable(container, {
    animation: 150,
    onEnd: async function () {
        const cards = container.querySelectorAll(".card");

        cards.forEach(async (cardEl, index) => {
            if (cardEl.dataset.id) {
                await updateDoc(doc(db, "events", cardEl.dataset.id), {
                    order: index 
                });
            }
        });
    }
});
