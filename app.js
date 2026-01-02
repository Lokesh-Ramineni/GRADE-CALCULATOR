let openGPA = function() {
    let gpaSection = document.querySelector('.main.gpa');
    gpaSection.id="section";
    let cgpaSection=document.querySelector('.main.cgpa');
    cgpaSection.id='';  
    let estimatesection=document.querySelector('.main.Estimate');
    estimatesection.id='';
    localStorage.setItem('activeSection', 'gpa');
}
let openCGPA = function() {
    let gpaSection = document.querySelector('.main.cgpa');
    gpaSection.id="section";
    let gpasection=document.querySelector('.main.gpa');
    gpasection.id='';
    let estimatesection=document.querySelector('.main.Estimate');
    estimatesection.id='';
    localStorage.setItem('activeSection', 'cgpa');

}
let openESTIMATE=function(){
    let estimatesection=document.querySelector('.main.Estimate');
    estimatesection.id='section';
    let cgpasection=document.querySelector('.main.cgpa')
    cgpasection.id='';
    let gpasection=document.querySelector('.main.gpa');
    gpasection.id='';
    localStorage.setItem('activeSection', 'Estimate');
}
// Initial Setup && local storage
document.addEventListener('DOMContentLoaded', () => {
    const activeSection = localStorage.getItem('activeSection');
    addcourse();   // 👈 adds the first course row automatically
    if (activeSection === 'cgpa') {
        openCGPA();
    }
    else if(activeSection === 'gpa'){
        openGPA();
    }
    else{
        openESTIMATE();
    }

});

//side nav bar
function toogle() {
    const nav = document.querySelector('.nav');
    nav.classList.add('active');
}
function toogleun() {
    const nav = document.querySelector('.nav');
    nav.classList.remove('active');
}

// Add Functionality
let toreset=[];
let addcourse = function() {
        let courseContainer = document.querySelector('.course-section');
        let newCourse = document.querySelector('.enter.template');
        let newcourse1=newCourse.cloneNode(true);
        newcourse1.classList.remove('template');
        newcourse1.querySelector('.course-name').value = '';
        newcourse1.querySelector('.course-credits').value = '';
        newcourse1.querySelector('.course-grade').value = '';
        let deleteBtn = document.querySelector('.dontdelete');
        deleteBtn.classList.add('delete');
        newCourse.classList.add('resets');
        courseContainer.appendChild(newcourse1);
        toreset.push(1);
        console.log(toreset);
}

