const Webamp = window.Webamp;
const webamp = new Webamp({
    initialTracks: [
        {
            metaData: {
                artist: "Webinar",
                title: "Euphoria"
            },
            url: "/assets/music/euphoria.m4a",
        },
        {
            metaData: {
                artist: "Webinar",
                title: "Sunburst"
            },

            url: "/assets/music/sunburst.m4a",
        },
        {
            metaData: {
                artist: "Webinar",
                title: "URL"
            },
            url: "/assets/music/url.m4a",
        }
    ],
    // availableSkins: [
    //     { url: "/assets/skins/Frutiger-Aero.wsz", name: "Weezer Amp" },
    // ]
    initialSkin: {
        url: "/assets/skins/Bento_Classified.wsz"
    },

    __initialWindowLayout: {
        main: { position: { x: 0, y: 0 } },
        playlist: { position: { x: 0, y: 116 } }
    }
});
webamp.renderWhenReady(document.getElementById('webamp')).then(() => {
    
    const startAutoplay = () => {
        webamp.play();
        document.removeEventListener('click', startAutoplay);
        document.removeEventListener('keydown', startAutoplay);

        webamp.setVolume(20);
    };

    document.addEventListener('click', startAutoplay);
    document.addEventListener('keydown', startAutoplay);
});