import { browser } from "$app/environment";
let isMobileView = $state(false);

export function getIsMobileView(){
    return isMobileView;
}

const onresize = ()=>{
    isMobileView = window.innerWidth<=768;
}

if (browser){
    isMobileView = window.innerWidth<=768;
    window.addEventListener('resize',onresize);
}