$(function () {
    if ($('p.message').text() != "") {
        $('p.message').wrap("<div class='alert'></div>")
    }

    if (window.location.hash && window.location.hash == '#_=_') {
        window.location.hash = '';
    }

    var nbaTeams = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '../data/nba.json'
    });

    var nhlTeams = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '../data/nhl.json'
    });

    nbaTeams.initialize();
    nhlTeams.initialize();

    $('#multiple-datasets .typeahead').typeahead({
            highlight: true
        },
        {
            name: 'nba-teams',
            displayKey: 'team',
            source: nbaTeams.ttAdapter(),
            templates: {
                header: '<h3 class="league-name">NBA Teams</h3>'
            }
        },
        {
            name: 'nhl-teams',
            displayKey: 'team',
            source: nhlTeams.ttAdapter(),
            templates: {
                header: '<h3 class="league-name">NHL Teams</h3>'
            }
        });
});

