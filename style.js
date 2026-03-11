const searchBotton = document.getElementById('searchBtn')
const counter = document.getElementById('counter');
//array level html convert function
function createLabels(labels) {

    const labelHTML = labels.map(label => {
        return `
        <span class="px-2 py-1 bg-yellow-200 border border-red-200 rounded-full text-xs font-semibold">
            ${label}
        </span>
        `;
    });

    return labelHTML.join("");

}

// sppiner function
const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("allCardSection").classList.add("hidden");
    } else {
        document.getElementById("allCardSection").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
};


//active removed function
function removed() {
    const allBtn = document.querySelectorAll('.btn')
    allBtn.forEach(btn => {
        btn.classList.remove('active')
    })

}
let allIssues = [];

//toggle function
function toggle(id) {
    removed()
    document.getElementById(id).classList.add('active');

    manageSpinner(true);
    if (id === 'all') {
        allDataShow(allIssues)
        counter.innerText = allIssues.length;
        searchBotton.classList.add('active')
    }

    else {

        const filtered = allIssues.filter(
            issue => issue.status === id
        );
        counter.innerText = filtered.length;
        searchBotton.classList.add('active')
        allDataShow(filtered);

    }
}


//fetch functions
function allDataLoad() {
    manageSpinner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(data => {
            allDataShow(data.data);
            allIssues = data.data;
            counter.innerHTML = allIssues.length;
        });
}

function showModal(id) {
    manageSpinner(true)
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(result => {
            const data = result.data
            const modal = document.getElementById('allCard');
            modal.querySelector('.modal-box').innerHTML = `
        <h1 class="text-2xl font-bold text-[#1F2937] mb-2">${data.title}</h1>
        
        <div class="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <span class="badge badge-success text-white">${data.status}</span>
            <span> Opened by ${data.author}</span>
            <span> ${new Date(data.createdAt).toLocaleDateString()}</span>
        </div>

        <div class="flex gap-2 mb-6">
            ${createLabels(data.labels)}
        </div>

        <p class="text-[#64748B] mb-8">${data.description}</p>

        <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center mb-6">
            <div>
                <p class="text-xs text-gray-400">Assignee:</p>
                <p class="font-semibold">${data.assignee || 'Not Assigned'}</p>
            </div>
            <div class="text-right">
                <p class="text-xs text-gray-400">Priority:</p>
                <span class="badge badge-error uppercase font-bold">${data.priority}</span>
            </div>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-primary bg-[#6366F1] border-none px-8 text-white">Close</button>
            </form>
        </div>
    `;
            modal.showModal();
            manageSpinner(false)
        })
}

// all data show function
function allDataShow(alldata) {

    const allCardSection = document.getElementById('allCardSection')
    allCardSection.innerHTML = ''

    alldata.forEach(data => {
        console.log(data);
        const borderColor =
            data.status === "open"
                ? "border-t-4 border-[#00A96E]"
                : "border-t-4 border-[#A855F7]";
        const div = document.createElement('div')
        div.className = `p-5 bg-white rounded shadow ${borderColor}`
        div.onclick = () => {
            showModal(data.id)
        }
        div.innerHTML = `
          <div class="flex justify-between items-center mb-4">
                    <img src="./assets/Open-Status.png" alt="">
                    <div class="badge badge-soft rounded-full badge-error">${data.priority}</div>
                </div>
                <h2 class="font-semibold text-[#1F2937]">${data.title}</h2>
                <p class="text-[#64748B] line-clamp-2 text-[12px] my-2">${data.description}</p>

               <div class="flex gap-2 mb-5 flex-wrap">
               ${createLabels(data.labels)}
               </div>
    <div class="space-y-2 text-[12px] text-[#64748B] border-t pt-3">
        <div class="flex justify-between items-center">
            <span class="font-medium">#1 by ${data.author}</span>
            <span>${new Date(data.createdAt).toLocaleDateString()}</span>
        </div>

        <div class="flex justify-between items-center">
            <span class="font-medium">Assignee: ${data.assignee}</span>
            <span class="text-[10px]">Updated: ${new Date(data.updatedAt).toLocaleDateString()}</span>
        </div>
    </div>

</div>

        `
        allCardSection.appendChild(div)
    });
    manageSpinner(false);
}
allDataLoad();



// data search and show card function
const searchBtn = document.getElementById('searchBtn').addEventListener('click', function () {

    const inputSearch = document.getElementById('input-search');
    const searchValue = inputSearch.value.trim().toLowerCase();
    console.log(searchValue);

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            const all = data.data;
            counter.innerText = all.length;
            allDataShow(all);
        });

})