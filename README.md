## React Sticker
Creates instagram style sticky headers that collide when one header scrolls into another.

If you need something like this, but this does not work out of the box for you, file an issue and I will work to add configuration options to support a wider set of use cases.

**Note:** This does not follow idiomatic react. The primary goal of this project is to be performant during scrolling and clean to implement.

**Example**  
[react-sticker-example](https://github.com/rt2zz/react-sticker-example)

### Usage
Create a parent <Sticker> component and put your sticky headers inside of it.

*general*  
```js
<Sticker useWindow={*boolean*}>
  ...
  <Sticky>...</Sticky>
</Sticker>
```

*example*
```js
var Sticker = require('react-sticker')
var Sticky = Sticker.Sticky

var jsx = (
  <Sticker useWindow={true}> 
    <div>
      <Sticky><h2>First Sticky</h2></Sticky>
      <div style={{height: 500}} >Contents</div>
    </div>
    <div>
      <Sticky><h2>Second Sticky</h2></Sticky>
      <div style={{height: 500}} >Contents</div>
    </div>
    <div>
      <Sticky><h2>Third Sticky</h2></Sticky>
      <div style={{height: 500}} >Contents</div>
    </div>
  </Sticker>
)
```

When the Sticker container is scrolled such that the Sticky header reaches the top, the position of the Sticky element will be fixed (i.e. stuck) to the top of the screen.  When the top of the second header hits the first header it will begin to push the first header out of the way, and then become sticky itself.

Multiple independent <Sticker> components will work as siblings but not if nested.

### Styling & Scrolling
If you set `useWindow={true}` react-sticker should work out of the box. Otherwise you will need to make your sticker container "scrollable" with css, e.g. `<Sticker style={{overflow: 'scroll', height: '100%'}}>`
