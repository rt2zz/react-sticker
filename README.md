## React Sticker
Creates instagram style sticky headers that collide when one header scrolls into another.

**Warning: Work in Progress**  
This is an experiment. This does not follow idiomatic react and does not current have a lot of configurability. If you need something like this, but this is not work out of the box for you please file an issue and I will add configuration options to support a wider set of use cases.

### Usage
```
var Sticker = require('react-sticker')
var Sticky = Sticker.Sticky

var jsx = (
  <Sticker>
    <div>
      <Sticky><h2>Username1</h2></Sticky>
      <div>Contents</div>
    </div>
    <div>
      <Sticky><h2>Username1</h2></Sticky>
      <div>Contents</div>
    </div>
  </Sticker>
)
```

When the Sticker container is scrolled such that the Sticky header reaches the top, the position of the Sticky element will be fixed (i.e. stuck) to the top of the screen.  When the top of the second header hits the first header it will begin to push the first header out of the way, and then become sticky itself.
