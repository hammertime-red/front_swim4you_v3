export interface Distance {
    distance_id: number | undefined
    entrytime: string
    is_system_entrytime: boolean
    key: string
    reservation_status: string
    is_payed: boolean
}

export interface Athlete {
    athlete_id: number | undefined
    is_online_request: boolean
    distances: Distance[]
}

export const defaultDistance: Distance = {
    distance_id: undefined,
    entrytime: '',
    is_system_entrytime: false,
    key: '',
    reservation_status: 'not_reserved',
    is_payed: false,
}

export const defaultAthlete: Athlete = {
    athlete_id: undefined,
    is_online_request: false,
    distances: [defaultDistance]
}