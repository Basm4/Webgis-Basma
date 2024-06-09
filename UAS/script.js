// // 1. Menambahkan Elemen Dasar Peta Pada Halaman HTML
    // 1.1 Membuat Variabel Peta dan Melakukan Set View Halaman Peta di Lokasi Tertentu
    const map = L.map('map')
    map.setView([-7.675, 110.380], 13);
    // 1.2 Menambahkan Basemap OSM
    const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
    // 1.3 Menambahkan Basemap OSM HOT
    const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'}).addTo(map);
    // 1.4 Menambahkan Basemap Google
    const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
        subdomains:['mt0','mt1','mt2','mt3']});
    // 1.5 Menambahkan Fitur Fullscreen Peta
    map.addControl(new L.Control.Fullscreen());
    // 1.6 Menambahkan Tombol Home (Zoom to Extent)
    const home = {
        lat: -7.675,
        lng: 110.380,
        zoom: 12
    };
    L.easyButton('fa-home', function (btn, map) {
        map.setView([home.lat, home.lng], home.zoom);
    }, 'Zoom To Home').addTo(map)
    // 1.7 Menambahkan Fitur My Location
    map.addControl( 
        L.control.locate({
            locateOptions: {
                enableHighAccuracy: true
            }
        })
    );
// 2. Menambahkan Data Spasial Pada WebGIS
    // 2.1 Data Sebaran Jembatan (Point)
        // 2.1.1 Pengaturan Symbology Point
        var symbologyPoint = {
            radius: 5,
            fillColor: "#9dfc03",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }
        // 2.1.2 Pemanggilan Data Jembatan
        const barakPT = new L.LayerGroup();
        $.getJSON("./asset/data-spasial/barak_pengungsian_pt.json", function (OBJECTID) {
            L.geoJSON(OBJECTID, {
                    pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, symbologyPoint);}
                }).addTo(barakPT);
            });
        barakPT.addTo(map); // Apabila tidak dibutuhkan jadikan komen saja
    // 2.2 Data Batas Administrasi (Line)
        const adminKelurahanAR = new L.LayerGroup();
        $.getJSON("./asset/data-spasial/batas_admin_ar.geojson", function (OBJECTID) {
            L.geoJSON(OBJECTID, {
                style: {
                    color : "black",
                    weight : 0.5,
                    opacity : 1,
                    dashArray: '3,3,20,3,20,3,20,3,20,3,20',
                    lineJoin: 'round'
                }
            }).addTo(adminKelurahanAR);
        });
        adminKelurahanAR.addTo(map); // Apabila tidak dibutuhkan jadikan komen saja
    // Menambahkan data rute jalan mitigasi
    const jalurEvakuasi = new L.LayerGroup();
    $.getJSON("./asset/data-spasial/jalur_evakuasi_ln.geojson", function (OBJECTID) {
       L.geoJSON(OBJECTID, {
            style: {
                color : "#00FF00",
                weight : 2,
                opacity : 1,
                lineJoin: 'round'
            }
        }).addTo(jalurEvakuasi);
    });
    jalurEvakuasi.addTo(map);
        // // Menambahkan Data Jarak Letusan Merapi

    // 2.3 Data Tutupan Lahan (Polygon)
        const landcover = new L.LayerGroup();
        // // 2.3.1 Contoh Penggunaan Saat Klasifikasi Didasarkan Pada Kategori Tutupan Lahan
        // $.getJSON("./asset/data-spasial/KRB_Sleman_ar.json", function (REMARK) {
        //     L.geoJson(REMARK).addTo(landcover);
        //     });
        // 2.3.2 Contoh Penggunaan Saat Klasifikasi Didasarkan Pada Kategori Tutupan Lahan
        // $.getJSON("./asset/data-spasial/KRB_Sleman_ar.geojson", function (REMARK) {
        //     L.geoJson(REMARK, {
        //         style: function (feature) {
        //             switch (feature.properties.REMARK) {
        //                 case '1': return { fillColor: "#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
        //                 case '2': return { fillColor: "#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
        //                 case '3': return { fillColor: "#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
        //             }
        //         },

                // onEachFeature: function (feature, layer) {
                //     layer.bindPopup('<b>Tutupan Lahan: </b>' + feature.properties.REMARK)
                // }

        // 2.3.3 Contoh Penggunaan Saat Klasifikasi Didasarkan Pada Kuantitas Data, contoh pada script ini, rentang dari Object ID
        $.getJSON("./asset/data-spasial/KRB_Sleman_ar.json", function (gridcode) {
            L.geoJson(gridcode, {
                style: function (feature) {
                    var fillColor, gridcode = feature.properties.gridcode;
                    var colorMap = {
                        '1': '#FFFF00',
                        '2': '#FF7F00',
                        '3': '#FF0000'
                      };
                      fillColor = colorMap[Math.floor(gridcode)];
                    return { color: "#999", weight: 0, fillColor: fillColor, fillOpacity: 0.9 };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('<b>Wilayah KRB: </b>' + feature.properties.gridcode)
                }

            }).addTo(landcover);
        });
        landcover.addTo(map); // Apabila tidak dibutuhkan jadikan komen saja

