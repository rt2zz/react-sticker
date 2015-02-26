var React = require('react')

/*@TODO
  Add configuration props e.g.
  * Re-sticky header on scroll down (when unset)
  * Stuck class
  * Default styles

  Improvements
  * Make offset containers work better (right now it does not clip the header)
  * Bug when scrolling a container inside of an already scrolled container
  */

module.exports = React.createClass({

  propTypes: {
    useWindow: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      useWindow: false
    }
  },

  componentWillMount: function(){
    // this.handleScroll = require('lodash').throttle(this.handleScroll, 100)
  },

  componentDidMount: function() {
    this.initialize()
    if(this.props.useWindow){
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('resize', this.initialize)
    }
  },

  componentDidUpdate: function() {
    this.initialize()
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.initialize);
  },

  initialize: function(){
    this._scrollNode = this.props.useWindow ? document.body : this.getDOMNode()
    this.findStickies()
    this.findCursor()
    this.setStuck()
  },

  findStickies: function(){
    var node = this._scrollNode
    this._stickies = node.querySelectorAll('[data-sticky]')
  },

  findCursor: function(){
    var node = this._scrollNode
    var stickies = this._stickies

    //find the current stuck and next sticky elements
    if(stickies[0].offsetTop > node.scrollTop){
      this._cursor = -1
    }
    else{
      var i = 0
      while(true){
        var next = stickies[i+1]
        if(next.offsetTop > node.scrollTop){
          this._cursor = i
          break
        }
        else{
          i++
          if(i+1 === stickies.length) break
        }
      }
    }
    this.setNodes()
  },

  setNodes: function(){
    this._stuck = this._stickies[this._cursor]
    this._next = this._stickies[this._cursor+1] || null
  },

  setStuck: function(){
    //remove last stuck and placeholder
    this.unset()
    this.setNodes()

    if(this._stuck){
      //insert placeholder
      this.insertPlaceholder(this._stuck)
      this.makeSticky(this._stuck)
    }
  },

  unset: function(){
    if(this._stuck){
      this._stuck.style.position = 'inherit'
      this._stuck.style.top = null
      this._stuck.classList.remove('stuck')
      if(this._placeHolder) this._stuck.parentNode.removeChild(this._placeHolder)
      this._placeHolder = null
      this._stuck = null
    }
    this._next = null
  },

  insertPlaceholder: function(stuck){
    this._placeHolder = document.createElement("div")
    this._placeHolder.style.width = stuck.offsetWidth+'px'
    this._placeHolder.style.height = stuck.offsetHeight+'px'
    stuck.parentNode.insertBefore(this._placeHolder, stuck)
  },

  makeSticky: function (stuck){
    stuck.style.width = stuck.offsetWidth+'px'
    stuck.style.height = stuck.offsetHeight+'px'
    stuck.style.top = this._scrollNode.offsetTop
    stuck.style.position = 'fixed'
    stuck.classList.add('stuck')
  },

  /*
  This handler does as little work as possible, checking if
    a) the scrollTop has hit our up or down boundaries
        -> Change cursor and update sticky state
    b) if nothing is "set" and we are scrolling down
        -> Update boundaries
  */
  handleScroll: function(){
    var node = this._scrollNode
    var downBoundary = this._next && this._next.offsetTop
    var upBoundary = this._placeHolder && this._placeHolder.offsetTop
    var set = (this._cursor === -1 || upBoundary) ? true : false
    var relScrollTop = node.offsetTop + node.scrollTop

    //If we are not set, reset cursor on next downward scroll.  This will get called once to set this new up/down boundaries
    if(!set && this._lastScrollTop < relScrollTop){
      this.findCursor()
      //If we have crossed our downward boundary, make sticky
      if(downBoundary && downBoundary < node.scrollTop) this.setStuck(true)
      return
    }
    this._lastScrollTop = relScrollTop

    //Check if we have hit our boundaries and change the cursor and stuck state accordingly
    if(downBoundary && relScrollTop >= downBoundary){
      this._cursor++
      this.setStuck(true)
      return
    }
    if(upBoundary && relScrollTop <= upBoundary){
      this._cursor--
      this.unset()
      return
    }
    //Check for Sticky collision and adjust top position accordingly
    if(set && this._stuck && relScrollTop >= downBoundary - this._stuck.offsetHeight){
      var top = Math.min(node.offsetTop, this._next.offsetTop - node.scrollTop - this._stuck.offsetHeight)
      this._stuck.style.top = top+'px'
      return
    }

    //If none of the above conditions triggered, check if we are out of bounds, and if so reset cursor
    if(relScrollTop > downBoundary || relScrollTop < upBoundary){
      this.findCursor()
    }

  },

  render: function() {
    var stickerOnScroll = this.props.useWindow ? null : this.handleScroll
    return(
      <div {...this.props} onScroll={stickerOnScroll}>
        {this.props.children}
      </div>
    )
  }
});
