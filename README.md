# helper-related [![NPM version](https://badge.fury.io/js/helper-related.svg)](http://badge.fury.io/js/helper-related)  [![Build Status](https://travis-ci.org/helpers/helper-related.svg)](https://travis-ci.org/helpers/helper-related)

> Template helper for generating a list of links to the homepages of related GitHub/npm projects.

## Install with [npm](npmjs.org)

```bash
npm i helper-related --save
```

## Usage

This is an async helper that will only work with [Assemble](http://assemble.io), [Verb](https://github.com/assemble/verb), or [Template](https://github.com/jonschlinkert/template).

**Register the helper**

```js
app.helper('related', require('helper-related'));
```

**Use in templates**

```js
{%= related(['remarkable', 'micromatch']) %}
```

Results in a list that looks something like:

```markdown
* [micromatch](https://github.com/jonschlinkert/micromatch): Glob matching for javascript/node.js. A drop-in replacement and faster alternative to minimatch and multimatch. Just… [more](https://github.com/jonschlinkert/micromatch)
* [remarkable](https://github.com/jonschlinkert/remarkable): Markdown parser, done right. 100% Commonmark support, extensions, syntax plugins, high speed - all in… [more](https://github.com/jonschlinkert/remarkable)
```

If the array gets long, you can format it like this if you want:

```js
{%= related([
  'git-branch', 
  'git-repo-name', 
  'git-user-email', 
  'git-user-name', 
  'git-username', 
  'github-repo-url'
]) %}
```

## Run tests

Install dev dependencies:

```bash
npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/helpers/helper-related/issues)

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright (c) 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on May 01, 2015._

<!-- reflinks generated by verb-reflinks plugin -->
