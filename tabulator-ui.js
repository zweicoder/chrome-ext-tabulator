;(function (m) {
    'use strict';

    var tabs = {}, // to-be module
        parsedTabGroups = JSON.parse(localStorage.tabGroups); // tab groups

    function saveTabGroups(json) {
        localStorage.setItem('tabGroups', JSON.stringify(json));
    }

    // model entity
    // 'data' is meant to be a tab group object from localStorage
    tabs.TabGroup = function (data) {
        this.date = m.prop(data.date);
        this.id   = m.prop(data.id);
        this.tabs = m.prop(data.tabs);
    };

    // alias for Array
    tabs.TabGroupsList = Array;

    // view-model
    tabs.vm = new function () {
        var vm = {};
        vm.init = function () {
            // list of tab groups
            vm.list = new tabs.TabGroupsList();

            vm.rmGroup = function (i) {
                // remove view from array
                vm.list.splice(i, 1);
                // remove from localStorage
                parsedTabGroups.splice(i, 1)
                // save
                saveTabGroups(parsedTabGroups);
            };

            vm.rmTab = function (i, ii) {
                // remove from view array
                //vm.list[i].tabs().splice(ii, 1);
                // remove from localStorage
                parsedTabGroups[i].tabs.splice(ii, 1);
                // save
                saveTabGroups(parsedTabGroups);
            };
        };
        return vm;
    };

    tabs.controller = function () {
        var i;
        tabs.vm.init();
        for (i = 0; i < parsedTabGroups.length; i += 1) {
            tabs.vm.list.push(new tabs.TabGroup(parsedTabGroups[i]));
        }
    };

    tabs.view = function () {
        // foreach tab group
        return tabs.vm.list.map(function (group, i) {
            return m('div.group', [
                m('div.group-title', [
                    m('span.delete-link', { onclick: function () {
                        tabs.vm.rmGroup(i);
                    } }),
                    m('span.group-amount', group.tabs().length + ' Tabs'),
                    ' ',
                    m('span.group-date', moment(group.date()).format('HH:mm:ss YYYY-MM-DD'))
                ]),
                // foreach tab
                m('ul', group.tabs().map(function (tab, ii) {
                    return m('li', [
                        m('span.delete-link', { onclick: function () {
                            tabs.vm.rmTab(i, ii);
                        } }),
                        m('img', { src: tab.favIconUrl, height: '16', width: '16' }),
                        ' ',
                        m('a', { href: tab.url, target: '_blank' }, tab.title)
                    ]);
                }))
            ]);
        });
    };

    // init the app
    m.module(document.getElementById('groups'), { controller: tabs.controller, view: tabs.view });

}(m));