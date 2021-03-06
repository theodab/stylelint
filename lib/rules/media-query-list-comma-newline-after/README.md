# media-query-list-comma-newline-after

Require a newline or disallow whitespace after the commas of media query lists.

```css
@media screen and (color),
  projection {}       /* ↑ */
/**                      ↑
 *            These commas */
```

The `--fix` option on the [command line](../../../docs/user-guide/cli.md#autofixing-errors) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline after the commas.

The following patterns are considered violations:

```css
@media screen and (color), projection and (color) {}
```

```css
@media screen and (color)
, projection and (color) {}
```

The following patterns are *not* considered violations:

```css
@media screen and (color),
projection and (color) {}
```

```css
@media screen and (color)
,
projection and (color) {}
```

### `"always-multi-line"`

There *must always* be a newline after the commas in multi-line media query lists.

The following patterns are considered violations:

```css
@media screen and (color)
, projection and (color) {}
```

The following patterns are *not* considered violations:

```css
@media screen and (color), projection and (color) {}
```

```css
@media screen and (color),
projection and (color) {}
```

```css
@media screen and (color)
,
projection and (color) {}
```

### `"never-multi-line"`

There *must never* be whitespace after the commas in multi-line media query lists.

The following patterns are considered violations:

```css
@media screen and (color),
projection and (color) {}
```

```css
@media screen and (color)
,
projection and (color) {}
```

The following patterns are *not* considered violations:

```css
@media screen and (color), projection and (color) {}
```

```css
@media screen and (color)
,projection and (color) {}
```
