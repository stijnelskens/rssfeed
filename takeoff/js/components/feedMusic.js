'use strict';

import * as moment from 'moment';

const dataUrls = ['https://highsnobiety.com/rss', 'http://feeds.feedburner.com/hypebeast/feed', 'https://www.vice.com/en_uk/rss'];

$.each(dataUrls, function (i, u) {

    $.ajax({
        url: 'https://api.rss2json.com/v1/api.json',
        method: 'GET',
        dataType: 'json',
        data: {
            rss_url: u,
            api_key: 'wc89wkhml8ovzhbeveogr6fqhbzl8vgwvbrvuxht', // Test API so no worries ;)
            order_by: 'pubDate',
            order_dir: 'desc',
            count: 12
        }
    }).done(function (response) {

        const contentDiv = document.getElementById('feed');

        if (response.status != 'ok') {
            throw response.message;
        }

        const feedContainer = document.createElement('div');

        for (const i in response.items) {

            const feedEntry = response.items[i];

            // Filter entries curtain categories
            if (feedEntry.categories.includes('Music')) {

                // Create elements
                const feedEntryAside = document.createElement('div');
                const feedEntryImageContainer = document.createElement('div');
                const feedEntryImage = document.createElement('img');
                const feedEntryMain = document.createElement('div');
                const feedEntryContainer = document.createElement('div');
                const feedEntryDate = document.createElement('span');
                const feedEntryTitleElement = document.createElement('h3');
                const feedEntryLinkElement = document.createElement('a');
                const feedEntryWebsite = document.createElement('span');

                // Nasty to get just the url of the platform
                const feedEntryWebsiteLink = feedEntry.guid.replace(/(^\w+:|^)\/\//, '').split('.com')[0];

                // Build up the links/titles/descriptions
                feedContainer.setAttribute('class', 'spacer spacer--med spacer--border');
                feedEntryContainer.setAttribute('class', 'spacer spacer--med spacer--border card card--link card--clickable');

                feedEntryAside.setAttribute('class', 'card__aside');
                feedEntryImageContainer.setAttribute('class', 'card__img');
                feedEntryImage.setAttribute('src', feedEntry.thumbnail);
                feedEntryImage.setAttribute('class', 'image--landscape-circle');
                feedEntryImage.setAttribute('alt', feedEntry.title);
                feedEntryMain.setAttribute('class', 'card__main');

                feedEntryLinkElement.setAttribute('href', feedEntry.link);
                feedEntryLinkElement.setAttribute('target', '_blank');
                feedEntryLinkElement.setAttribute('rel', 'noopener');
                feedEntryDate.setAttribute('class', 'meta meta--date');
                feedEntryTitleElement.setAttribute('class', 'card__title u-mt-xsm');
                feedEntryWebsite.setAttribute('class', 'meta');

                // Show the platform
                if (feedEntryWebsiteLink === 'www.highsnobiety') {
                    feedEntryWebsite.innerText = 'Highsnobiety';
                } else if (feedEntryWebsiteLink === 'hypebeast') {
                    feedEntryWebsite.innerText = 'Hypebeast';
                } else {
                    feedEntryWebsite.innerText = 'Vice';
                }

                // Fix date format
                const momentDate = moment(feedEntry.pubDate).startOf('day').fromNow();

                feedEntryLinkElement.innerText = feedEntry.title;
                feedEntryDate.innerText = momentDate;
                feedEntryTitleElement.appendChild(feedEntryLinkElement);
                feedEntryContainer.appendChild(feedEntryAside);
                feedEntryAside.appendChild(feedEntryImageContainer);
                feedEntryMain.appendChild(feedEntryWebsite);
                feedEntryMain.appendChild(feedEntryDate);
                feedEntryMain.appendChild(feedEntryTitleElement);
                feedEntryImageContainer.appendChild(feedEntryImage);
                feedEntryContainer.appendChild(feedEntryMain);
                feedContainer.appendChild(feedEntryContainer);

                // Loop trough the categories and show them
                for (const i in feedEntry.categories) {
                    const feedEntryCategoryText = feedEntry.categories[i];
                    const feedEntryCategory = document.createElement('span');

                    feedEntryCategory.innerText = feedEntryCategoryText;
                    feedEntryCategory.setAttribute('class', 'label');
                    feedEntryMain.appendChild(feedEntryCategory);
                }

                contentDiv.appendChild(feedContainer);

            }

        }
    });
});
