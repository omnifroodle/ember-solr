var App = Em.Application.create();

App.MyView = Em.View.extend({});


App.solr = Em.Object.create({
  numFound: 0,
  start: 0,
  terms: function(key, value) {
    // getter
    if (arguments.length === 1) {
      return this.get('_terms');
    // setter
    } else {
      this.set('_terms', value);
      this.query();
      return value;
    }
  }.property(),

  query: function() {
    $.ajax({
      url: this.get('url'),
      data: {
        q: this.get('terms'),
        wt: 'json',
        qt: 'dismaxtax',
        df: 'productDescription'
      },
      success: function(data) {
        App.solr.set('start', data.response.start);
        App.solr.set('numFound', data.response.numFound);
        console.log(data.response);
        App.solr.results.set('content', data.response.docs);
      },
      dataType: 'jsonp',
      jsonp: 'json.wrf'
    })
  },
  results: Em.ArrayController.create(),
});


