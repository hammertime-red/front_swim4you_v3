export const distanceTemplate = {
    key: null,
    id: null,
    distance_id: null,
    entrytime: null,
    id_system_entrytime: false,
    is_payed: false,
    reservation_status: 'not_reserved'
}

export const itemTemplate = {
    athlete_id: null,
    online_request: false,
    distances: [
        {...distanceTemplate}
    ],
}

export const extraItemTemplate = {
    order_extra_item_id: null,
    extra_service_id: null,
    quantity: 1,
    athlete_id: null,
    distance_id: null,
    key: null,
}

export const relayItemTemplate = {
    order_item_id: null,
    key: null,
    distance_id: null,
    quantity: 1,
}

