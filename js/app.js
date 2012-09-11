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
        df: 'productDescription',
        facet: 'true',
        'facet.field': 'gender',
        'facet.mincount': 1,
        //'fq': 'gender:womens'
      },
      success: function(data) {
        App.solr.set('start', data.response.start);
        App.solr.set('numFound', data.response.numFound);
        console.log(data.response);

        // extract the facet fields into a usable array
        var facet_fields = [];
        for(var key in data.facet_counts.facet_fields) {
          // pull the oddly formatted facet counts so we can turn them into
          // something usable
          var flat_facet_counts = data.facet_counts.facet_fields[key];
          var values = [];
          for(i = 0; i < flat_facet_counts.length; i = i + 2 ){
            values.push({
              label: flat_facet_counts[i], 
              count: flat_facet_counts[i + 1],
              facet_field: key
            });
          }
          facet_fields.addObject({
            label: key,
            value: values
          })
        }

        // load up the objects used by our view
        App.solr.results.set('content', data.response.docs);
        App.solr.facet_fields.set('content', facet_fields);
      },
      dataType: 'jsonp',
      jsonp: 'json.wrf'
    })
  },
  results: Em.ArrayController.create(),
  facet_fields: Em.ArrayController.create(),
  facet_queries: Em.ArrayController.create(),
  facet: Em.View.extend({
    toggle_facet: function(event) {
      console.log(event);
      window.e = event;
      console.log(this.getPath('content'));
      var facet = this.getPath('content');
      App.solr.facet_queries.set('content', []);
      
      console.log(facet);
      var content = App.solr.facet_queries.content;
      console.log(content);
      content.push( [facet.facet_field, facet.label]);
      App.solr.facet_queries.set('content', content);
    }
  })
});

