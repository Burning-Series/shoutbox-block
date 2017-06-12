// ==UserScript==
// @name         block user script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bs.to/
// @grant        none
// donationsURL paypal.me/JonathanHeindl :3
// ==/UserScript==
var L = {
    s: function setLS(identifier, element, log = 1) {
        localStorage.setItem("tampermonkey_" + identifier, JSON.stringify(element));
    },
    g: function getLS(identifier, standard = new Array(0), log = 1) {
        var element = JSON.parse(localStorage.getItem("tampermonkey_" + identifier));
        if (element === null) {
            element = JSON.parse(localStorage.getItem(identifier));
            if (element !== null) {
                this.s(identifier, element);
                localStorage.removeItem(identifier);
                try {
                    localStorage.removeItem("checking");
                } catch (e) {
                }
            }
        }
        if (element === null) {
            this.s(identifier, standard);
            return standard;
        }
        return element;
    },
    p: function pushSS(identifier, object, standard) {
        var ar = this.g(identifier, standard);
        if (ar.constructor.name === "Array") {
            ar.push(object);
            this.s(identifier, ar);
        } else {
            return null;
        }
    },
};
function createblockedButton(shoutboxcontainer){
    var blockedBtn=document.createElement("button");
    blockedBtn.innerText="blockedUsers";
    blockedBtn.style.marginLeft="5px";
    blockedBtn.onclick=function(a,b){
        if(a.target.enabled===undefined){
            a.target.enabled=true;
        }
        a.target.enabled=!a.target.enabled; 
        if(a.target.enabled===true){
            a.target.buttoncontent.remove();
        }else{
            var blockedusers=L.g("blocked_users",new Array(0));
            var background=document.createElement("button");
            background.style.width="150px";
            background.style.position="absolute";
            background.style.height=((blockedusers.length>0?blockedusers.length:1)*20)+20+"px";
            background.style.marginLeft="5px";
            blockedBtn.append(background);
            a.target.buttoncontent=background;
            for(var i=0;i<blockedusers.length;i++){
                var userbtn=document.createElement("button");
                userbtn.innerText=blockedusers[i];
                userbtn.style.position="absolute";
                userbtn.style.height="20px";
                userbtn.style.top=(i*20)+10+"px";
                userbtn.style.left="5px";
                background.appendChild(userbtn);

                var removebtn=document.createElement("button");
                removebtn.user=blockedusers[i];
                removebtn.innerText="X";
                removebtn.style.position="absolute";
                removebtn.style.top=(i*20)+10+"px";
                removebtn.style.height="20px";
                removebtn.style.left=150-20+"px";
                removebtn.backgrnd=background;
                removebtn.onclick=function(btn){
                    var list=L.g("blocked_users",new Array(0));
                    list.remI(list.f(btn.target.user));
                    L.s("blocked_users",list);
                     a.target.enabled=!a.target.enabled;
                    a.target.remove();
                    //a.target.buttoncontent.remove();
                    createblockedButton(shoutboxcontainer);
                };
                background.appendChild(removebtn);
            }

            if(blockedusers.length===0){
                var userbtn0=document.createElement("button");
                userbtn0.innerText="no blocked users";
                userbtn0.style.position="absolute";
                userbtn0.style.height="20px";
                userbtn0.style.top=(0*20)+8+"px";
                userbtn0.style.left="5px";
                background.appendChild(userbtn0);
            }

        }


    };
    shoutboxcontainer.parentElement.previousElementSibling.appendChild(blockedBtn);
}
function addButton(user,shoutboxcontainer){
    var blockBtn=document.createElement("button");
    blockBtn.innerText="block";
    blockBtn.style.position="sticky";
    blockBtn.style.left= "92%";
    blockBtn.onclick=function(a,b){
        var userBlocking=a.target.parentElement.children[0].innerText;
        if(L.g("blocked_users",new Array(0)).f(userBlocking)===-1){
            L.p("blocked_users",userBlocking,new Array(0));
            for(var i=shoutboxcontainer.children.length-2;i>-1;i-=2){
                if(shoutboxcontainer.children[i].children[0].innerText===userBlocking){
                    shoutboxcontainer.children[i+1].remove();
                    shoutboxcontainer.children[i].remove();
                }
            }
        }


    };
    user.appendChild(blockBtn);
    // user.insertBefore(,user.children[1]);

}

(function() {
    'use strict';
    if (!Array.prototype.f) {
        Object.defineProperty(Array.prototype, "remI", {
            enumerable: false,
            value: function (index) {
                for (var i = 0; i < this.length; i++) {
                    if (i > index) {
                        this[i - 1] = this[i];
                    }
                }
                this.length--;
            }
        });
        Object.defineProperty(Array.prototype, "f", {
            enumerable: false,
            value: function findArray(f, equal = false, path = "", first = true) {
                var index = -1;
                for (var i = 0; i < this.length; i++) {
                    if (equal) {
                        if (f === eval("this[i]" + path)) {
                            index = i;
                            if (first) {
                                return index;
                            }
                        }
                    } else {
                        if (f.toString().indexOf(eval("this[i]" + path)) > -1) {
                            index = i;
                            if (first) {
                                return index;
                            }
                        }
                    }
                }
                return index;
            }
        });
    }

    var shoutboxcontainer=document.getElementById("sbPosts");
    if(shoutboxcontainer){
        createblockedButton(shoutboxcontainer);

        var blockedUsersB=L.g("blocked_users",new Array(0));
        for(var i=shoutboxcontainer.children.length-2;i>-1;i-=2){
            var user=shoutboxcontainer.children[i];
            if(blockedUsersB.f(user.children[0].innerText)>-1){
                shoutboxcontainer.children[i+1].remove();
                shoutboxcontainer.children[i].remove();
            }else{
                addButton(user,shoutboxcontainer);
            }
        }
        shoutboxcontainer.addEventListener("DOMNodeInserted",function(a,b){
            if(a.target.localName==="dd"){
                var blockedUsers=L.g("blocked_users",new Array(0));
                var user=a.target.previousElementSibling;
                var message=a.target;
                if(blockedUsers.f(user.children[0].innerText)>-1){
                    message.remove();
                    user.remove();
                }else{
                    addButton(user,shoutboxcontainer);
                }
            }
        });
    }
    // Your code here...
})();