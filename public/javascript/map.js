let q = document.querySelector("#listlocation")
let lat;
let lon;
if (q != null) {

    let url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${q.innerText}&format=jsonv2&limit=1`;

    const MapInfo = async () => {
        await fetch(url)
            .then(responce => responce.json())
            .then(data => {
                lat = data[0].lat;
                lon = data[0].lon;
                var map = L.map('map').setView([lat,lon], 13);
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                var marker = L.marker([lat,lon]).addTo(map);
                let dextination = `${q.innerText}`

                marker.bindPopup(dextination).openPopup();

            
                function onMapClick(e) {
                    alert("You clicked the map at " + e.latlng);
                }

                map.on('click', onMapClick);
                var popup = L.popup();

                function onMapClick(e) {
                    popup
                        .setLatLng(e.latlng)
                        .setContent("You clicked the map at " + e.latlng.toString())
                        .openOn(map);
                }

                map.on('click', onMapClick);
                console.log(data[0])
            })
            .catch(err => {
                console.log(err)
            })

    }

    MapInfo();



}
