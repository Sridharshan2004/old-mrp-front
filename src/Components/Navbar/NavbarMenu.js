import dataService from "../../Service/dataService"

const menuSuperAdmin = [
    {
        to: '/dashboard',
        icon: 'fas fa-dashboard',
        name: 'Dashboard'
    },
    {
        to: '/sell',
        icon: 'fas fa-shop',
        name: 'Sell'
    },
    {
        to: '/manufacturingorders',
        icon: 'fas fa-industry',
        name : 'Make'
    },
    {
        to: '/purchases',
        icon: 'fas fa-cart-shopping',
        name: 'Buy'
    },
    {
        to: '/stock',
        icon: 'fas fa-cubes',
        name: 'Stock'
    },
    {
        to: '/items',
        icon: 'fas fa-box',
        name: 'Items'
    },
    {
        to: '/contact',
        icon: 'fas fa-user',
        name: 'Contact'
    },
    {
        to: '/settings',
        icon: 'fas fa-gear',
        name: 'Settings'
    }
]
const admin = [
    {
        to: '/dashboard',
        icon: 'fas fa-tachometer-alt',
        name: 'Dashboard'
    },
    {
        to: '/hotel',
        icon: 'fas fa-hotel',
        name: 'Hotel'
    },
    {
        to: '/image',
        icon: 'fas fa-image',
        name : 'Image'
    }
]
const mananger = [
    {
        to: '/dashboard',
        icon: 'fas fa-tachometer-alt',
        name: 'Dashboard'
    },
    {
        to: '/hotel',
        icon: 'fas fa-hotel',
        name: 'Hotel'
    }
]
const user = [
    {
        to: '/dashboard',
        icon: 'fas fa-tachometer-alt',
        name: 'Dashboard'
    }
]

const menu = () => {

    if(dataService.getRole()=== "SUPER ADMIN") {
        return menuSuperAdmin;
    }
    else if(dataService.getRole()=== "ADMIN") {
        return admin;
    }
    else if(dataService.getRole()=== "MANAGER") {
        return mananger;
    }
    else {
        return user;
    }
}

const findmenu = {
    menu
}

export default findmenu