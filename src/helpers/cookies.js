// Get cookie from string: document.cookie == 'cookie1=value; cookie2=value;'
const getCookie = cname => {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie); // Decode document.cookie to handle cookies with special characters, e.g. '$'
    let cookieArray = decodedCookie.split(';');
    // Loop through cookieArray and read each cookie
    for (let i = 0; i < cookieArray.length; i++) {
        let c = cookieArray[i];
        while (c.charAt(0) === ' ') { c = c.substring(1); }
        // If cookie is found, return the cookie value
        if (c.indexOf(name) === 0) { return c.substring(name.length, c.length); }
    }
    // Cookie not found, return empty string
    return '';
};

// Delete cookie by setting expires parameter to past date (NOTE: Cookie value does not have to be specified)
const deleteCookie = cname => {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; path=/';
}

export { getCookie, deleteCookie };