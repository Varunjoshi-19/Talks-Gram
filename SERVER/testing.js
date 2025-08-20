const map = new Map();

map.set(1 , {seenCount : 0})
map.set(2 , {seenCount : 0})
map.set(3 , {seenCount : 0})
map.set(4 , {seenCount : 0})


const data = [
{userId : 2},{userId : 3},{userId : 3}
,{userId : 2},{userId : 4},{userId : 3},
{userId : 2},{userId : 1},{userId : 1},
{userId : 2},{userId : 3},{userId : 2}



];


data.forEach(each =>  {
     if(map.has(each.userId)) {
         const user = map.get(each.userId);
         user.seenCount++;
     }
})

console.log(map);