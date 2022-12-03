// auto tying script 
var typed = new Typed(".typing",
    {
        strings: ["", "Web Designer", "Software Developer", "Full Stack Web Developer"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });


// asise 
const nav = document.querySelector(".nav"),
    navList = document.querySelectorAll("li"),
    totalNavList = navList.length,
    allSection = document.querySelectorAll(".section"),
    totalSection = allSection.length;
for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    a.addEventListener("click", function () {
        removeBackSection();
        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector("a").classList.contains("active")) {
                //allSection[j].classList.add("back-section");
                addBackSection(j);
            }
            navList[j].querySelector("a").classList.remove("active");
        }
        this.classList.add("active");
        showSection(this);
        if(window.innerWidth < 1200)
        {
            aisdeSectionTogglerBtn();
        }
    })
}
function removeBackSection()
{
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("back-section");
    }
}
function addBackSection(j)
{
    allSection[j].classList.add("back-section");
}
function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("active");
    }
    const target = element.getAttribute("href").split("#")[1];
    document.querySelector("#" + target).classList.add("active");
}

//hire btn working functionality
function updateNav(element)
{
    for(let i=0;i<totalNavList;i++)
    {
        navList[i].querySelector("a").classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if(target===navList[i].querySelector("a").getAttribute("href").split("#")[1])
        {
            navList[i].querySelector("a").classList.add("active");
        }

    }
}
document.querySelector(".hire-me").addEventListener("click",function()
{
    const sectionIndex=this.getAttribute("data-section-index");
    showSection(this);
    updateNav(this);
    addBackSection(sectionIndex);
    removeBackSection();
});
// toggler button 
const navTogglerBtn=document.querySelector(".nav-toggler"),
    aside=document.querySelector(".aside");
    navTogglerBtn.addEventListener("click",()=>
    {
        aisdeSectionTogglerBtn();
    });
    function aisdeSectionTogglerBtn()
    {
        aside.classList.toggle("open");
        navTogglerBtn.classList.toggle("open");
        for(let i=0;i<totalSection;i++)
        {
            allSection[i].classList.toggle("open");
        }
    }
    