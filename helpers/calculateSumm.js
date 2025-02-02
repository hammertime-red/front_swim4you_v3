function countDistances(formdata){
    let count = 0
    formdata.distances.forEach(el => {
        el.distances.forEach(item => {
            if(item.id){
                count++
            }
        })
    })
    return count
}

function countRelayRaces(formdata){
    let count = 0
    formdata.relay_races.forEach(el => {
        if(el.quantity > 0){
            count = count + el.quantity
        }
    })
    return count
}

/* function summ(formdata){
    if(!formdata) return null;

    let summ = 0
    summ += countDistances(formdata) * formdata.entry_fee
    summ += countRelayRaces(formdata) * formdata.entry_fee

    let extra_items = formdata.extra_items
    if(extra_items.length > 0){
        extra_items.forEach(item => {
            summ += item.quantity * parseInt(item.price)
        })
    }
    return summ
} */

function distancesOrderList(formdata){
    let distances = [];
    formdata.items.forEach(item => {
        distances.push(...item.distances)
    })

    return _.chain(distances)
        .groupBy(item => {
            return item.distance +'-'+ item.count
        })
        .map(value => ({ distance: value[0].distance, count: value[0].count, quantity:value.length, price:value[0].price})).value()
}

function relaysOrderList(formdata){
    let count = 0
    formdata.relay_races.forEach(el => {
        if(el.quantity > 0){
            count = count + el.quantity
        }
    })
    return {
        quantity: count,
        price: formdata.relay_races[0] ? formdata.relay_races[0].price : 0
    }
}

function summ(formdata){
    let summ = 0
    let distances = distancesOrderList(formdata)
    let relays = relaysOrderList(formdata)
    if(distances.length > 0){
        distances.forEach(item => {
            summ += item.quantity * parseInt(item.price)
        })
    }

    summ += relays.quantity * relays.price

    if(formdata.extra_items.length > 0){
        formdata.extra_items.forEach(item => {
            summ += item.quantity * parseInt(item.price)
        })
    }
    return summ
}

export default summ