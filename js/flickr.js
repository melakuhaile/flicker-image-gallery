(function (document, window) {
    'use strict';

    var apiKey = '26eab4e28cab2adbcce3ed1ea7cb6f11';
    var apiURL = 'https://api.flickr.com/services/rest/';

    function searchText(parameters) {
        var requestParameters = Flickrlink.extend(parameters, {
            method: 'flickr.photos.search',
            api_key: apiKey,
            format: 'json'
        });

        var script = document.createElement('script');
        script.src = Flickrlink.buildUrl(apiURL, requestParameters);
        document.head.appendChild(script);
        document.head.removeChild(script);
    }

    function buildThumbnailUrl(photo) {
        return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
            '/' + photo.id + '_' + photo.secret + '_q.jpg';
    }

    function buildPhotoUrl(photo) {
        return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
            '/' + photo.id + '_' + photo.secret + '.jpg';
    }

    function buildPhotoLargeUrl(photo) {
        return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
            '/' + photo.id + '_' + photo.secret + '_b.jpg';
    }

    window.Flickr = Flickrlink.extend(window.Flickr || {}, {
        buildThumbnailUrl: buildThumbnailUrl,
        buildPhotoUrl: buildPhotoUrl,
        buildPhotoLargeUrl: buildPhotoLargeUrl,
        searchText: searchText
    });
    function Gallery(photos, container) {
        this.currentIndex = 0;
        this.photos = photos;
        this.container = container;

        this.showPhoto(this.currentIndex);
    }

    Gallery.prototype.showPhoto = function (index) {
        if (index >= 0 && index < this.photos.length) {
            this.currentIndex = index;
            this.container.src = Flickr.buildPhotoLargeUrl(this.photos[this.currentIndex]);
        }
    };

    Gallery.prototype.showPrevious = function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }

        this.showPhoto(this.currentIndex);
    };

    Gallery.prototype.showNext = function () {
        if (this.currentIndex < this.photos.length - 1) {
            this.currentIndex++;
        }

        this.showPhoto(this.currentIndex);
    };

    Gallery.prototype.createThumbnailsGallery = function (container) {
        function clickHandler(index, gallery) {
            return function (event) {
                event.preventDefault();

                gallery.showPhoto(index);
            };
        }

        container.textContent = '';
        var image, link, listItem;
        for (var i = 0; i < this.photos.length; i++) {
            image = document.createElement('img');
            image.src = Flickr.buildThumbnailUrl(this.photos[i]);
            image.className = 'thumbnail';
            image.alt = this.photos[i].title;
            image.title = this.photos[i].title;

            link = document.createElement('a');
            link.href = image.src;
            link.addEventListener('click', clickHandler(i, this));
            link.appendChild(image);

            listItem = document.createElement('li');
            listItem.appendChild(link);

            container.appendChild(listItem);
        }
    }

    window.Gallery = Gallery;
})(document, window);