let addsemester = function() {
    let courseContainer = document.querySelector('.semesters-section');
    let newsem = document.querySelector('.enter.news');
    let newsem1=newsem.cloneNode(true);
    newsem1.classList.remove('news');
    newsem1.querySelector('.sem-name').value = '';
    newsem1.querySelector('.sem-credits').value = '';
    newsem1.querySelector('.sem-gpa').value = '';
    newsem1.querySelector('.dontdelete1').classList.add('delete1');
    courseContainer.appendChild(newsem1); 
}
// Delete Functionality
const courseSection = document.querySelector('.course-section');
    courseSection.addEventListener('click', function (event) {
    if (event.target.closest('.delete')) {
        event.target.closest('.enter').remove();
    }
});
const semestersSection = document.querySelector('.semesters-section');
    semestersSection.addEventListener('click', function (event) {
        //const deleteBtn = event.target.closest('.delete1');
        if(event.target.closest('.delete1'  ) ){
            event.target.closest('.enter').remove();
        }
        
});
// if (!deleteBtn) return; // Exit if the clicked element is not a delete button
//             const row=event.target.closest('.enter');
//             if(!row) return; // Exit if no row found
//             row.remove();
// GPA Calculation
let calculateGPA = function() {
    let course_credits=document.querySelectorAll('.course-credits');
    let course_grades=document.querySelectorAll('.course-grade');
    let creditsarray = [];
    let gradesarray = [];
    for(let i=0;i<course_credits.length;i++){
        creditsarray.push(Number(course_credits[i].value));
        gradesarray.push(course_grades[i].value);
    }
    console.log(creditsarray);
    console.log(gradesarray);
    let pointsarray = [];
    let sum = 0;
    let totalCredits = 0;
    function gradeToPoint() {
        for(let i=0;i<gradesarray.length;i++){
            if(gradesarray[i]==='s'){
                pointsarray.push(10);
            }
            else if(gradesarray[i]=='a'){
                pointsarray.push(9);
            }
            else if(gradesarray[i]=='b'){
                pointsarray.push(8);
            }
            else if(gradesarray[i]=='c'){
                pointsarray.push(7);
            }
            else if(gradesarray[i]=='d'){
                pointsarray.push(6);
            }
            else if(gradesarray[i]=='e'){
                pointsarray.push(5);
            }
            else if(gradesarray[i]=='f'){
                pointsarray.push(0);
            }
            else{
                pointsarray.push(0);
            }
            sum += creditsarray[i] * pointsarray[i];
            totalCredits += creditsarray[i];
        }
        return (sum / totalCredits).toFixed(2);
    }
    return gradeToPoint();
}
let calculatecgpa=function(){
    let semcredits=document.querySelectorAll('.sem-credits');
    let semgpa=document.querySelectorAll('.sem-gpa');
    let creditsarray=[];
    let gpaarray=[];
    for(let i=0;i<semcredits.length;i++){
        creditsarray.push(Number(semcredits[i].value));
        gpaarray.push(Number(semgpa[i].value));
    }
    let sum=0;
    let credits=0;
    for(let i=0;i<semcredits.length;i++){
        sum+=creditsarray[i]*gpaarray[i];
        credits+=creditsarray[i];
    }
    return (sum/credits).toFixed(2);
}
let calculateESTIMATE= function(){
    let currentsemgpa=Number(document.getElementById('two').value);
    let currentsemcredits=Number(document.getElementById('three').value);
    let targetcgpa=Number(document.getElementById('four').value);
    let upcomingcredits=Number(document.getElementById('five').value);
    return ((targetcgpa*(upcomingcredits + currentsemcredits) - currentsemgpa*currentsemcredits)/upcomingcredits).toFixed(2);
}
// Reset
let reset =function(){
     let currentsemgpa=document.getElementById('two');
    let currentsemcredits=document.getElementById('three');
    let targetcgpa=document.getElementById('four');
    let upcomingcredits=document.getElementById('five');
    currentsemgpa.value='';
    currentsemcredits.value='';
    targetcgpa.value='';
    upcomingcredits.value='';
}
let resetgpa=function(){
    let newcourse1=document.querySelector('.course-section');
    newcourse1.querySelectorAll('input').forEach((input) =>{
        input.value='';
    })
    newcourse1.querySelectorAll('select').forEach(select =>{
        select.value='';
    })
}
// Display GPA,CGPA
let CalculateGPA = function() {
    //let gpa_result = document.getElementsByClassName('calculate-gpa')[0];
    let displayGPA =calculateGPA();
    let heading = document.querySelector('.gpa-result');
    if(displayGPA!="NaN"){
        heading.innerText = "Your GPA: " +displayGPA;
    }  
    else{
        heading.innerText = "Your GPA: 0.00";
    }   
}

let calculateCGPA=function(){
    let displayCgpa=calculatecgpa();
    let heading=document.querySelector(".cgpa-result");
    if(displayCgpa!=NaN){
        heading.innerText=`Your CGPA: ${displayCgpa}`;
    }
    else{
        heading.innerText = "Your CGPA: 0.00";
    }
}
let calculateEstimate = function(){
    let estimate=document.querySelector('.cgpa-estimate');
    let check=calculateESTIMATE();
    if(check <= 10){
        estimate.innerText=`Required CGPA: ${check}`;
    }
    else{
        estimate.innerText=`You missed,try next time`;
    }
   
}


