'use strict';

require('mocha');
var assert = require('assert');
var should = require('should');
var assemble = require('assemble-core');
var helper = require('./');
var related, app;

describe('related helper', function() {
  this.slow(500);

  beforeEach(function() {
    related = helper();
  });

  it('should get a package.json from npm:', function(cb) {
    this.timeout(2000);
    related('micromatch', function(err, res) {
      res.should.match(/\[micromatch\]/);
      cb();
    });
  });

  it('should get an array of package.json files:', function(cb) {
    this.timeout(2000);
    related(['micromatch', 'assemble'], function(err, res) {
      res.should.match(/\[micromatch\]/);
      res.should.match(/\[assemble\]/);
      cb();
    });
  });

  it('should not fail when no names are passed', function(cb) {
    this.timeout(2000);
    related(function(err, res) {
      assert.equal(res, '');
      cb();
    });
  });

  it('should skip repos that don\'t exist', function(cb) {
    this.timeout(2000);
    related(['sosososos', 'assemble'], function(err, res) {
      assert.equal(res, '[assemble](https://www.npmjs.com/package/assemble): Assemble is a powerful, extendable and easy to use static site generator for node.js. Used… [more](https://www.npmjs.com/package/assemble) | [homepage](https://github.com/assemble/assemble)');
      cb();
    });
  });

  it('should remove a name passed on `options.remove`:', function(cb) {
    this.timeout(2000);
    var list = ['assemble', 'verb', 'remarkable', 'snippet'];
    related(list, {remove: 'remarkable'}, function(err, res) {
      res.should.match(/\[assemble\]/);
      res.should.not.match(/\[remarkable\]/);
      res.should.match(/\[verb\]/);
      res.should.match(/\[snippet\]/);
      cb();
    });
  });

  it('should remove an array of names passed on `options.remove`:', function(cb) {
    this.timeout(2000);
    var list = ['assemble', 'verb', 'remarkable', 'snippet'];
    related(list, {remove: ['remarkable', 'verb']}, function(err, res) {
      res.should.match(/\[assemble\]/);
      res.should.not.match(/\[remarkable\]/);
      res.should.not.match(/\[verb\]/);
      res.should.match(/\[snippet\]/);
      cb();
    });
  });

  it('should truncate description to 15 words by default', function(cb) {
    this.timeout(2000);
    related(['snapdragon', 'verb'], function(err, res) {
      res.should.equal([
        '* [snapdragon](https://www.npmjs.com/package/snapdragon): snapdragon is an extremely pluggable, powerful and easy-to-use parser-renderer factory. | [homepage](https://github.com/jonschlinkert/snapdragon)',
        '* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)',
      ].join('\n'));
      cb();
    });
  });

  it('should truncate the description to the given number of words:', function(cb) {
    this.timeout(2000);
    related(['verb', 'snippet'], {words: 10}, function(err, res) {
      res.should.equal([
        '* [snippet](https://www.npmjs.com/package/snippet): CLI and API for easily creating, reusing, sharing and generating… [more](https://www.npmjs.com/package/snippet) | [homepage](https://github.com/jonschlinkert/snippet)',
        '* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)',
      ].join('\n'));
      cb();
    });
  });

  it('should truncate description to 15 when truncate:true', function(cb) {
    this.timeout(2000);
    related(['snapdragon', 'verb', 'error-format'], {truncate: true}, function(err, res) {
      res.should.equal([
        '* [error-format](https://www.npmjs.com/package/error-format): Allows you to customize the toString method of passed `err`. Also adds useful properties like… [more](https://www.npmjs.com/package/error-format) | [homepage](https://github.com/tunnckocore/error-format)',
        '* [snapdragon](https://www.npmjs.com/package/snapdragon): snapdragon is an extremely pluggable, powerful and easy-to-use parser-renderer factory. | [homepage](https://github.com/jonschlinkert/snapdragon)',
        '* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)',
      ].join('\n'));
      cb();
    });
  });

  it('should not truncate description when truncate:false', function(cb) {
    this.timeout(2000);
    related(['micromatch', 'assemble'], {truncate: false}, function(err, res) {
      assert(res.length > 100);
      assert(/\* \[assemble\]/.test(res));
      assert(/\* \[micromatch\]/.test(res));
      cb();
    });
  });

  it('should throw an error:', function() {
    (function() {
      related();
    }).should.throw('expected a callback function');
  });
});

describe('helper', function() {
  this.slow(500);

  beforeEach(function() {
    app = assemble();
    app.engine('hbs', require('engine-handlebars'));
    app.engine('md', require('engine-base'));

    // custom view collections
    app.create('pages', {engine: 'hbs'});
    app.create('posts', {engine: 'md'});

    // add helper
    app.asyncHelper('related', helper(app.options));
  });

  it('should work with handlebars:', function(cb) {
    this.timeout(2000);
    app.page('abc', {content: 'foo {{related list}} bar'})
      .render({list: ['micromatch']}, function(err, res) {
        if (err) return cb(err);
        res.content.should.match(/\[micromatch\]/);
        cb();
      });
  });

  it('should use global options', function(cb) {
    this.timeout(2000);
    app.option('remove', ['flflflfl']);
    app.page('abc', {content: 'foo {{related list}} bar'})
      .render({list: ['micromatch', 'flflflfl']}, function(err, res) {
        if (err) return cb(err);
        res.content.should.match(/\[micromatch\]/);
        cb();
      });
  });

  it('should work with engine-base:', function(cb) {
    this.timeout(2000);
    app.post('xyz', {content: 'foo <%= related(list) %> bar'})
      .render({list: ['micromatch']}, function(err, res) {
        if (err) return cb(err);
        res.content.should.match(/\[micromatch\]/);
        cb();
      });
  });

  it('should work using values from the context:', function(cb) {
    this.timeout(2000);

    app.data('list', ['micromatch']);
    app.post('xyz', {content: 'foo <%= related(list) %> bar'})
      .render(function(err, res) {
        if (err) return cb(err);
        res.content.should.match(/\[micromatch\]/);
        cb();
      });
  });

  it('should use configProp:', function(cb) {
    this.timeout(2000);

    app.asyncHelper('related', helper({
      configProp: 'foo'
    }));

    app.data('foo.a.b.c', ['micromatch']);
    app.post('xyz', {content: 'whatever <%= related("a.b.c") %> blah'})
      .render(function(err, res) {
        if (err) return cb(err);
        res.content.should.match(/\[micromatch\]/);
        cb();
      });
  });
});
