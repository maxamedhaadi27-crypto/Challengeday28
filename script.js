const transactions = [
  {name:"Monthly Salary",category:"Work",date:"Oct 01, 2026",type:"income",amount:5200},
  {name:"Grocery Market",category:"Food",date:"Oct 03, 2026",type:"expense",amount:145.50},
  {name:"Netflix",category:"Entertainment",date:"Oct 04, 2026",type:"expense",amount:18.99},
  {name:"Freelance Project",category:"Work",date:"Oct 05, 2026",type:"income",amount:1650},
  {name:"Electricity Bill",category:"Bills",date:"Oct 06, 2026",type:"expense",amount:84.20},
  {name:"New Sneakers",category:"Shopping",date:"Oct 08, 2026",type:"expense",amount:120},
  {name:"Transport",category:"Travel",date:"Oct 09, 2026",type:"expense",amount:62.40}
];

const goals = [
  {name:"New Laptop",target:2000,saved:1250,icon:"▣"},
  {name:"Emergency Fund",target:5000,saved:3250,icon:"♢"},
  {name:"Vacation",target:3000,saved:1170,icon:"✈"}
];

const money = n => "$" + Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});

function renderTransactions(){
  const body=document.getElementById("transactionBody");
  const search=(document.getElementById("searchInput").value||"").toLowerCase();
  const filter=document.getElementById("filterType").value;
  const data=transactions.filter(t=>(filter==="all"||t.type===filter) && (t.name+" "+t.category).toLowerCase().includes(search));
  body.innerHTML=data.map(t=>`
    <tr>
      <td><div class="tx-name">${t.name}</div><div class="tx-sub">${t.category}</div></td>
      <td>${t.category}</td><td>${t.date}</td>
      <td><span class="type ${t.type}">${t.type}</span></td>
      <td class="amount ${t.type}">${t.type==="income"?"+":"-"}${money(t.amount)}</td>
    </tr>`).join("");
}

function renderGoals(){
  document.getElementById("goalsGrid").innerHTML=goals.map(g=>{
    const percent=Math.min(100,Math.round(g.saved/g.target*100));
    return `<div class="goal-card">
      <div class="goal-top"><div class="goal-icon">${g.icon}</div><span class="goal-percent">${percent}%</span></div>
      <h3>${g.name}</h3><p>Keep saving toward your target</p>
      <div class="progress"><span style="width:${percent}%"></span></div>
      <div class="goal-numbers"><strong>${money(g.saved)}</strong><span>of ${money(g.target)}</span></div>
    </div>`;
  }).join("");
}

function updateSummary(){
  const income=transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense=transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  document.getElementById("income").textContent=money(income);
  document.getElementById("expense").textContent=money(expense);
  document.getElementById("savings").textContent=money(income-expense);
}

function openModal(id){document.getElementById(id).classList.remove("hidden")}
function closeModal(id){document.getElementById(id).classList.add("hidden")}

document.getElementById("addTransactionBtn").onclick=()=>openModal("transactionModal");
document.getElementById("addGoalBtn").onclick=()=>openModal("goalModal");
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));

document.getElementById("transactionForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target);
  transactions.unshift({name:f.get("name"),category:f.get("category"),date:new Date().toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}),type:f.get("type"),amount:Number(f.get("amount"))});
  e.target.reset(); closeModal("transactionModal"); renderTransactions(); updateSummary();
});

document.getElementById("goalForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target);
  goals.unshift({name:f.get("name"),target:Number(f.get("target")),saved:Number(f.get("saved")),icon:"◎"});
  e.target.reset(); closeModal("goalModal"); renderGoals();
});

document.getElementById("searchInput").addEventListener("input",renderTransactions);
document.getElementById("filterType").addEventListener("change",renderTransactions);

const sidebar=document.getElementById("sidebar");
document.getElementById("menuBtn").onclick=()=>sidebar.classList.toggle("open");
document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=>{
  document.querySelectorAll(".nav-link").forEach(x=>x.classList.remove("active"));
  link.classList.add("active"); sidebar.classList.remove("open");
}));

renderTransactions(); renderGoals();
