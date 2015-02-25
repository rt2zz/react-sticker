var React = require('react')

module.exports = React.createClass({

  componentWillMount: function(){
    // this.handleScroll = _.throttle(this.handleScroll, 100)
  },

  componentDidMount: function() {
    this.findCursor()
    this.setStuckAndNext(true)
  },

  findCursor: function(){
    var node = this.getDOMNode()
    //assume stickies are already sorted by offsetTop
    var stickies = node.querySelectorAll('[data-sticky]')
    this._stickies = stickies

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
  },

  setStuckAndNext: function(setNew){
    var cursor = this._cursor
    //remove last stuck and placeholder
    if(this._stuck){
      this._stuck.style.position = 'inherit'
      this._stuck.style.top = null
      this._stuck.classList.remove('stuck')
      if(this._placeHolder) this._stuck.parentNode.removeChild(this._placeHolder)
      this._placeHolder = null
      this._stuck = null
      this._set = false
    }

    this._stuck = this._stickies[cursor] || null
    this._next = this._stickies[cursor+1]

    if(this._stuck && setNew){
      //insert placeholder
      this.insertPlaceholder(this._stuck)
      this.makeSticky(this._stuck)
      this._set = true
    }
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
    stuck.style.top = 0
    stuck.style.position = 'fixed'
    stuck.classList.add('stuck')
  },

  handleScroll: function(){
    var node = this.getDOMNode()
    //if the cursor is not considered "set" and we are scrolling down, reset it
    if(this._lastScrollTop < node.scrollTop && !this._set){
      this.findCursor()
      this.setStuckAndNext(false)
      this._set = true
    }
    this._lastScrollTop = node.scrollTop

    //downBoundary triggers the next cursor increment
    var downBoundary = this._next && this._next.offsetTop
    //upBoundary triggers a cursor decrement, and unsets the stuck element
    var upBoundary = this._placeHolder && this._placeHolder.offsetTop

    if(node.scrollTop >= downBoundary){
      this._cursor++
      this.setStuckAndNext(true)
    }
    if(upBoundary && node.scrollTop <= upBoundary){
      this._set = false
      this._cursor--
      this.setStuckAndNext(false)
    }
    if(this._stuck && node.scrollTop >= downBoundary - this._stuck.offsetHeight){
      var top = Math.min(0, this._next.offsetTop - node.scrollTop - this._stuck.offsetHeight)
      this._stuck.style.top = top+'px'
    }
  },

  render: function() {
    return(
      <div {...this.props} onScroll={this.handleScroll}>
        {this.props.children}
      </div>
    )
  }
});