//         // // 2.4 Pemanggilan Data URL Eksternal (Contoh disini bentuk point)
//         // const dataTambahan = new L.LayerGroup();
//         // $.getJSON("http://geoportal.jatengprov.go.id/geoserver/wms?service=WFS&version=1.0.0&request=GetFeature&typeName=ADMIN:lokasi_wisata_di_jawa_tengah_330020220808100109&outputFormat=application/json", function (namaobj) {
//         //     L.geoJSON(namaobj, {
//         //             pointToLayer: function (feature, latlng) {
//         //             return L.circleMarker(latlng, symbologyPoint);}
//         //         }).addTo(dataTambahan);
//         //     });
//         // dataTambahan.addTo(map); // Apabila tidak dibutuhkan jadikan komen saja

// 3. Membuat Layer Control
    // 3.1 Basemap
    const baseMaps = {
        "Openstreetmap" : basemapOSM,
        "OSM HOT" : osmHOT,
        "Google" : baseMapGoogle
    };

    // 3.2 Layer Data GEOJSON
    const overlayMaps = {
        "Batas Administrasi" : adminKelurahanAR,
        "KRB 1-3": landcover,
        "Jalur Evakuasi": jalurEvakuasi,
        "Tempat Pengungsian" : barakPT
        // "Contoh Data URL Eksternal": dataTambahan
    };

    // 3.3 Memanggil Fungsi Layer Control
    L.control.layers(baseMaps,overlayMaps).addTo(map);

    // 3.4 Menambahkan Legenda Pada Peta
    let legend = L.control({ position: "topright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML =
            // Judul Legenda
            '<p style= "font-size: 18px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Legenda</p>' +
            '<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Infrastruktur</p>' +
            '<div><svg style="display:block;margin:auto;text-align:center;stroke-width:1;stroke:rgb(0,0,0);"><circle cx="15" cy="8" r="5" fill="#9dfc03" /></svg></div>Tempat Pengungsian<br>' +
            // Legenda Layer Batas Administrasi
            '<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Batas Administrasi</p>'+
            '<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:rgb(0,0,0);stroke-dasharray:10 1 1 1 1 1 1 1 1 1"/></svg></div>Batas Desa/Kelurahan<br>'+
            // Legenda Layer Jalan Evakuasi
            '<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Jalur Evakuasi</p>'+
            '<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:rgb(0,255,0);"/></svg></div>Rute Evakuasi<br>'+
            // Legenda Layer Tutupan Lahan
            '<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">KRB (Kawasan Rawan Bencana)</p>' +
            '<div style="background-color: #FFFF00"></div>KRB I<br>' +
            '<div style="background-color: #FF7F00"></div>KRB II<br>' +
            '<div style="background-color: #FF0000"></div>KRB III<br>' ;
            return div;
        };
        legend.addTo(map);