(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ReactiveVis = global.ReactiveVis || {})));
}(this, function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var index$1 = createCommonjsModule(function (module, exports) {
	// UMD boilerplate (from Rollup)
	(function (global, factory) {
	  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
	  typeof define === "function" && define.amd ? define(factory) : (global.ReactiveProperty = factory());
	}(commonjsGlobal, function () { "use strict";

	  // Error messages for exceptions thrown.
	  var errors = {
	    tooManyArgsConstructor: "ReactiveProperty(value) accepts only a single argument, the initial value.",
	    tooManyArgsSetter: "reactiveProperty(newValue) accepts only a single argument, the new value.",
	    onNonFunction: "ReactiveProperty.on(listener) only accepts functions, not values.",
	    onArgs: "ReactiveProperty.on(listener) accepts exactly one argument, the listener function."
	  };

	  // This function generates a getter-setter with change listeners.
	  return function ReactiveProperty(value){

	    // An array of registered listener functions.
	    var listeners;
	    
	    // Check for too many arguments.
	    if(arguments.length > 2) {
	      throw Error(errors.tooManyArgsConstructor);
	    }

	    // This is the reactive property function that gets returned.
	    function reactiveProperty(newValue){
	    
	      // Check for too many arguments.
	      if(arguments.length > 1) {
	        throw Error(errors.tooManyArgsSetter);
	      }
	      
	      // This implements the setter part of the setter-getter.
	      if(arguments.length === 1){

	        // Grab the old value for passing into the listener.
	        var oldValue = value;

	        // Track the new value internally.
	        value = newValue;

	        // Notify registered listeners.
	        if(listeners){
	          for(var i = 0; i < listeners.length; i++){
	            listeners[i](newValue, oldValue);
	          }
	        }

	        // Support method chaining by returning 'this'.
	        return this;
	      }

	      // This implements the getter part of the setter-getter.
	      return value;
	    }

	    // Registers a new listener to receive updates.
	    reactiveProperty.on = function (listener){

	      // Check for invalid types.
	      if(typeof listener !== "function"){
	        throw Error(errors.onNonFunction);
	      }

	      // Check for wrong number of arguments.
	      if(arguments.length > 1 || arguments.length === 0){
	        throw Error(errors.onArgs);
	      }

	      // If no listeners have been added yet, initialize the array.
	      if(!listeners){
	        listeners = [];
	      }

	      // Register the listener.
	      listeners.push(listener);

	      // If there is an initial value, invoke the listener immediately.
	      // null is considered as a defined value.
	      if(value !== void 0){
	        listener(value);
	      }

	      // For convenience, the listener is returned.
	      return listener;
	    };

	    // Unregisters the given listener function.
	    reactiveProperty.off = function (listenerToRemove){
	      if(listeners){
	        listeners = listeners.filter(function (listener){
	          return listener !== listenerToRemove;
	        });
	      }
	    };

	    // Unregisters all listeners.
	    reactiveProperty.destroy = function (){
	      listeners = [];
	    };

	    // Expose the default value
	    if(value){
	      var defaultValue = value;
	      reactiveProperty.default = function (){
	        return defaultValue;
	      };
	    }

	    return reactiveProperty;
	  };
	}));
	});

	var require$$1 = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

	var index$3 = createCommonjsModule(function (module) {
	// A graph data structure with depth-first search and topological sort.
	module.exports = function Graph(serialized){

	  // The returned graph instance.
	  var graph = {
	    addNode: addNode,
	    removeNode: removeNode,
	    nodes: nodes,
	    adjacent: adjacent,
	    addEdge: addEdge,
	    removeEdge: removeEdge,
	    indegree: indegree,
	    outdegree: outdegree,
	    depthFirstSearch: depthFirstSearch,
	    topologicalSort: topologicalSort,
	    serialize: serialize,
	    deserialize: deserialize
	  };

	  // The adjacency list of the graph.
	  // Keys are node ids.
	  // Values are adjacent node id arrays.
	  var edges = {};

	  // If a serialized graph was passed into the constructor, deserialize it.
	  if(serialized){
	    deserialize(serialized);
	  }

	  // Adds a node to the graph.
	  // If node was already added, this function does nothing.
	  // If node was not already added, this function sets up an empty adjacency list.
	  function addNode(node){
	    edges[node] = adjacent(node);
	    return graph;
	  }

	  // Removes a node from the graph.
	  // Also removes incoming and outgoing edges.
	  function removeNode(node){
	    
	    // Remove incoming edges.
	    Object.keys(edges).forEach(function (u){
	      edges[u].forEach(function (v){
	        if(v === node){
	          removeEdge(u, v);
	        }
	      });
	    });

	    // Remove outgoing edges (and signal that the node no longer exists).
	    delete edges[node];

	    return graph;
	  }

	  // Gets the list of nodes that have been added to the graph.
	  function nodes(){
	    var nodeSet = {};
	    Object.keys(edges).forEach(function (u){
	      nodeSet[u] = true;
	      edges[u].forEach(function (v){
	        nodeSet[v] = true;
	      });
	    });
	    return Object.keys(nodeSet);
	  }

	  // Gets the adjacent node list for the given node.
	  // Returns an empty array for unknown nodes.
	  function adjacent(node){
	    return edges[node] || [];
	  }

	  // Adds an edge from node u to node v.
	  // Implicitly adds the nodes if they were not already added.
	  function addEdge(u, v){
	    addNode(u);
	    addNode(v);
	    adjacent(u).push(v);
	    return graph;
	  }

	  // Removes the edge from node u to node v.
	  // Does not remove the nodes.
	  // Does nothing if the edge does not exist.
	  function removeEdge(u, v){
	    if(edges[u]){
	      edges[u] = adjacent(u).filter(function (_v){
	        return _v !== v;
	      });
	    }
	    return graph;
	  }

	  // Computes the indegree for the given node.
	  // Not very efficient, costs O(E) where E = number of edges.
	  function indegree(node){
	    var degree = 0;
	    function check(v){
	      if(v === node){
	        degree++;
	      }
	    }
	    Object.keys(edges).forEach(function (u){
	      edges[u].forEach(check);
	    });
	    return degree;
	  }

	  // Computes the outdegree for the given node.
	  function outdegree(node){
	    return node in edges ? edges[node].length : 0;
	  }

	  // Depth First Search algorithm, inspired by
	  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
	  // This variant includes an additional option 
	  // `includeSourceNodes` to specify whether to include or
	  // exclude the source nodes from the result (true by default).
	  // If `sourceNodes` is not specified, all nodes in the graph
	  // are used as source nodes.
	  function depthFirstSearch(sourceNodes, includeSourceNodes){

	    if(!sourceNodes){
	      sourceNodes = nodes();
	    }

	    if(typeof includeSourceNodes !== "boolean"){
	      includeSourceNodes = true;
	    }

	    var visited = {};
	    var nodeList = [];

	    function DFSVisit(node){
	      if(!visited[node]){
	        visited[node] = true;
	        adjacent(node).forEach(DFSVisit);
	        nodeList.push(node);
	      }
	    }

	    if(includeSourceNodes){
	      sourceNodes.forEach(DFSVisit);
	    } else {
	      sourceNodes.forEach(function (node){
	        visited[node] = true;
	      });
	      sourceNodes.forEach(function (node){
	        adjacent(node).forEach(DFSVisit);
	      });
	    }

	    return nodeList;
	  }

	  // The topological sort algorithm yields a list of visited nodes
	  // such that for each visited edge (u, v), u comes before v in the list.
	  // Amazingly, this comes from just reversing the result from depth first search.
	  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
	  function topologicalSort(sourceNodes, includeSourceNodes){
	    return depthFirstSearch(sourceNodes, includeSourceNodes).reverse();
	  }

	  // Serializes the graph.
	  function serialize(){
	    var serialized = {
	      nodes: nodes().map(function (id){
	        return { id: id };
	      }),
	      links: []
	    };

	    serialized.nodes.forEach(function (node){
	      var source = node.id;
	      adjacent(source).forEach(function (target){
	        serialized.links.push({
	          source: source,
	          target: target
	        });
	      });
	    });

	    return serialized;
	  }

	  // Deserializes the given serialized graph.
	  function deserialize(serialized){
	    serialized.nodes.forEach(function (node){ addNode(node.id); });
	    serialized.links.forEach(function (link){ addEdge(link.source, link.target); });
	    return graph;
	  }
	  
	  return graph;
	}
	});

	var require$$0 = (index$3 && typeof index$3 === 'object' && 'default' in index$3 ? index$3['default'] : index$3);

	var index$2 = createCommonjsModule(function (module) {
	var ReactiveProperty = require$$1;
	var Graph = require$$0;

	// Use requestAnimationFrame if it is available.
	// Otherwise fall back to setTimeout.
	var nextFrame = setTimeout;
	if(typeof requestAnimationFrame !== 'undefined') {
	  nextFrame = requestAnimationFrame;
	}

	// The singleton data dependency graph.
	// Nodes are reactive properties.
	// Edges are dependencies between reactive function inputs and outputs.
	var graph = Graph();

	// A map for looking up properties based on their assigned id.
	// Keys are property ids, values are reactive properties.
	var properties = {};

	// This object accumulates properties that have changed since the last digest.
	// Keys are property ids, values are truthy (the object acts like a Set).
	var changed = {};

	// Assigns an id to a reactive property so it can be a node in the graph.
	// Also stores a reference to the property by id in `properties`.
	// If the given property already has an id, does nothing.
	var assignId = (function(){
	  var counter = 1;
	  return function (property){
	    if(!property.id){
	      property.id = String(counter++);
	      properties[property.id] = property;
	    }
	  };
	}());

	// The reactive function constructor.
	// Accepts an options object with
	//  * inputs - An array of reactive properties.
	//  * callback - A function with arguments corresponding to values of inputs.
	//  * output - A reactive property (optional).
	function ReactiveFunction(options){

	  var inputs = options.inputs;
	  var callback = options.callback;
	  var output = options.output;
	  
	  if(!output){
	    output = function (){};
	    output.propertyName = "";
	  }

	  // This gets invoked during a digest, after inputs have been evaluated.
	  output.evaluate = function (){

	    // Get the values for each of the input reactive properties.
	    var values = inputs.map(function (input){
	      return input();
	    });

	    // If all input values are defined,
	    if(defined(values)){

	      // invoke the callback and assign the output value.
	      output(callback.apply(null, values));
	    }

	  };

	  // Assign node ids to inputs and output.
	  assignId(output);
	  inputs.forEach(assignId);

	  // Set up edges in the graph from each input.
	  inputs.forEach(function (input){
	    graph.addEdge(input.id, output.id);
	  });

	  // Add change listeners to each input property.
	  // These mark the properties as changed and queue the next digest.
	  var listeners = inputs.map(function (property){
	    return property.on(function (){
	      changed[property.id] = true;
	      queueDigest();
	    });
	  });

	  // Return an object that can destroy the listeners and edges set up.
	  return {

	    // This function must be called to explicitly destroy a reactive function.
	    // Garbage collection is not enough, as we have added listeners and edges.
	    destroy: function (){

	      // Remove change listeners from inputs.
	      listeners.forEach(function (listener, i){
	        inputs[i].off(listener);
	      });

	      // Remove the edges that were added to the dependency graph.
	      inputs.forEach(function (input){
	        graph.removeEdge(input.id, output.id);
	      });

	      // Remove property nodes with no edges connected.
	      inputs.concat([output]).forEach(function (property){
	        var node = property.id;
	        if(graph.indegree(node) + graph.outdegree(node) === 0){
	          graph.removeNode(property.id);
	        }
	      });

	      // Remove the reference to the 'evaluate' function.
	      delete output.evaluate;

	      // Remove references to everything.
	      inputs = callback = output = undefined;
	    }
	  };
	}

	// Propagates changes through the dependency graph.
	ReactiveFunction.digest = function (){
	  var changedIds = Object.keys(changed);
	  changed = {};
	  graph
	    .topologicalSort(changedIds, false)
	    .map(function (id){
	      return properties[id];
	    })
	    .forEach(function (property){
	      property.evaluate();
	    });
	  changed = {};
	};

	// This function queues a digest at the next tick of the event loop.
	var queueDigest = debounce(ReactiveFunction.digest);

	// Returns a function that, when invoked, schedules the given function
	// to execute once on the next frame.
	// Similar to http://underscorejs.org/#debounce
	function debounce(callback){
	  var queued = false;
	  return function () {
	    if(!queued){
	      queued = true;
	      nextFrame(function () {
	        queued = false;
	        callback();
	      }, 0);
	    }
	  };
	}

	// Returns true if all elements of the given array are defined.
	function defined(arr){
	  return !arr.some(isUndefined);
	}

	// Returns true if the given object is undefined.
	// Returns false if the given object is some value, including null.
	// Inspired by http://ryanmorr.com/exploring-the-eternal-abyss-of-null-and-undefined/
	function isUndefined(obj){
	  return obj === void 0;
	}

	ReactiveFunction.nextFrame = nextFrame;

	ReactiveFunction.serializeGraph = function (){
	  var serialized = graph.serialize();

	  // Add property names.
	  serialized.nodes.forEach(function (node){
	    var propertyName = properties[node.id].propertyName;
	    if(typeof propertyName !== "undefined"){
	      node.propertyName = propertyName;
	    }
	  });

	  return serialized;
	}

	ReactiveFunction.link = function (propertyA, propertyB){
	  return ReactiveFunction({
	    inputs: [propertyA],
	    output: propertyB,
	    callback: function (x){ return x; }
	  });
	}

	module.exports = ReactiveFunction;
	});

	var require$$1$1 = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

	var index = createCommonjsModule(function (module) {
	// By Curran Kelleher
	// Last updated May 2016

	// See https://github.com/datavis-tech/reactive-function
	var ReactiveFunction = require$$1$1;

	// See https://github.com/datavis-tech/reactive-property
	var ReactiveProperty = require$$1;

	// Functional utility for invoking methods on collections.
	function invoke(method){
	  return function(d){
	    return d[method]();
	  };
	}

	// The constructor for reactive models.
	// This function is exported as the public API of this module.
	function ReactiveModel(){

	  // An array of property names for exposed properties.
	  var exposedProperties;

	  // This is a string, the name of the last property added.
	  // This is used in `expose()`;
	  var lastPropertyAdded;

	  // The configuration of the model is represented as an object and stored
	  // in this reactive property. Note that only values for exposed properties
	  // whose values differ from their defaults are included in the configuration object.
	  // The purpose of the configuration accessor API is serialization and deserialization,
	  // so default values are left out for a concise serialized form.
	  var configurationProperty = ReactiveProperty();
	  configurationProperty.propertyName = "configuration";

	  // This is a reactive function set up to listen for changes in all
	  // exposed properties and set the configurationProperty value.
	  var configurationReactiveFunction;

	  // An array of reactive functions that have been set up on this model.
	  // These are tracked only so they can be destroyed in model.destroy().
	  var reactiveFunctions = [];

	  // The model instance object.
	  // This is the value returned from the constructor.
	  var model = function (){
	    var outputPropertyName, callback, inputPropertyNames

	    if(arguments.length === 0){
	      return configurationProperty();
	    } else if(arguments.length === 1){
	      if(typeof arguments[0] === "object"){

	        // The invocation is of the form model(configuration)
	        return setConfiguration(arguments[0]);
	      } else {

	        // The invocation is of the form model(propertyName)
	        return addProperty(arguments[0]);
	      }
	    } else if(arguments.length === 2){
	      if(typeof arguments[0] === "function"){

	        // The invocation is of the form model(callback, inputPropertyNames)
	        inputPropertyNames = arguments[1];
	        callback = arguments[0];
	        outputPropertyName = undefined;
	      } else {

	        // The invocation is of the form model(propertyName, defaultValue)
	        return addProperty(arguments[0], arguments[1]);
	      }
	    } else if(arguments.length === 3){
	      outputPropertyName = arguments[0];
	      callback = arguments[1];
	      inputPropertyNames = arguments[2];
	    }

	    // inputPropertyNames may be a string of comma-separated property names,
	    // or an array of property names.
	    if(typeof inputPropertyNames === "string"){
	      inputPropertyNames = inputPropertyNames.split(",").map(invoke("trim"));
	    }

	    // TODO throw an error if a property is not on the model.
	    var inputs = inputPropertyNames.map(getProperty);

	    // Create a new reactive property for the output and assign it to the model.
	    // TODO throw an error if the output property is already defined on the model.
	    if(outputPropertyName){
	      var output = ReactiveProperty();
	      output.propertyName = outputPropertyName;
	      model[outputPropertyName] = output;
	    }

	    // If the number of arguments expected by the callback is one greater than the
	    // number of inputs, then the last argument is the "done" callback, and this
	    // reactive function will be set up to be asynchronous. The "done" callback should
	    // be called with the new value of the output property asynchronously.
	    var isAsynchronous = (callback.length === inputs.length + 1);
	    if(isAsynchronous){
	      reactiveFunctions.push(ReactiveFunction({
	        inputs: inputs,
	        callback: function (){

	          // Convert the arguments passed into this function into an array.
	          var args = Array.prototype.slice.call(arguments);

	          // Push the "done" callback onto the args array.
	          // We are actally passing the output reactive property here, invoking it
	          // as the "done" callback will set the value of the output property.
	          args.push(output);

	          // Wrap in setTimeout to guarantee that the output property is set
	          // asynchronously, outside of the current digest. This is necessary
	          // to ensure that if developers inadvertently invoke the "done" callback 
	          // synchronously, their code will still have the expected behavior.
	          setTimeout(function (){

	            // Invoke the original callback with the args array as arguments.
	            callback.apply(null, args);
	          });
	        }
	      }));
	    } else {
	      reactiveFunctions.push(ReactiveFunction({
	        inputs: inputs,
	        output: output, // This may be undefined.
	        callback: callback
	      }));
	    }
	    return model;
	  };

	  // Gets a reactive property from the model by name.
	  // Convenient for functional patterns like `propertyNames.map(getProperty)`
	  function getProperty(propertyName){
	    return model[propertyName];
	  }

	  // Adds a property to the model that is not exposed,
	  // meaning that it is not included in the configuration object.
	  function addProperty(propertyName, defaultValue){
	    var property = ReactiveProperty(defaultValue);
	    property.propertyName = propertyName;
	    model[propertyName] = property;
	    lastPropertyAdded = propertyName;
	    return model;

	    // TODO throw an error if the name is not available (e.g. another property name, "configuration" or "addPublicProperty").
	  }

	  // Exposes the last added property to the configuration.
	  function expose(){

	    // TODO test this
	    // if(!isDefined(defaultValue)){
	    //  throw new Error("model.addPublicProperty() is being " +
	    //    "invoked with an undefined default value. Default values for exposed properties " +
	    //    "must be defined, to guarantee predictable behavior. For exposed properties that " +
	    //    "are optional and should have the semantics of an undefined value, " +
	    //    "use null as the default value.");
	    //}

	    // TODO test this
	    if(!lastPropertyAdded){
	      throw Error("Expose() was called without first adding a property.");
	    }

	    var propertyName = lastPropertyAdded;

	    if(!exposedProperties){
	      exposedProperties = [];
	    }
	    exposedProperties.push(propertyName);

	    // Destroy the previous reactive function that was listening for changes
	    // in all exposed properties except the newly added one.
	    // TODO think about how this might be done only once, at the same time isFinalized is set.
	    if(configurationReactiveFunction){
	      configurationReactiveFunction.destroy();
	    }

	    // Set up the new reactive function that will listen for changes
	    // in all exposed properties including the newly added one.
	    var inputPropertyNames = exposedProperties;

	    //console.log(inputPropertyNames);
	    configurationReactiveFunction = ReactiveFunction({
	      inputs: inputPropertyNames.map(getProperty),
	      output: configurationProperty,
	      callback: function (){
	        var configuration = {};
	        inputPropertyNames.forEach(function (propertyName){
	          var property = getProperty(propertyName);

	          // Omit default values from the returned configuration object.
	          if(property() !== property.default()){
	            configuration[propertyName] = property();
	          }
	        });
	        return configuration;
	      }
	    });

	    // Support method chaining.
	    return model;
	  }

	  function setConfiguration(newConfiguration){

	    exposedProperties.forEach(function (propertyName){
	      var property = getProperty(propertyName);
	      var oldValue = property();
	      var newValue;

	      if(propertyName in newConfiguration){
	        newValue = newConfiguration[propertyName];
	      } else {
	        newValue = property.default();
	      }

	      if(oldValue !== newValue){
	        model[propertyName](newValue);
	      }
	    });

	    return model;
	  }

	  // Destroys all reactive functions and properties that have been added to the model.
	  function destroy(){
	    
	    // Destroy reactive functions.
	    reactiveFunctions.forEach(invoke("destroy"));
	    if(configurationReactiveFunction){
	      configurationReactiveFunction.destroy();
	    }
	    
	    // Destroy properties (removes listeners).
	    Object.keys(model).forEach(function (propertyName){
	      var property = model[propertyName];
	      if(property.destroy){
	        property.destroy();
	      }
	    });

	    // Release references.
	    reactiveFunctions = undefined;
	    configurationReactiveFunction = undefined;
	  }

	  function call (fn){
	    var args = Array.prototype.slice.call(arguments);
	    args[0] = model;
	    fn.apply(null, args);
	    return model;
	  };

	  model.expose = expose;
	  model.destroy = destroy;
	  model.call = call;
	  model.on = function (callback){
	  
	    // Ensure the callback is invoked asynchronously,
	    // so that property values can be set inside it.
	    return configurationProperty.on(function (newConfiguration){
	      setTimeout(function (){
	        callback(newConfiguration);
	      }, 0);
	    });
	  };

	  model.off = configurationProperty.off;

	  // Expose digest on instances for convenience.
	  model.digest = function (){
	    ReactiveModel.digest();
	    return model;
	  };

	  return model;
	}

	// Expose static functions from ReactiveFunction.
	ReactiveModel.digest         = ReactiveFunction.digest;
	ReactiveModel.serializeGraph = ReactiveFunction.serializeGraph;
	ReactiveModel.link           = ReactiveFunction.link;

	//ReactiveModel.nextFrame = ReactiveFunction.nextFrame;

	module.exports = ReactiveModel;
	});

	var ReactiveModel = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	var noop = {value: function() {}};

	function dispatch() {
	  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	    if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
	    _[t] = [];
	  }
	  return new Dispatch(_);
	}

	function Dispatch(_) {
	  this._ = _;
	}

	function parseTypenames$1(typenames, types) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	    return {type: t, name: name};
	  });
	}

	Dispatch.prototype = dispatch.prototype = {
	  constructor: Dispatch,
	  on: function(typename, callback) {
	    var _ = this._,
	        T = parseTypenames$1(typename + "", _),
	        t,
	        i = -1,
	        n = T.length;

	    // If no callback was specified, return the callback of the given type and name.
	    if (arguments.length < 2) {
	      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
	      return;
	    }

	    // If a type was specified, set the callback for the given type and name.
	    // Otherwise, if a null callback was specified, remove callbacks of the given name.
	    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
	    while (++i < n) {
	      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
	      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
	    }

	    return this;
	  },
	  copy: function() {
	    var copy = {}, _ = this._;
	    for (var t in _) copy[t] = _[t].slice();
	    return new Dispatch(copy);
	  },
	  call: function(type, that) {
	    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  },
	  apply: function(type, that, args) {
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  }
	};

	function get$1(type, name) {
	  for (var i = 0, n = type.length, c; i < n; ++i) {
	    if ((c = type[i]).name === name) {
	      return c.value;
	    }
	  }
	}

	function set$1(type, name, callback) {
	  for (var i = 0, n = type.length; i < n; ++i) {
	    if (type[i].name === name) {
	      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
	      break;
	    }
	  }
	  if (callback != null) type.push({name: name, value: callback});
	  return type;
	}

	var emptyOn = dispatch("start", "end", "interrupt");

	function define$1(constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	}

	function extend(parent, definition) {
	  var prototype = Object.create(parent.prototype);
	  for (var key in definition) prototype[key] = definition[key];
	  return prototype;
	}

	function Color() {}

	var darker = 0.7;
	var brighter = 1 / darker;

	var reHex3 = /^#([0-9a-f]{3})$/;
	var reHex6 = /^#([0-9a-f]{6})$/;
	var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
	var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
	var reRgbaInteger = /^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	var reRgbaPercent = /^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
	var reHslaPercent = /^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	var named = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};

	define$1(Color, color, {
	  displayable: function() {
	    return this.rgb().displayable();
	  },
	  toString: function() {
	    return this.rgb() + "";
	  }
	});

	function color(format) {
	  var m;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
	      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
	      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	      : named.hasOwnProperty(format) ? rgbn(named[format])
	      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
	      : null;
	}

	function rgbn(n) {
	  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb(r, g, b, a);
	}

	function rgbConvert(o) {
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Rgb;
	  o = o.rgb();
	  return new Rgb(o.r, o.g, o.b, o.opacity);
	}

	function colorRgb(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	}

	function Rgb(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define$1(Rgb, colorRgb, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb: function() {
	    return this;
	  },
	  displayable: function() {
	    return (0 <= this.r && this.r <= 255)
	        && (0 <= this.g && this.g <= 255)
	        && (0 <= this.b && this.b <= 255)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  toString: function() {
	    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	    return (a === 1 ? "rgb(" : "rgba(")
	        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
	        + (a === 1 ? ")" : ", " + a + ")");
	  }
	}));

	function hsla(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;
	  else if (l <= 0 || l >= 1) h = s = NaN;
	  else if (s <= 0) h = NaN;
	  return new Hsl(h, s, l, a);
	}

	function hslConvert(o) {
	  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Hsl;
	  if (o instanceof Hsl) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;
	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;
	    else if (g === max) h = (b - r) / s + 2;
	    else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }
	  return new Hsl(h, s, l, o.opacity);
	}

	function colorHsl(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$1(Hsl, colorHsl, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(
	      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
	      hsl2rgb(h, m1, m2),
	      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
	      this.opacity
	    );
	  },
	  displayable: function() {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
	        && (0 <= this.l && this.l <= 1)
	        && (0 <= this.opacity && this.opacity <= 1);
	  }
	}));

	/* From FvD 13.37, CSS Color Module Level 3 */
	function hsl2rgb(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60
	      : h < 180 ? m2
	      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
	      : m1) * 255;
	}

	var deg2rad = Math.PI / 180;
	var rad2deg = 180 / Math.PI;

	var Kn = 18;
	var Xn = 0.950470;
	var Yn = 1;
	var Zn = 1.088830;
	var t0 = 4 / 29;
	var t1 = 6 / 29;
	var t2 = 3 * t1 * t1;
	var t3 = t1 * t1 * t1;
	function labConvert(o) {
	  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
	  if (o instanceof Hcl) {
	    var h = o.h * deg2rad;
	    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
	  }
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var b = rgb2xyz(o.r),
	      a = rgb2xyz(o.g),
	      l = rgb2xyz(o.b),
	      x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
	      y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
	      z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
	  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
	}

	function lab(l, a, b, opacity) {
	  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
	}

	function Lab(l, a, b, opacity) {
	  this.l = +l;
	  this.a = +a;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define$1(Lab, lab, extend(Color, {
	  brighter: function(k) {
	    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  darker: function(k) {
	    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  rgb: function() {
	    var y = (this.l + 16) / 116,
	        x = isNaN(this.a) ? y : y + this.a / 500,
	        z = isNaN(this.b) ? y : y - this.b / 200;
	    y = Yn * lab2xyz(y);
	    x = Xn * lab2xyz(x);
	    z = Zn * lab2xyz(z);
	    return new Rgb(
	      xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
	      xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
	      xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
	      this.opacity
	    );
	  }
	}));

	function xyz2lab(t) {
	  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
	}

	function lab2xyz(t) {
	  return t > t1 ? t * t * t : t2 * (t - t0);
	}

	function xyz2rgb(x) {
	  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
	}

	function rgb2xyz(x) {
	  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
	}

	function hclConvert(o) {
	  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
	  if (!(o instanceof Lab)) o = labConvert(o);
	  var h = Math.atan2(o.b, o.a) * rad2deg;
	  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
	}

	function colorHcl(h, c, l, opacity) {
	  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
	}

	function Hcl(h, c, l, opacity) {
	  this.h = +h;
	  this.c = +c;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$1(Hcl, colorHcl, extend(Color, {
	  brighter: function(k) {
	    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
	  },
	  darker: function(k) {
	    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
	  },
	  rgb: function() {
	    return labConvert(this).rgb();
	  }
	}));

	var A = -0.14861;
	var B = +1.78277;
	var C = -0.29227;
	var D = -0.90649;
	var E = +1.97294;
	var ED = E * D;
	var EB = E * B;
	var BC_DA = B * C - D * A;
	function cubehelixConvert(o) {
	  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
	      bl = b - l,
	      k = (E * (g - l) - C * bl) / D,
	      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
	      h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
	  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
	}

	function cubehelix(h, s, l, opacity) {
	  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
	}

	function Cubehelix(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$1(Cubehelix, cubehelix, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
	        l = +this.l,
	        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	        cosh = Math.cos(h),
	        sinh = Math.sin(h);
	    return new Rgb(
	      255 * (l + a * (A * cosh + B * sinh)),
	      255 * (l + a * (C * cosh + D * sinh)),
	      255 * (l + a * (E * cosh)),
	      this.opacity
	    );
	  }
	}));

	function constant$1(x) {
	  return function() {
	    return x;
	  };
	}

	function linear(a, d) {
	  return function(t) {
	    return a + t * d;
	  };
	}

	function exponential(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function hue(a, b) {
	  var d = b - a;
	  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a) ? b : a);
	}

	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function(a, b) {
	    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
	  };
	}

	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
	}

	(function rgbGamma(y) {
	  var color = gamma(y);

	  function rgb(start, end) {
	    var r = color((start = colorRgb(start)).r, (end = colorRgb(end)).r),
	        g = color(start.g, end.g),
	        b = color(start.b, end.b),
	        opacity = color(start.opacity, end.opacity);
	    return function(t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb.gamma = rgbGamma;

	  return rgb;
	})(1);

	function cubehelix$1(hue) {
	  return (function cubehelixGamma(y) {
	    y = +y;

	    function cubehelix$$(start, end) {
	      var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h),
	          s = nogamma(start.s, end.s),
	          l = nogamma(start.l, end.l),
	          opacity = nogamma(start.opacity, end.opacity);
	      return function(t) {
	        start.h = h(t);
	        start.s = s(t);
	        start.l = l(Math.pow(t, y));
	        start.opacity = opacity(t);
	        return start + "";
	      };
	    }

	    cubehelix$$.gamma = cubehelixGamma;

	    return cubehelix$$;
	  })(1);
	}

	cubehelix$1(hue);
	var cubehelixLong = cubehelix$1(nogamma);

	var exponent = 3;

	var polyIn = (function custom(e) {
	  e = +e;

	  function polyIn(t) {
	    return Math.pow(t, e);
	  }

	  polyIn.exponent = custom;

	  return polyIn;
	})(exponent);

	var polyOut = (function custom(e) {
	  e = +e;

	  function polyOut(t) {
	    return 1 - Math.pow(1 - t, e);
	  }

	  polyOut.exponent = custom;

	  return polyOut;
	})(exponent);

	var polyInOut = (function custom(e) {
	  e = +e;

	  function polyInOut(t) {
	    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
	  }

	  polyInOut.exponent = custom;

	  return polyInOut;
	})(exponent);

	var overshoot = 1.70158;

	var backIn = (function custom(s) {
	  s = +s;

	  function backIn(t) {
	    return t * t * ((s + 1) * t - s);
	  }

	  backIn.overshoot = custom;

	  return backIn;
	})(overshoot);

	var backOut = (function custom(s) {
	  s = +s;

	  function backOut(t) {
	    return --t * t * ((s + 1) * t + s) + 1;
	  }

	  backOut.overshoot = custom;

	  return backOut;
	})(overshoot);

	var backInOut = (function custom(s) {
	  s = +s;

	  function backInOut(t) {
	    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
	  }

	  backInOut.overshoot = custom;

	  return backInOut;
	})(overshoot);

	var tau = 2 * Math.PI;
	var amplitude = 1;
	var period = 0.3;
	var elasticIn = (function custom(a, p) {
	  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	  function elasticIn(t) {
	    return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
	  }

	  elasticIn.amplitude = function(a) { return custom(a, p * tau); };
	  elasticIn.period = function(p) { return custom(a, p); };

	  return elasticIn;
	})(amplitude, period);

	var elasticOut = (function custom(a, p) {
	  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	  function elasticOut(t) {
	    return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
	  }

	  elasticOut.amplitude = function(a) { return custom(a, p * tau); };
	  elasticOut.period = function(p) { return custom(a, p); };

	  return elasticOut;
	})(amplitude, period);

	var elasticInOut = (function custom(a, p) {
	  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	  function elasticInOut(t) {
	    return ((t = t * 2 - 1) < 0
	        ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
	        : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
	  }

	  elasticInOut.amplitude = function(a) { return custom(a, p * tau); };
	  elasticInOut.period = function(p) { return custom(a, p); };

	  return elasticInOut;
	})(amplitude, period);

	var xhtml$1 = "http://www.w3.org/1999/xhtml";

	var namespaces$1 = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml$1,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	function namespace$1(name) {
	  var prefix = name += "", i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces$1.hasOwnProperty(prefix) ? {space: namespaces$1[prefix], local: name} : name;
	}

	function creatorInherit$1(name) {
	  return function() {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml$1 && document.documentElement.namespaceURI === xhtml$1
	        ? document.createElement(name)
	        : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed$1(fullname) {
	  return function() {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	function creator$1(name) {
	  var fullname = namespace$1(name);
	  return (fullname.local
	      ? creatorFixed$1
	      : creatorInherit$1)(fullname);
	}

	var nextId$1 = 0;

	function local$1() {
	  return new Local$1;
	}

	function Local$1() {
	  this._ = "@" + (++nextId$1).toString(36);
	}

	Local$1.prototype = local$1.prototype = {
	  constructor: Local$1,
	  get: function(node) {
	    var id = this._;
	    while (!(id in node)) if (!(node = node.parentNode)) return;
	    return node[id];
	  },
	  set: function(node, value) {
	    return node[this._] = value;
	  },
	  remove: function(node) {
	    return this._ in node && delete node[this._];
	  },
	  toString: function() {
	    return this._;
	  }
	};

	var matcher$2 = function(selector) {
	  return function() {
	    return this.matches(selector);
	  };
	};

	if (typeof document !== "undefined") {
	  var element$2 = document.documentElement;
	  if (!element$2.matches) {
	    var vendorMatches$1 = element$2.webkitMatchesSelector
	        || element$2.msMatchesSelector
	        || element$2.mozMatchesSelector
	        || element$2.oMatchesSelector;
	    matcher$2 = function(selector) {
	      return function() {
	        return vendorMatches$1.call(this, selector);
	      };
	    };
	  }
	}

	var matcher$3 = matcher$2;

	var filterEvents$1 = {};

	var event$1 = null;

	if (typeof document !== "undefined") {
	  var element$3 = document.documentElement;
	  if (!("onmouseenter" in element$3)) {
	    filterEvents$1 = {mouseenter: "mouseover", mouseleave: "mouseout"};
	  }
	}

	function filterContextListener$1(listener, index, group) {
	  listener = contextListener$1(listener, index, group);
	  return function(event) {
	    var related = event.relatedTarget;
	    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
	      listener.call(this, event);
	    }
	  };
	}

	function contextListener$1(listener, index, group) {
	  return function(event1) {
	    var event0 = event$1; // Events can be reentrant (e.g., focus).
	    event$1 = event1;
	    try {
	      listener.call(this, this.__data__, index, group);
	    } finally {
	      event$1 = event0;
	    }
	  };
	}

	function parseTypenames$2(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return {type: t, name: name};
	  });
	}

	function onRemove$1(typename) {
	  return function() {
	    var on = this.__on;
	    if (!on) return;
	    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	      } else {
	        on[++i] = o;
	      }
	    }
	    if (++i) on.length = i;
	    else delete this.__on;
	  };
	}

	function onAdd$1(typename, value, capture) {
	  var wrap = filterEvents$1.hasOwnProperty(typename.type) ? filterContextListener$1 : contextListener$1;
	  return function(d, i, group) {
	    var on = this.__on, o, listener = wrap(value, i, group);
	    if (on) for (var j = 0, m = on.length; j < m; ++j) {
	      if ((o = on[j]).type === typename.type && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
	        o.value = value;
	        return;
	      }
	    }
	    this.addEventListener(typename.type, listener, capture);
	    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
	    if (!on) this.__on = [o];
	    else on.push(o);
	  };
	}

	function selection_on$1(typename, value, capture) {
	  var typenames = parseTypenames$2(typename + ""), i, n = typenames.length, t;

	  if (arguments.length < 2) {
	    var on = this.node().__on;
	    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	      for (i = 0, o = on[j]; i < n; ++i) {
	        if ((t = typenames[i]).type === o.type && t.name === o.name) {
	          return o.value;
	        }
	      }
	    }
	    return;
	  }

	  on = value ? onAdd$1 : onRemove$1;
	  if (capture == null) capture = false;
	  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
	  return this;
	}

	function selector$1(selector) {
	  return function() {
	    return this.querySelector(selector);
	  };
	}

	function selection_select$1(select) {
	  if (typeof select !== "function") select = selector$1(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection$2(subgroups, this._parents);
	}

	function selectorAll$1(selector) {
	  return function() {
	    return this.querySelectorAll(selector);
	  };
	}

	function selection_selectAll$1(select) {
	  if (typeof select !== "function") select = selectorAll$1(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection$2(subgroups, parents);
	}

	function selection_filter$1(match) {
	  if (typeof match !== "function") match = matcher$3(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection$2(subgroups, this._parents);
	}

	function constant$2(x) {
	  return function() {
	    return x;
	  };
	}

	var keyPrefix$1 = "$"; // Protect against keys like “__proto__”.

	function bindIndex$1(parent, group, enter, update, exit, data) {
	  var i = 0,
	      node,
	      groupLength = group.length,
	      dataLength = data.length;

	  // Put any non-null nodes that fit into update.
	  // Put any null nodes into enter.
	  // Put any remaining data into enter.
	  for (; i < dataLength; ++i) {
	    if (node = group[i]) {
	      node.__data__ = data[i];
	      update[i] = node;
	    } else {
	      enter[i] = new EnterNode$1(parent, data[i]);
	    }
	  }

	  // Put any non-null nodes that don’t fit into exit.
	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey$1(parent, group, enter, update, exit, data, key) {
	  var i,
	      node,
	      nodeByKeyValue = {},
	      groupLength = group.length,
	      dataLength = data.length,
	      keyValues = new Array(groupLength),
	      keyValue;

	  // Compute the key for each node.
	  // If multiple nodes have the same key, the duplicates are added to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if (node = group[i]) {
	      keyValues[i] = keyValue = keyPrefix$1 + key.call(node, node.__data__, i, group);
	      if (keyValue in nodeByKeyValue) {
	        exit[i] = node;
	      } else {
	        nodeByKeyValue[keyValue] = node;
	      }
	    }
	  }

	  // Compute the key for each datum.
	  // If there a node associated with this key, join and add it to update.
	  // If there is not (or the key is a duplicate), add it to enter.
	  for (i = 0; i < dataLength; ++i) {
	    keyValue = keyPrefix$1 + key.call(parent, data[i], i, data);
	    if (node = nodeByKeyValue[keyValue]) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue[keyValue] = null;
	    } else {
	      enter[i] = new EnterNode$1(parent, data[i]);
	    }
	  }

	  // Add any remaining nodes that were not bound to data to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
	      exit[i] = node;
	    }
	  }
	}

	function selection_data$1(value, key) {
	  if (!value) {
	    data = new Array(this.size()), j = -1;
	    this.each(function(d) { data[++j] = d; });
	    return data;
	  }

	  var bind = key ? bindKey$1 : bindIndex$1,
	      parents = this._parents,
	      groups = this._groups;

	  if (typeof value !== "function") value = constant$2(value);

	  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	    var parent = parents[j],
	        group = groups[j],
	        groupLength = group.length,
	        data = value.call(parent, parent && parent.__data__, j, parents),
	        dataLength = data.length,
	        enterGroup = enter[j] = new Array(dataLength),
	        updateGroup = update[j] = new Array(dataLength),
	        exitGroup = exit[j] = new Array(groupLength);

	    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	    // Now connect the enter nodes to their following update node, such that
	    // appendChild can insert the materialized enter node before this node,
	    // rather than at the end of the parent node.
	    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	      if (previous = enterGroup[i0]) {
	        if (i0 >= i1) i1 = i0 + 1;
	        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
	        previous._next = next || null;
	      }
	    }
	  }

	  update = new Selection$2(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	}

	function EnterNode$1(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}

	EnterNode$1.prototype = {
	  constructor: EnterNode$1,
	  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	  querySelector: function(selector) { return this._parent.querySelector(selector); },
	  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	};

	function sparse$1(update) {
	  return new Array(update.length);
	}

	function selection_enter$1() {
	  return new Selection$2(this._enter || this._groups.map(sparse$1), this._parents);
	}

	function selection_exit$1() {
	  return new Selection$2(this._exit || this._groups.map(sparse$1), this._parents);
	}

	function selection_merge$1(selection) {

	  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Selection$2(merges, this._parents);
	}

	function selection_order$1() {

	  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	      if (node = group[i]) {
	        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	        next = node;
	      }
	    }
	  }

	  return this;
	}

	function selection_sort$1(compare) {
	  if (!compare) compare = ascending$1;

	  function compareNode(a, b) {
	    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	  }

	  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        sortgroup[i] = node;
	      }
	    }
	    sortgroup.sort(compareNode);
	  }

	  return new Selection$2(sortgroups, this._parents).order();
	}

	function ascending$1(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function selection_call$1() {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	}

	function selection_nodes$1() {
	  var nodes = new Array(this.size()), i = -1;
	  this.each(function() { nodes[++i] = this; });
	  return nodes;
	}

	function selection_node$1() {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	}

	function selection_size$1() {
	  var size = 0;
	  this.each(function() { ++size; });
	  return size;
	}

	function selection_empty$1() {
	  return !this.node();
	}

	function selection_each$1(callback) {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	}

	function attrRemove$2(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS$2(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant$2(name, value) {
	  return function() {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS$2(fullname, value) {
	  return function() {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction$2(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);
	    else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS$2(fullname, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	    else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	function selection_attr$1(name, value) {
	  var fullname = namespace$1(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local
	        ? node.getAttributeNS(fullname.space, fullname.local)
	        : node.getAttribute(fullname);
	  }

	  return this.each((value == null
	      ? (fullname.local ? attrRemoveNS$2 : attrRemove$2) : (typeof value === "function"
	      ? (fullname.local ? attrFunctionNS$2 : attrFunction$2)
	      : (fullname.local ? attrConstantNS$2 : attrConstant$2)))(fullname, value));
	}

	function defaultView(node) {
	  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	      || (node.document && node) // node is a Window
	      || node.defaultView; // node is a Document
	}

	function styleRemove$2(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant$2(name, value, priority) {
	  return function() {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction$2(name, value, priority) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);
	    else this.style.setProperty(name, v, priority);
	  };
	}

	function selection_style$1(name, value, priority) {
	  var node;
	  return arguments.length > 1
	      ? this.each((value == null
	            ? styleRemove$2 : typeof value === "function"
	            ? styleFunction$2
	            : styleConstant$2)(name, value, priority == null ? "" : priority))
	      : defaultView(node = this.node())
	          .getComputedStyle(node, null)
	          .getPropertyValue(name);
	}

	function propertyRemove$1(name) {
	  return function() {
	    delete this[name];
	  };
	}

	function propertyConstant$1(name, value) {
	  return function() {
	    this[name] = value;
	  };
	}

	function propertyFunction$1(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];
	    else this[name] = v;
	  };
	}

	function selection_property$1(name, value) {
	  return arguments.length > 1
	      ? this.each((value == null
	          ? propertyRemove$1 : typeof value === "function"
	          ? propertyFunction$1
	          : propertyConstant$1)(name, value))
	      : this.node()[name];
	}

	function classArray$1(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList$1(node) {
	  return node.classList || new ClassList$1(node);
	}

	function ClassList$1(node) {
	  this._node = node;
	  this._names = classArray$1(node.getAttribute("class") || "");
	}

	ClassList$1.prototype = {
	  add: function(name) {
	    var i = this._names.indexOf(name);
	    if (i < 0) {
	      this._names.push(name);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  remove: function(name) {
	    var i = this._names.indexOf(name);
	    if (i >= 0) {
	      this._names.splice(i, 1);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  contains: function(name) {
	    return this._names.indexOf(name) >= 0;
	  }
	};

	function classedAdd$1(node, names) {
	  var list = classList$1(node), i = -1, n = names.length;
	  while (++i < n) list.add(names[i]);
	}

	function classedRemove$1(node, names) {
	  var list = classList$1(node), i = -1, n = names.length;
	  while (++i < n) list.remove(names[i]);
	}

	function classedTrue$1(names) {
	  return function() {
	    classedAdd$1(this, names);
	  };
	}

	function classedFalse$1(names) {
	  return function() {
	    classedRemove$1(this, names);
	  };
	}

	function classedFunction$1(names, value) {
	  return function() {
	    (value.apply(this, arguments) ? classedAdd$1 : classedRemove$1)(this, names);
	  };
	}

	function selection_classed$1(name, value) {
	  var names = classArray$1(name + "");

	  if (arguments.length < 2) {
	    var list = classList$1(this.node()), i = -1, n = names.length;
	    while (++i < n) if (!list.contains(names[i])) return false;
	    return true;
	  }

	  return this.each((typeof value === "function"
	      ? classedFunction$1 : value
	      ? classedTrue$1
	      : classedFalse$1)(names, value));
	}

	function textRemove$1() {
	  this.textContent = "";
	}

	function textConstant$2(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction$2(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	function selection_text$1(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? textRemove$1 : (typeof value === "function"
	          ? textFunction$2
	          : textConstant$2)(value))
	      : this.node().textContent;
	}

	function htmlRemove$1() {
	  this.innerHTML = "";
	}

	function htmlConstant$1(value) {
	  return function() {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction$1(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	function selection_html$1(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? htmlRemove$1 : (typeof value === "function"
	          ? htmlFunction$1
	          : htmlConstant$1)(value))
	      : this.node().innerHTML;
	}

	function raise$1() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	function selection_raise$1() {
	  return this.each(raise$1);
	}

	function lower$1() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	function selection_lower$1() {
	  return this.each(lower$1);
	}

	function selection_append$1(name) {
	  var create = typeof name === "function" ? name : creator$1(name);
	  return this.select(function() {
	    return this.appendChild(create.apply(this, arguments));
	  });
	}

	function constantNull$1() {
	  return null;
	}

	function selection_insert$1(name, before) {
	  var create = typeof name === "function" ? name : creator$1(name),
	      select = before == null ? constantNull$1 : typeof before === "function" ? before : selector$1(before);
	  return this.select(function() {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	}

	function remove$1() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	function selection_remove$1() {
	  return this.each(remove$1);
	}

	function selection_datum$1(value) {
	  return arguments.length
	      ? this.property("__data__", value)
	      : this.node().__data__;
	}

	function dispatchEvent$1(node, type, params) {
	  var window = defaultView(node),
	      event = window.CustomEvent;

	  if (event) {
	    event = new event(type, params);
	  } else {
	    event = window.document.createEvent("Event");
	    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
	    else event.initEvent(type, false, false);
	  }

	  node.dispatchEvent(event);
	}

	function dispatchConstant$1(type, params) {
	  return function() {
	    return dispatchEvent$1(this, type, params);
	  };
	}

	function dispatchFunction$1(type, params) {
	  return function() {
	    return dispatchEvent$1(this, type, params.apply(this, arguments));
	  };
	}

	function selection_dispatch$1(type, params) {
	  return this.each((typeof params === "function"
	      ? dispatchFunction$1
	      : dispatchConstant$1)(type, params));
	}

	var root$2 = [null];

	function Selection$2(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection$1() {
	  return new Selection$2([[document.documentElement]], root$2);
	}

	Selection$2.prototype = selection$1.prototype = {
	  constructor: Selection$2,
	  select: selection_select$1,
	  selectAll: selection_selectAll$1,
	  filter: selection_filter$1,
	  data: selection_data$1,
	  enter: selection_enter$1,
	  exit: selection_exit$1,
	  merge: selection_merge$1,
	  order: selection_order$1,
	  sort: selection_sort$1,
	  call: selection_call$1,
	  nodes: selection_nodes$1,
	  node: selection_node$1,
	  size: selection_size$1,
	  empty: selection_empty$1,
	  each: selection_each$1,
	  attr: selection_attr$1,
	  style: selection_style$1,
	  property: selection_property$1,
	  classed: selection_classed$1,
	  text: selection_text$1,
	  html: selection_html$1,
	  raise: selection_raise$1,
	  lower: selection_lower$1,
	  append: selection_append$1,
	  insert: selection_insert$1,
	  remove: selection_remove$1,
	  datum: selection_datum$1,
	  on: selection_on$1,
	  dispatch: selection_dispatch$1
	};

	function select$1(selector) {
	  return typeof selector === "string"
	      ? new Selection$2([[document.querySelector(selector)]], [document.documentElement])
	      : new Selection$2([[selector]], root$2);
	}

	// Resizes the SVG container.
	function SVG (my){
	  my("svg")
	    ("width", 960)
	    ("height", 500)

	    ("svgSelection", select$1, "svg")

	    ("svg-width", function (svgSelection, width){
	      svgSelection.attr("width", width);
	    }, "svgSelection, width")

	    ("svg-height", function (svgSelection, height){
	      svgSelection.attr("height", height);
	    }, "svgSelection, height");
	}

	// Encapsulates the margin convention.
	function Margin(my){
	  my("marginTop", 50)
	    ("marginBottom", 50)
	    ("marginLeft", 50)
	    ("marginRight", 50)

	    ("innerWidth", function (width, marginLeft, marginRight){
	      return width - marginLeft - marginRight;
	    }, "width, marginLeft, marginRight")

	    ("innerHeight", function (height, marginTop, marginBottom){
	      return height - marginTop - marginBottom;
	    }, "height, marginTop, marginBottom")

	    ("g", function (svgSelection){

	      var g = svgSelection.selectAll(".reactive-vis-margin-g")
	        .data([1]);

	      return g.enter().append("g")
	          .attr("class", "reactive-vis-margin-g")
	        .merge(g);

	    }, "svgSelection")

	    ("g-transform", function (g, marginLeft, marginTop){
	      g.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
	    }, "g, marginLeft, marginTop");
	}

	function Data (my){
	  my("data");
	}

	function Column (my, name){
	  my(name + "Column")
	    (name + "Accessor", function (column){
	      return function (d){ return d[column]; };
	    }, name + "Column");
	}

	function Scale (my, name, scaleConstructor){

	  var scale = scaleConstructor();

	  my (name + "Scale", function(domain, range){
	    return scale
	      .domain(domain)
	      .range(range);
	  }, [name + "Domain", name + "Range"]);

	  my(name + "Scaled", function(scale, accessor){
	    return function (d){
	      return scale(accessor(d));
	    };
	  }, [name + "Scale", name + "Accessor"]);
	}

	// Respond to resize by setting width and height from DOM element.
	function Resize(my, el){

	  function resize(){
	    my.width(el.clientWidth)
	      .height(el.clientHeight);
	  }

	  // Set initial size.
	  resize();

	  // Guard so unit tests don't break in NodeJS environment.
	  if(typeof window !== "undefined"){

	    // Update size when the browser window is resized.
	    window.addEventListener("resize", resize);
	  }
	}

	function Circle(){
	  return ReactiveModel()
	    .call(SVG)
	    .call(Data)

	    ("circle", function (svgSelection, data){

	      var circle = svgSelection.selectAll(".reactive-vis-circle")
	        .data(data);

	      return circle.enter().append("circle")
	          .attr("class", "reactive-vis-circle")
	        .merge(circle);

	    }, "svgSelection, data");
	}

	function ascending$2(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function bisector(compare) {
	  if (compare.length === 1) compare = ascendingComparator(compare);
	  return {
	    left: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) < 0) lo = mid + 1;
	        else hi = mid;
	      }
	      return lo;
	    },
	    right: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) > 0) hi = mid;
	        else lo = mid + 1;
	      }
	      return lo;
	    }
	  };
	}

	function ascendingComparator(f) {
	  return function(d, x) {
	    return ascending$2(f(d), x);
	  };
	}

	var ascendingBisect = bisector(ascending$2);

	function extent(array, f) {
	  var i = -1,
	      n = array.length,
	      a,
	      b,
	      c;

	  if (f == null) {
	    while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
	    while (++i < n) if ((b = array[i]) != null) {
	      if (a > b) a = b;
	      if (c < b) c = b;
	    }
	  }

	  else {
	    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
	    while (++i < n) if ((b = f(array[i], i, array)) != null) {
	      if (a > b) a = b;
	      if (c < b) c = b;
	    }
	  }

	  return [a, c];
	}

	function max(array, f) {
	  var i = -1,
	      n = array.length,
	      a,
	      b;

	  if (f == null) {
	    while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	    while (++i < n) if ((b = array[i]) != null && b > a) a = b;
	  }

	  else {
	    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	    while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
	  }

	  return a;
	}

	function ascending$3(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function bisector$1(compare) {
	  if (compare.length === 1) compare = ascendingComparator$1(compare);
	  return {
	    left: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) < 0) lo = mid + 1;
	        else hi = mid;
	      }
	      return lo;
	    },
	    right: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) > 0) hi = mid;
	        else lo = mid + 1;
	      }
	      return lo;
	    }
	  };
	}

	function ascendingComparator$1(f) {
	  return function(d, x) {
	    return ascending$3(f(d), x);
	  };
	}

	var ascendingBisect$1 = bisector$1(ascending$3);
	var bisectRight$1 = ascendingBisect$1.right;

	function range$1(start, stop, step) {
	  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

	  var i = -1,
	      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
	      range = new Array(n);

	  while (++i < n) {
	    range[i] = start + i * step;
	  }

	  return range;
	}

var 	e10$1 = Math.sqrt(50);
var 	e5$1 = Math.sqrt(10);
var 	e2$1 = Math.sqrt(2);
	function ticks$1(start, stop, count) {
	  var step = tickStep$1(start, stop, count);
	  return range$1(
	    Math.ceil(start / step) * step,
	    Math.floor(stop / step) * step + step / 2, // inclusive
	    step
	  );
	}

	function tickStep$1(start, stop, count) {
	  var step0 = Math.abs(stop - start) / Math.max(0, count),
	      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	      error = step0 / step1;
	  if (error >= e10$1) step1 *= 10;
	  else if (error >= e5$1) step1 *= 5;
	  else if (error >= e2$1) step1 *= 2;
	  return stop < start ? -step1 : step1;
	}

	var array$3 = Array.prototype;

	var map$3 = array$3.map;
	var slice$2 = array$3.slice;

	function define$2(constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	}

	function extend$1(parent, definition) {
	  var prototype = Object.create(parent.prototype);
	  for (var key in definition) prototype[key] = definition[key];
	  return prototype;
	}

	function Color$1() {}

	var darker$1 = 0.7;
	var brighter$1 = 1 / darker$1;

var 	reHex3$1 = /^#([0-9a-f]{3})$/;
var 	reHex6$1 = /^#([0-9a-f]{6})$/;
var 	reRgbInteger$1 = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
var 	reRgbPercent$1 = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
var 	reRgbaInteger$1 = /^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
var 	reRgbaPercent$1 = /^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
var 	reHslPercent$1 = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
var 	reHslaPercent$1 = /^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	var named$1 = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};

	define$2(Color$1, color$1, {
	  displayable: function() {
	    return this.rgb().displayable();
	  },
	  toString: function() {
	    return this.rgb() + "";
	  }
	});

	function color$1(format) {
	  var m;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex3$1.exec(format)) ? (m = parseInt(m[1], 16), new Rgb$1((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
	      : (m = reHex6$1.exec(format)) ? rgbn$1(parseInt(m[1], 16)) // #ff0000
	      : (m = reRgbInteger$1.exec(format)) ? new Rgb$1(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	      : (m = reRgbPercent$1.exec(format)) ? new Rgb$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	      : (m = reRgbaInteger$1.exec(format)) ? rgba$1(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	      : (m = reRgbaPercent$1.exec(format)) ? rgba$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	      : (m = reHslPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	      : (m = reHslaPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	      : named$1.hasOwnProperty(format) ? rgbn$1(named$1[format])
	      : format === "transparent" ? new Rgb$1(NaN, NaN, NaN, 0)
	      : null;
	}

	function rgbn$1(n) {
	  return new Rgb$1(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba$1(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb$1(r, g, b, a);
	}

	function rgbConvert$1(o) {
	  if (!(o instanceof Color$1)) o = color$1(o);
	  if (!o) return new Rgb$1;
	  o = o.rgb();
	  return new Rgb$1(o.r, o.g, o.b, o.opacity);
	}

	function colorRgb$1(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert$1(r) : new Rgb$1(r, g, b, opacity == null ? 1 : opacity);
	}

	function Rgb$1(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define$2(Rgb$1, colorRgb$1, extend$1(Color$1, {
	  brighter: function(k) {
	    k = k == null ? brighter$1 : Math.pow(brighter$1, k);
	    return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker$1 : Math.pow(darker$1, k);
	    return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb: function() {
	    return this;
	  },
	  displayable: function() {
	    return (0 <= this.r && this.r <= 255)
	        && (0 <= this.g && this.g <= 255)
	        && (0 <= this.b && this.b <= 255)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  toString: function() {
	    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	    return (a === 1 ? "rgb(" : "rgba(")
	        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
	        + (a === 1 ? ")" : ", " + a + ")");
	  }
	}));

	function hsla$1(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;
	  else if (l <= 0 || l >= 1) h = s = NaN;
	  else if (s <= 0) h = NaN;
	  return new Hsl$1(h, s, l, a);
	}

	function hslConvert$1(o) {
	  if (o instanceof Hsl$1) return new Hsl$1(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color$1)) o = color$1(o);
	  if (!o) return new Hsl$1;
	  if (o instanceof Hsl$1) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;
	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;
	    else if (g === max) h = (b - r) / s + 2;
	    else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }
	  return new Hsl$1(h, s, l, o.opacity);
	}

	function colorHsl$1(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert$1(h) : new Hsl$1(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl$1(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$2(Hsl$1, colorHsl$1, extend$1(Color$1, {
	  brighter: function(k) {
	    k = k == null ? brighter$1 : Math.pow(brighter$1, k);
	    return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker$1 : Math.pow(darker$1, k);
	    return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb$1(
	      hsl2rgb$1(h >= 240 ? h - 240 : h + 120, m1, m2),
	      hsl2rgb$1(h, m1, m2),
	      hsl2rgb$1(h < 120 ? h + 240 : h - 120, m1, m2),
	      this.opacity
	    );
	  },
	  displayable: function() {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
	        && (0 <= this.l && this.l <= 1)
	        && (0 <= this.opacity && this.opacity <= 1);
	  }
	}));

	/* From FvD 13.37, CSS Color Module Level 3 */
	function hsl2rgb$1(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60
	      : h < 180 ? m2
	      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
	      : m1) * 255;
	}

	var deg2rad$1 = Math.PI / 180;
	var rad2deg$1 = 180 / Math.PI;

var 	Kn$1 = 18;
var 	Xn$1 = 0.950470;
var 	Yn$1 = 1;
var 	Zn$1 = 1.088830;
var 	t0$1 = 4 / 29;
var 	t1$1 = 6 / 29;
var 	t2$1 = 3 * t1$1 * t1$1;
var 	t3$1 = t1$1 * t1$1 * t1$1;
	function labConvert$1(o) {
	  if (o instanceof Lab$1) return new Lab$1(o.l, o.a, o.b, o.opacity);
	  if (o instanceof Hcl$1) {
	    var h = o.h * deg2rad$1;
	    return new Lab$1(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
	  }
	  if (!(o instanceof Rgb$1)) o = rgbConvert$1(o);
	  var b = rgb2xyz$1(o.r),
	      a = rgb2xyz$1(o.g),
	      l = rgb2xyz$1(o.b),
	      x = xyz2lab$1((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn$1),
	      y = xyz2lab$1((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn$1),
	      z = xyz2lab$1((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn$1);
	  return new Lab$1(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
	}

	function lab$2(l, a, b, opacity) {
	  return arguments.length === 1 ? labConvert$1(l) : new Lab$1(l, a, b, opacity == null ? 1 : opacity);
	}

	function Lab$1(l, a, b, opacity) {
	  this.l = +l;
	  this.a = +a;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define$2(Lab$1, lab$2, extend$1(Color$1, {
	  brighter: function(k) {
	    return new Lab$1(this.l + Kn$1 * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  darker: function(k) {
	    return new Lab$1(this.l - Kn$1 * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  rgb: function() {
	    var y = (this.l + 16) / 116,
	        x = isNaN(this.a) ? y : y + this.a / 500,
	        z = isNaN(this.b) ? y : y - this.b / 200;
	    y = Yn$1 * lab2xyz$1(y);
	    x = Xn$1 * lab2xyz$1(x);
	    z = Zn$1 * lab2xyz$1(z);
	    return new Rgb$1(
	      xyz2rgb$1( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
	      xyz2rgb$1(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
	      xyz2rgb$1( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
	      this.opacity
	    );
	  }
	}));

	function xyz2lab$1(t) {
	  return t > t3$1 ? Math.pow(t, 1 / 3) : t / t2$1 + t0$1;
	}

	function lab2xyz$1(t) {
	  return t > t1$1 ? t * t * t : t2$1 * (t - t0$1);
	}

	function xyz2rgb$1(x) {
	  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
	}

	function rgb2xyz$1(x) {
	  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
	}

	function hclConvert$1(o) {
	  if (o instanceof Hcl$1) return new Hcl$1(o.h, o.c, o.l, o.opacity);
	  if (!(o instanceof Lab$1)) o = labConvert$1(o);
	  var h = Math.atan2(o.b, o.a) * rad2deg$1;
	  return new Hcl$1(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
	}

	function colorHcl$1(h, c, l, opacity) {
	  return arguments.length === 1 ? hclConvert$1(h) : new Hcl$1(h, c, l, opacity == null ? 1 : opacity);
	}

	function Hcl$1(h, c, l, opacity) {
	  this.h = +h;
	  this.c = +c;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$2(Hcl$1, colorHcl$1, extend$1(Color$1, {
	  brighter: function(k) {
	    return new Hcl$1(this.h, this.c, this.l + Kn$1 * (k == null ? 1 : k), this.opacity);
	  },
	  darker: function(k) {
	    return new Hcl$1(this.h, this.c, this.l - Kn$1 * (k == null ? 1 : k), this.opacity);
	  },
	  rgb: function() {
	    return labConvert$1(this).rgb();
	  }
	}));

var 	A$1 = -0.14861;
var 	B$1 = +1.78277;
var 	C$1 = -0.29227;
var 	D$1 = -0.90649;
var 	E$1 = +1.97294;
var 	ED$1 = E$1 * D$1;
var 	EB$1 = E$1 * B$1;
var 	BC_DA$1 = B$1 * C$1 - D$1 * A$1;
	function cubehelixConvert$1(o) {
	  if (o instanceof Cubehelix$1) return new Cubehelix$1(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Rgb$1)) o = rgbConvert$1(o);
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      l = (BC_DA$1 * b + ED$1 * r - EB$1 * g) / (BC_DA$1 + ED$1 - EB$1),
	      bl = b - l,
	      k = (E$1 * (g - l) - C$1 * bl) / D$1,
	      s = Math.sqrt(k * k + bl * bl) / (E$1 * l * (1 - l)), // NaN if l=0 or l=1
	      h = s ? Math.atan2(k, bl) * rad2deg$1 - 120 : NaN;
	  return new Cubehelix$1(h < 0 ? h + 360 : h, s, l, o.opacity);
	}

	function cubehelix$3(h, s, l, opacity) {
	  return arguments.length === 1 ? cubehelixConvert$1(h) : new Cubehelix$1(h, s, l, opacity == null ? 1 : opacity);
	}

	function Cubehelix$1(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$2(Cubehelix$1, cubehelix$3, extend$1(Color$1, {
	  brighter: function(k) {
	    k = k == null ? brighter$1 : Math.pow(brighter$1, k);
	    return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker$1 : Math.pow(darker$1, k);
	    return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad$1,
	        l = +this.l,
	        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	        cosh = Math.cos(h),
	        sinh = Math.sin(h);
	    return new Rgb$1(
	      255 * (l + a * (A$1 * cosh + B$1 * sinh)),
	      255 * (l + a * (C$1 * cosh + D$1 * sinh)),
	      255 * (l + a * (E$1 * cosh)),
	      this.opacity
	    );
	  }
	}));

	function constant$5(x) {
	  return function() {
	    return x;
	  };
	}

	function linear$3(a, d) {
	  return function(t) {
	    return a + t * d;
	  };
	}

	function exponential$1(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function hue$1(a, b) {
	  var d = b - a;
	  return d ? linear$3(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$5(isNaN(a) ? b : a);
	}

	function gamma$1(y) {
	  return (y = +y) === 1 ? nogamma$1 : function(a, b) {
	    return b - a ? exponential$1(a, b, y) : constant$5(isNaN(a) ? b : a);
	  };
	}

	function nogamma$1(a, b) {
	  var d = b - a;
	  return d ? linear$3(a, d) : constant$5(isNaN(a) ? b : a);
	}

	var rgb = (function rgbGamma(y) {
	  var color = gamma$1(y);

	  function rgb(start, end) {
	    var r = color((start = colorRgb$1(start)).r, (end = colorRgb$1(end)).r),
	        g = color(start.g, end.g),
	        b = color(start.b, end.b),
	        opacity = color(start.opacity, end.opacity);
	    return function(t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb.gamma = rgbGamma;

	  return rgb;
	})(1);

	function array$4(a, b) {
	  var nb = b ? b.length : 0,
	      na = a ? Math.min(nb, a.length) : 0,
	      x = new Array(nb),
	      c = new Array(nb),
	      i;

	  for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
	  for (; i < nb; ++i) c[i] = b[i];

	  return function(t) {
	    for (i = 0; i < na; ++i) c[i] = x[i](t);
	    return c;
	  };
	}

	function reinterpolate(a, b) {
	  return a = +a, b -= a, function(t) {
	    return a + b * t;
	  };
	}

	function object$1(a, b) {
	  var i = {},
	      c = {},
	      k;

	  if (a === null || typeof a !== "object") a = {};
	  if (b === null || typeof b !== "object") b = {};

	  for (k in b) {
	    if (k in a) {
	      i[k] = interpolateValue(a[k], b[k]);
	    } else {
	      c[k] = b[k];
	    }
	  }

	  return function(t) {
	    for (k in i) c[k] = i[k](t);
	    return c;
	  };
	}

var 	reA$1 = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var 	reB$1 = new RegExp(reA$1.source, "g");
	function zero$1(b) {
	  return function() {
	    return b;
	  };
	}

	function one$1(b) {
	  return function(t) {
	    return b(t) + "";
	  };
	}

	function string(a, b) {
	  var bi = reA$1.lastIndex = reB$1.lastIndex = 0, // scan index for next number in b
	      am, // current match in a
	      bm, // current match in b
	      bs, // string preceding current number in b, if any
	      i = -1, // index in s
	      s = [], // string constants and placeholders
	      q = []; // number interpolators

	  // Coerce inputs to strings.
	  a = a + "", b = b + "";

	  // Interpolate pairs of numbers in a & b.
	  while ((am = reA$1.exec(a))
	      && (bm = reB$1.exec(b))) {
	    if ((bs = bm.index) > bi) { // a string precedes the next number in b
	      bs = b.slice(bi, bs);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }
	    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
	      if (s[i]) s[i] += bm; // coalesce with previous string
	      else s[++i] = bm;
	    } else { // interpolate non-matching numbers
	      s[++i] = null;
	      q.push({i: i, x: reinterpolate(am, bm)});
	    }
	    bi = reB$1.lastIndex;
	  }

	  // Add remains of b.
	  if (bi < b.length) {
	    bs = b.slice(bi);
	    if (s[i]) s[i] += bs; // coalesce with previous string
	    else s[++i] = bs;
	  }

	  // Special optimization for only a single match.
	  // Otherwise, interpolate each of the numbers and rejoin the string.
	  return s.length < 2 ? (q[0]
	      ? one$1(q[0].x)
	      : zero$1(b))
	      : (b = q.length, function(t) {
	          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	          return s.join("");
	        });
	}

	function interpolateValue(a, b) {
	  var t = typeof b, c;
	  return b == null || t === "boolean" ? constant$5(b)
	      : (t === "number" ? reinterpolate
	      : t === "string" ? ((c = color$1(b)) ? (b = c, rgb) : string)
	      : b instanceof color$1 ? rgb
	      : Array.isArray(b) ? array$4
	      : object$1)(a, b);
	}

	function interpolateRound(a, b) {
	  return a = +a, b -= a, function(t) {
	    return Math.round(a + b * t);
	  };
	}

	function cubehelix$4(hue) {
	  return (function cubehelixGamma(y) {
	    y = +y;

	    function cubehelix(start, end) {
	      var h = hue((start = cubehelix$3(start)).h, (end = cubehelix$3(end)).h),
	          s = nogamma$1(start.s, end.s),
	          l = nogamma$1(start.l, end.l),
	          opacity = nogamma$1(start.opacity, end.opacity);
	      return function(t) {
	        start.h = h(t);
	        start.s = s(t);
	        start.l = l(Math.pow(t, y));
	        start.opacity = opacity(t);
	        return start + "";
	      };
	    }

	    cubehelix.gamma = cubehelixGamma;

	    return cubehelix;
	  })(1);
	}

	cubehelix$4(hue$1);
	var interpolateCubehelixLong = cubehelix$4(nogamma$1);

	function constant$6(x) {
	  return function() {
	    return x;
	  };
	}

	function number$2(x) {
	  return +x;
	}

	var unit = [0, 1];

	function deinterpolate(a, b) {
	  return (b -= (a = +a))
	      ? function(x) { return (x - a) / b; }
	      : constant$6(b);
	}

	function deinterpolateClamp(deinterpolate) {
	  return function(a, b) {
	    var d = deinterpolate(a = +a, b = +b);
	    return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
	  };
	}

	function reinterpolateClamp(reinterpolate) {
	  return function(a, b) {
	    var r = reinterpolate(a = +a, b = +b);
	    return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
	  };
	}

	function bimap(domain, range, deinterpolate, reinterpolate) {
	  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
	  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
	  else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
	  return function(x) { return r0(d0(x)); };
	}

	function polymap(domain, range, deinterpolate, reinterpolate) {
	  var j = Math.min(domain.length, range.length) - 1,
	      d = new Array(j),
	      r = new Array(j),
	      i = -1;

	  // Reverse descending domains.
	  if (domain[j] < domain[0]) {
	    domain = domain.slice().reverse();
	    range = range.slice().reverse();
	  }

	  while (++i < j) {
	    d[i] = deinterpolate(domain[i], domain[i + 1]);
	    r[i] = reinterpolate(range[i], range[i + 1]);
	  }

	  return function(x) {
	    var i = bisectRight$1(domain, x, 1, j) - 1;
	    return r[i](d[i](x));
	  };
	}

	function copy(source, target) {
	  return target
	      .domain(source.domain())
	      .range(source.range())
	      .interpolate(source.interpolate())
	      .clamp(source.clamp());
	}

	// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
	// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
	function continuous(deinterpolate$$, reinterpolate) {
	  var domain = unit,
	      range = unit,
	      interpolate = interpolateValue,
	      clamp = false,
	      piecewise,
	      output,
	      input;

	  function rescale() {
	    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
	    output = input = null;
	    return scale;
	  }

	  function scale(x) {
	    return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate$$) : deinterpolate$$, interpolate)))(+x);
	  }

	  scale.invert = function(y) {
	    return (input || (input = piecewise(range, domain, deinterpolate, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
	  };

	  scale.domain = function(_) {
	    return arguments.length ? (domain = map$3.call(_, number$2), rescale()) : domain.slice();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range = slice$2.call(_), rescale()) : range.slice();
	  };

	  scale.rangeRound = function(_) {
	    return range = slice$2.call(_), interpolate = interpolateRound, rescale();
	  };

	  scale.clamp = function(_) {
	    return arguments.length ? (clamp = !!_, rescale()) : clamp;
	  };

	  scale.interpolate = function(_) {
	    return arguments.length ? (interpolate = _, rescale()) : interpolate;
	  };

	  return rescale();
	}

	// Computes the decimal coefficient and exponent of the specified number x with
	// significant digits p, where x is positive and p is in [1, 21] or undefined.
	// For example, formatDecimal(1.23) returns ["123", 0].
	function formatDecimal(x, p) {
	  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
	  var i, coefficient = x.slice(0, i);

	  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
	  return [
	    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
	    +x.slice(i + 1)
	  ];
	}

	function exponent$1(x) {
	  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
	}

	function formatGroup(grouping, thousands) {
	  return function(value, width) {
	    var i = value.length,
	        t = [],
	        j = 0,
	        g = grouping[0],
	        length = 0;

	    while (i > 0 && g > 0) {
	      if (length + g + 1 > width) g = Math.max(1, width - length);
	      t.push(value.substring(i -= g, i + g));
	      if ((length += g + 1) > width) break;
	      g = grouping[j = (j + 1) % grouping.length];
	    }

	    return t.reverse().join(thousands);
	  };
	}

	function formatDefault(x, p) {
	  x = x.toPrecision(p);

	  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
	    switch (x[i]) {
	      case ".": i0 = i1 = i; break;
	      case "0": if (i0 === 0) i0 = i; i1 = i; break;
	      case "e": break out;
	      default: if (i0 > 0) i0 = 0; break;
	    }
	  }

	  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
	}

	var prefixExponent;

	function formatPrefixAuto(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1],
	      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	      n = coefficient.length;
	  return i === n ? coefficient
	      : i > n ? coefficient + new Array(i - n + 1).join("0")
	      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
	      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	}

	function formatRounded(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1];
	  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
	      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
	      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	}

	var formatTypes = {
	  "": formatDefault,
	  "%": function(x, p) { return (x * 100).toFixed(p); },
	  "b": function(x) { return Math.round(x).toString(2); },
	  "c": function(x) { return x + ""; },
	  "d": function(x) { return Math.round(x).toString(10); },
	  "e": function(x, p) { return x.toExponential(p); },
	  "f": function(x, p) { return x.toFixed(p); },
	  "g": function(x, p) { return x.toPrecision(p); },
	  "o": function(x) { return Math.round(x).toString(8); },
	  "p": function(x, p) { return formatRounded(x * 100, p); },
	  "r": formatRounded,
	  "s": formatPrefixAuto,
	  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
	  "x": function(x) { return Math.round(x).toString(16); }
	};

	// [[fill]align][sign][symbol][0][width][,][.precision][type]
	var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

	function formatSpecifier(specifier) {
	  return new FormatSpecifier(specifier);
	}

	function FormatSpecifier(specifier) {
	  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

	  var match,
	      fill = match[1] || " ",
	      align = match[2] || ">",
	      sign = match[3] || "-",
	      symbol = match[4] || "",
	      zero = !!match[5],
	      width = match[6] && +match[6],
	      comma = !!match[7],
	      precision = match[8] && +match[8].slice(1),
	      type = match[9] || "";

	  // The "n" type is an alias for ",g".
	  if (type === "n") comma = true, type = "g";

	  // Map invalid types to the default format.
	  else if (!formatTypes[type]) type = "";

	  // If zero fill is specified, padding goes after sign and before digits.
	  if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

	  this.fill = fill;
	  this.align = align;
	  this.sign = sign;
	  this.symbol = symbol;
	  this.zero = zero;
	  this.width = width;
	  this.comma = comma;
	  this.precision = precision;
	  this.type = type;
	}

	FormatSpecifier.prototype.toString = function() {
	  return this.fill
	      + this.align
	      + this.sign
	      + this.symbol
	      + (this.zero ? "0" : "")
	      + (this.width == null ? "" : Math.max(1, this.width | 0))
	      + (this.comma ? "," : "")
	      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
	      + this.type;
	};

	var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

	function identity$5(x) {
	  return x;
	}

	var defaultLocale = formatLocale({
	  decimal: ".",
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	});

	var format = defaultLocale.format;
	var formatPrefix = defaultLocale.formatPrefix;

	function formatLocale(locale) {
	  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$5,
	      currency = locale.currency,
	      decimal = locale.decimal;

	  function newFormat(specifier) {
	    specifier = formatSpecifier(specifier);

	    var fill = specifier.fill,
	        align = specifier.align,
	        sign = specifier.sign,
	        symbol = specifier.symbol,
	        zero = specifier.zero,
	        width = specifier.width,
	        comma = specifier.comma,
	        precision = specifier.precision,
	        type = specifier.type;

	    // Compute the prefix and suffix.
	    // For SI-prefix, the suffix is lazily computed.
	    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

	    // What format function should we use?
	    // Is this an integer type?
	    // Can this type generate exponential notation?
	    var formatType = formatTypes[type],
	        maybeSuffix = !type || /[defgprs%]/.test(type);

	    // Set the default precision if not specified,
	    // or clamp the specified precision to the supported range.
	    // For significant precision, it must be in [1, 21].
	    // For fixed precision, it must be in [0, 20].
	    precision = precision == null ? (type ? 6 : 12)
	        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
	        : Math.max(0, Math.min(20, precision));

	    function format(value) {
	      var valuePrefix = prefix,
	          valueSuffix = suffix,
	          i, n, c;

	      if (type === "c") {
	        valueSuffix = formatType(value) + valueSuffix;
	        value = "";
	      } else {
	        value = +value;

	        // Convert negative to positive, and compute the prefix.
	        // Note that -0 is not less than 0, but 1 / -0 is!
	        var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

	        // Perform the initial formatting.
	        value = formatType(value, precision);

	        // If the original value was negative, it may be rounded to zero during
	        // formatting; treat this as (positive) zero.
	        if (valueNegative) {
	          i = -1, n = value.length;
	          valueNegative = false;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), (48 < c && c < 58)
	                || (type === "x" && 96 < c && c < 103)
	                || (type === "X" && 64 < c && c < 71)) {
	              valueNegative = true;
	              break;
	            }
	          }
	        }

	        // Compute the prefix and suffix.
	        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	        valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

	        // Break the formatted value into the integer “value” part that can be
	        // grouped, and fractional or exponential “suffix” part that is not.
	        if (maybeSuffix) {
	          i = -1, n = value.length;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), 48 > c || c > 57) {
	              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	              value = value.slice(0, i);
	              break;
	            }
	          }
	        }
	      }

	      // If the fill character is not "0", grouping is applied before padding.
	      if (comma && !zero) value = group(value, Infinity);

	      // Compute the padding.
	      var length = valuePrefix.length + value.length + valueSuffix.length,
	          padding = length < width ? new Array(width - length + 1).join(fill) : "";

	      // If the fill character is "0", grouping is applied after padding.
	      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

	      // Reconstruct the final output based on the desired alignment.
	      switch (align) {
	        case "<": return valuePrefix + value + valueSuffix + padding;
	        case "=": return valuePrefix + padding + value + valueSuffix;
	        case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
	      }
	      return padding + valuePrefix + value + valueSuffix;
	    }

	    format.toString = function() {
	      return specifier + "";
	    };

	    return format;
	  }

	  function formatPrefix(specifier, value) {
	    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	        e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
	        k = Math.pow(10, -e),
	        prefix = prefixes[8 + e / 3];
	    return function(value) {
	      return f(k * value) + prefix;
	    };
	  }

	  return {
	    format: newFormat,
	    formatPrefix: formatPrefix
	  };
	}

	function precisionFixed(step) {
	  return Math.max(0, -exponent$1(Math.abs(step)));
	}

	function precisionPrefix(step, value) {
	  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3 - exponent$1(Math.abs(step)));
	}

	function precisionRound(step, max) {
	  step = Math.abs(step), max = Math.abs(max) - step;
	  return Math.max(0, exponent$1(max) - exponent$1(step)) + 1;
	}

	function tickFormat(domain, count, specifier) {
	  var start = domain[0],
	      stop = domain[domain.length - 1],
	      step = tickStep$1(start, stop, count == null ? 10 : count),
	      precision;
	  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
	  switch (specifier.type) {
	    case "s": {
	      var value = Math.max(Math.abs(start), Math.abs(stop));
	      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
	      return formatPrefix(specifier, value);
	    }
	    case "":
	    case "e":
	    case "g":
	    case "p":
	    case "r": {
	      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
	      break;
	    }
	    case "f":
	    case "%": {
	      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
	      break;
	    }
	  }
	  return format(specifier);
	}

	function linearish(scale) {
	  var domain = scale.domain;

	  scale.ticks = function(count) {
	    var d = domain();
	    return ticks$1(d[0], d[d.length - 1], count == null ? 10 : count);
	  };

	  scale.tickFormat = function(count, specifier) {
	    return tickFormat(domain(), count, specifier);
	  };

	  scale.nice = function(count) {
	    var d = domain(),
	        i = d.length - 1,
	        n = count == null ? 10 : count,
	        start = d[0],
	        stop = d[i],
	        step = tickStep$1(start, stop, n);

	    if (step) {
	      step = tickStep$1(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
	      d[0] = Math.floor(start / step) * step;
	      d[i] = Math.ceil(stop / step) * step;
	      domain(d);
	    }

	    return scale;
	  };

	  return scale;
	}

	function linear$2() {
	  var scale = continuous(deinterpolate, reinterpolate);

	  scale.copy = function() {
	    return copy(scale, linear$2());
	  };

	  return linearish(scale);
	}

	function raise$2(x, exponent) {
	  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
	}

	function pow() {
	  var exponent = 1,
	      scale = continuous(deinterpolate, reinterpolate),
	      domain = scale.domain;

	  function deinterpolate(a, b) {
	    return (b = raise$2(b, exponent) - (a = raise$2(a, exponent)))
	        ? function(x) { return (raise$2(x, exponent) - a) / b; }
	        : constant$6(b);
	  }

	  function reinterpolate(a, b) {
	    b = raise$2(b, exponent) - (a = raise$2(a, exponent));
	    return function(t) { return raise$2(a + b * t, 1 / exponent); };
	  }

	  scale.exponent = function(_) {
	    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
	  };

	  scale.copy = function() {
	    return copy(scale, pow().exponent(exponent));
	  };

	  return linearish(scale);
	}

	function sqrt() {
	  return pow().exponent(0.5);
	}

var 	t0$2 = new Date;
var 	t1$2 = new Date;
	function newInterval(floori, offseti, count, field) {

	  function interval(date) {
	    return floori(date = new Date(+date)), date;
	  }

	  interval.floor = interval;

	  interval.ceil = function(date) {
	    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
	  };

	  interval.round = function(date) {
	    var d0 = interval(date),
	        d1 = interval.ceil(date);
	    return date - d0 < d1 - date ? d0 : d1;
	  };

	  interval.offset = function(date, step) {
	    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	  };

	  interval.range = function(start, stop, step) {
	    var range = [];
	    start = interval.ceil(start);
	    step = step == null ? 1 : Math.floor(step);
	    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	    do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
	    return range;
	  };

	  interval.filter = function(test) {
	    return newInterval(function(date) {
	      while (floori(date), !test(date)) date.setTime(date - 1);
	    }, function(date, step) {
	      while (--step >= 0) while (offseti(date, 1), !test(date));
	    });
	  };

	  if (count) {
	    interval.count = function(start, end) {
	      t0$2.setTime(+start), t1$2.setTime(+end);
	      floori(t0$2), floori(t1$2);
	      return Math.floor(count(t0$2, t1$2));
	    };

	    interval.every = function(step) {
	      step = Math.floor(step);
	      return !isFinite(step) || !(step > 0) ? null
	          : !(step > 1) ? interval
	          : interval.filter(field
	              ? function(d) { return field(d) % step === 0; }
	              : function(d) { return interval.count(0, d) % step === 0; });
	    };
	  }

	  return interval;
	}

	var millisecond = newInterval(function() {
	  // noop
	}, function(date, step) {
	  date.setTime(+date + step);
	}, function(start, end) {
	  return end - start;
	});

	// An optimized implementation for this simple case.
	millisecond.every = function(k) {
	  k = Math.floor(k);
	  if (!isFinite(k) || !(k > 0)) return null;
	  if (!(k > 1)) return millisecond;
	  return newInterval(function(date) {
	    date.setTime(Math.floor(date / k) * k);
	  }, function(date, step) {
	    date.setTime(+date + step * k);
	  }, function(start, end) {
	    return (end - start) / k;
	  });
	};

	var durationSecond$1 = 1e3;
	var durationMinute$1 = 6e4;
	var durationHour$1 = 36e5;
	var durationDay$1 = 864e5;
	var durationWeek$1 = 6048e5;

	var second = newInterval(function(date) {
	  date.setTime(Math.floor(date / durationSecond$1) * durationSecond$1);
	}, function(date, step) {
	  date.setTime(+date + step * durationSecond$1);
	}, function(start, end) {
	  return (end - start) / durationSecond$1;
	}, function(date) {
	  return date.getUTCSeconds();
	});

	var minute = newInterval(function(date) {
	  date.setTime(Math.floor(date / durationMinute$1) * durationMinute$1);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute$1);
	}, function(start, end) {
	  return (end - start) / durationMinute$1;
	}, function(date) {
	  return date.getMinutes();
	});

	var hour = newInterval(function(date) {
	  var offset = date.getTimezoneOffset() * durationMinute$1 % durationHour$1;
	  if (offset < 0) offset += durationHour$1;
	  date.setTime(Math.floor((+date - offset) / durationHour$1) * durationHour$1 + offset);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour$1);
	}, function(start, end) {
	  return (end - start) / durationHour$1;
	}, function(date) {
	  return date.getHours();
	});

	var day = newInterval(function(date) {
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setDate(date.getDate() + step);
	}, function(start, end) {
	  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1;
	}, function(date) {
	  return date.getDate() - 1;
	});

	function weekday(i) {
	  return newInterval(function(date) {
	    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step * 7);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
	  });
	}

	var timeSunday = weekday(0);
	var timeMonday = weekday(1);

	var month = newInterval(function(date) {
	  date.setDate(1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setMonth(date.getMonth() + step);
	}, function(start, end) {
	  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	}, function(date) {
	  return date.getMonth();
	});

	var year = newInterval(function(date) {
	  date.setMonth(0, 1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setFullYear(date.getFullYear() + step);
	}, function(start, end) {
	  return end.getFullYear() - start.getFullYear();
	}, function(date) {
	  return date.getFullYear();
	});

	// An optimized implementation for this simple case.
	year.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
	    date.setMonth(0, 1);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step * k);
	  });
	};

	var utcMinute = newInterval(function(date) {
	  date.setUTCSeconds(0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute$1);
	}, function(start, end) {
	  return (end - start) / durationMinute$1;
	}, function(date) {
	  return date.getUTCMinutes();
	});

	var utcHour = newInterval(function(date) {
	  date.setUTCMinutes(0, 0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour$1);
	}, function(start, end) {
	  return (end - start) / durationHour$1;
	}, function(date) {
	  return date.getUTCHours();
	});

	var utcDay = newInterval(function(date) {
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCDate(date.getUTCDate() + step);
	}, function(start, end) {
	  return (end - start) / durationDay$1;
	}, function(date) {
	  return date.getUTCDate() - 1;
	});

	function utcWeekday(i) {
	  return newInterval(function(date) {
	    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step * 7);
	  }, function(start, end) {
	    return (end - start) / durationWeek$1;
	  });
	}

	var utcWeek = utcWeekday(0);
	var utcMonday = utcWeekday(1);

	var utcMonth = newInterval(function(date) {
	  date.setUTCDate(1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCMonth(date.getUTCMonth() + step);
	}, function(start, end) {
	  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	}, function(date) {
	  return date.getUTCMonth();
	});

	var utcYear = newInterval(function(date) {
	  date.setUTCMonth(0, 1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCFullYear(date.getUTCFullYear() + step);
	}, function(start, end) {
	  return end.getUTCFullYear() - start.getUTCFullYear();
	}, function(date) {
	  return date.getUTCFullYear();
	});

	// An optimized implementation for this simple case.
	utcYear.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
	    date.setUTCMonth(0, 1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step * k);
	  });
	};

	var defaultLocale$1 = formatLocale$1({
	  dateTime: "%a %b %e %X %Y",
	  date: "%m/%d/%Y",
	  time: "%H:%M:%S",
	  periods: ["AM", "PM"],
	  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	});

	var utcFormat = defaultLocale$1.utcFormat;
	var utcParse = defaultLocale$1.utcParse;

	function localDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
	    date.setFullYear(d.y);
	    return date;
	  }
	  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
	}

	function utcDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
	    date.setUTCFullYear(d.y);
	    return date;
	  }
	  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
	}

	function newYear(y) {
	  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
	}

	function formatLocale$1(locale) {
	  var locale_dateTime = locale.dateTime,
	      locale_date = locale.date,
	      locale_time = locale.time,
	      locale_periods = locale.periods,
	      locale_weekdays = locale.days,
	      locale_shortWeekdays = locale.shortDays,
	      locale_months = locale.months,
	      locale_shortMonths = locale.shortMonths;

	  var periodRe = formatRe(locale_periods),
	      periodLookup = formatLookup(locale_periods),
	      weekdayRe = formatRe(locale_weekdays),
	      weekdayLookup = formatLookup(locale_weekdays),
	      shortWeekdayRe = formatRe(locale_shortWeekdays),
	      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
	      monthRe = formatRe(locale_months),
	      monthLookup = formatLookup(locale_months),
	      shortMonthRe = formatRe(locale_shortMonths),
	      shortMonthLookup = formatLookup(locale_shortMonths);

	  var formats = {
	    "a": formatShortWeekday,
	    "A": formatWeekday,
	    "b": formatShortMonth,
	    "B": formatMonth,
	    "c": null,
	    "d": formatDayOfMonth,
	    "e": formatDayOfMonth,
	    "H": formatHour24,
	    "I": formatHour12,
	    "j": formatDayOfYear,
	    "L": formatMilliseconds,
	    "m": formatMonthNumber,
	    "M": formatMinutes,
	    "p": formatPeriod,
	    "S": formatSeconds,
	    "U": formatWeekNumberSunday,
	    "w": formatWeekdayNumber,
	    "W": formatWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatYear,
	    "Y": formatFullYear,
	    "Z": formatZone,
	    "%": formatLiteralPercent
	  };

	  var utcFormats = {
	    "a": formatUTCShortWeekday,
	    "A": formatUTCWeekday,
	    "b": formatUTCShortMonth,
	    "B": formatUTCMonth,
	    "c": null,
	    "d": formatUTCDayOfMonth,
	    "e": formatUTCDayOfMonth,
	    "H": formatUTCHour24,
	    "I": formatUTCHour12,
	    "j": formatUTCDayOfYear,
	    "L": formatUTCMilliseconds,
	    "m": formatUTCMonthNumber,
	    "M": formatUTCMinutes,
	    "p": formatUTCPeriod,
	    "S": formatUTCSeconds,
	    "U": formatUTCWeekNumberSunday,
	    "w": formatUTCWeekdayNumber,
	    "W": formatUTCWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatUTCYear,
	    "Y": formatUTCFullYear,
	    "Z": formatUTCZone,
	    "%": formatLiteralPercent
	  };

	  var parses = {
	    "a": parseShortWeekday,
	    "A": parseWeekday,
	    "b": parseShortMonth,
	    "B": parseMonth,
	    "c": parseLocaleDateTime,
	    "d": parseDayOfMonth,
	    "e": parseDayOfMonth,
	    "H": parseHour24,
	    "I": parseHour24,
	    "j": parseDayOfYear,
	    "L": parseMilliseconds,
	    "m": parseMonthNumber,
	    "M": parseMinutes,
	    "p": parsePeriod,
	    "S": parseSeconds,
	    "U": parseWeekNumberSunday,
	    "w": parseWeekdayNumber,
	    "W": parseWeekNumberMonday,
	    "x": parseLocaleDate,
	    "X": parseLocaleTime,
	    "y": parseYear,
	    "Y": parseFullYear,
	    "Z": parseZone,
	    "%": parseLiteralPercent
	  };

	  // These recursive directive definitions must be deferred.
	  formats.x = newFormat(locale_date, formats);
	  formats.X = newFormat(locale_time, formats);
	  formats.c = newFormat(locale_dateTime, formats);
	  utcFormats.x = newFormat(locale_date, utcFormats);
	  utcFormats.X = newFormat(locale_time, utcFormats);
	  utcFormats.c = newFormat(locale_dateTime, utcFormats);

	  function newFormat(specifier, formats) {
	    return function(date) {
	      var string = [],
	          i = -1,
	          j = 0,
	          n = specifier.length,
	          c,
	          pad,
	          format;

	      if (!(date instanceof Date)) date = new Date(+date);

	      while (++i < n) {
	        if (specifier.charCodeAt(i) === 37) {
	          string.push(specifier.slice(j, i));
	          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
	          else pad = c === "e" ? " " : "0";
	          if (format = formats[c]) c = format(date, pad);
	          string.push(c);
	          j = i + 1;
	        }
	      }

	      string.push(specifier.slice(j, i));
	      return string.join("");
	    };
	  }

	  function newParse(specifier, newDate) {
	    return function(string) {
	      var d = newYear(1900),
	          i = parseSpecifier(d, specifier, string += "", 0);
	      if (i != string.length) return null;

	      // The am-pm flag is 0 for AM, and 1 for PM.
	      if ("p" in d) d.H = d.H % 12 + d.p * 12;

	      // Convert day-of-week and week-of-year to day-of-year.
	      if ("W" in d || "U" in d) {
	        if (!("w" in d)) d.w = "W" in d ? 1 : 0;
	        var day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
	        d.m = 0;
	        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
	      }

	      // If a time zone is specified, all fields are interpreted as UTC and then
	      // offset according to the specified time zone.
	      if ("Z" in d) {
	        d.H += d.Z / 100 | 0;
	        d.M += d.Z % 100;
	        return utcDate(d);
	      }

	      // Otherwise, all fields are in local time.
	      return newDate(d);
	    };
	  }

	  function parseSpecifier(d, specifier, string, j) {
	    var i = 0,
	        n = specifier.length,
	        m = string.length,
	        c,
	        parse;

	    while (i < n) {
	      if (j >= m) return -1;
	      c = specifier.charCodeAt(i++);
	      if (c === 37) {
	        c = specifier.charAt(i++);
	        parse = parses[c in pads ? specifier.charAt(i++) : c];
	        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
	      } else if (c != string.charCodeAt(j++)) {
	        return -1;
	      }
	    }

	    return j;
	  }

	  function parsePeriod(d, string, i) {
	    var n = periodRe.exec(string.slice(i));
	    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortWeekday(d, string, i) {
	    var n = shortWeekdayRe.exec(string.slice(i));
	    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseWeekday(d, string, i) {
	    var n = weekdayRe.exec(string.slice(i));
	    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortMonth(d, string, i) {
	    var n = shortMonthRe.exec(string.slice(i));
	    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseMonth(d, string, i) {
	    var n = monthRe.exec(string.slice(i));
	    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseLocaleDateTime(d, string, i) {
	    return parseSpecifier(d, locale_dateTime, string, i);
	  }

	  function parseLocaleDate(d, string, i) {
	    return parseSpecifier(d, locale_date, string, i);
	  }

	  function parseLocaleTime(d, string, i) {
	    return parseSpecifier(d, locale_time, string, i);
	  }

	  function formatShortWeekday(d) {
	    return locale_shortWeekdays[d.getDay()];
	  }

	  function formatWeekday(d) {
	    return locale_weekdays[d.getDay()];
	  }

	  function formatShortMonth(d) {
	    return locale_shortMonths[d.getMonth()];
	  }

	  function formatMonth(d) {
	    return locale_months[d.getMonth()];
	  }

	  function formatPeriod(d) {
	    return locale_periods[+(d.getHours() >= 12)];
	  }

	  function formatUTCShortWeekday(d) {
	    return locale_shortWeekdays[d.getUTCDay()];
	  }

	  function formatUTCWeekday(d) {
	    return locale_weekdays[d.getUTCDay()];
	  }

	  function formatUTCShortMonth(d) {
	    return locale_shortMonths[d.getUTCMonth()];
	  }

	  function formatUTCMonth(d) {
	    return locale_months[d.getUTCMonth()];
	  }

	  function formatUTCPeriod(d) {
	    return locale_periods[+(d.getUTCHours() >= 12)];
	  }

	  return {
	    format: function(specifier) {
	      var f = newFormat(specifier += "", formats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    parse: function(specifier) {
	      var p = newParse(specifier += "", localDate);
	      p.toString = function() { return specifier; };
	      return p;
	    },
	    utcFormat: function(specifier) {
	      var f = newFormat(specifier += "", utcFormats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    utcParse: function(specifier) {
	      var p = newParse(specifier, utcDate);
	      p.toString = function() { return specifier; };
	      return p;
	    }
	  };
	}

	var pads = {"-": "", "_": " ", "0": "0"};
	var numberRe = /^\s*\d+/;
	var percentRe = /^%/;
	var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	function pad(value, fill, width) {
	  var sign = value < 0 ? "-" : "",
	      string = (sign ? -value : value) + "",
	      length = string.length;
	  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	}

	function requote(s) {
	  return s.replace(requoteRe, "\\$&");
	}

	function formatRe(names) {
	  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
	}

	function formatLookup(names) {
	  var map = {}, i = -1, n = names.length;
	  while (++i < n) map[names[i].toLowerCase()] = i;
	  return map;
	}

	function parseWeekdayNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.w = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.U = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.W = +n[0], i + n[0].length) : -1;
	}

	function parseFullYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 4));
	  return n ? (d.y = +n[0], i + n[0].length) : -1;
	}

	function parseYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
	}

	function parseZone(d, string, i) {
	  var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
	  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
	}

	function parseMonthNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
	}

	function parseDayOfMonth(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.d = +n[0], i + n[0].length) : -1;
	}

	function parseDayOfYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
	}

	function parseHour24(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.H = +n[0], i + n[0].length) : -1;
	}

	function parseMinutes(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.M = +n[0], i + n[0].length) : -1;
	}

	function parseSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.S = +n[0], i + n[0].length) : -1;
	}

	function parseMilliseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.L = +n[0], i + n[0].length) : -1;
	}

	function parseLiteralPercent(d, string, i) {
	  var n = percentRe.exec(string.slice(i, i + 1));
	  return n ? i + n[0].length : -1;
	}

	function formatDayOfMonth(d, p) {
	  return pad(d.getDate(), p, 2);
	}

	function formatHour24(d, p) {
	  return pad(d.getHours(), p, 2);
	}

	function formatHour12(d, p) {
	  return pad(d.getHours() % 12 || 12, p, 2);
	}

	function formatDayOfYear(d, p) {
	  return pad(1 + day.count(year(d), d), p, 3);
	}

	function formatMilliseconds(d, p) {
	  return pad(d.getMilliseconds(), p, 3);
	}

	function formatMonthNumber(d, p) {
	  return pad(d.getMonth() + 1, p, 2);
	}

	function formatMinutes(d, p) {
	  return pad(d.getMinutes(), p, 2);
	}

	function formatSeconds(d, p) {
	  return pad(d.getSeconds(), p, 2);
	}

	function formatWeekNumberSunday(d, p) {
	  return pad(timeSunday.count(year(d), d), p, 2);
	}

	function formatWeekdayNumber(d) {
	  return d.getDay();
	}

	function formatWeekNumberMonday(d, p) {
	  return pad(timeMonday.count(year(d), d), p, 2);
	}

	function formatYear(d, p) {
	  return pad(d.getFullYear() % 100, p, 2);
	}

	function formatFullYear(d, p) {
	  return pad(d.getFullYear() % 10000, p, 4);
	}

	function formatZone(d) {
	  var z = d.getTimezoneOffset();
	  return (z > 0 ? "-" : (z *= -1, "+"))
	      + pad(z / 60 | 0, "0", 2)
	      + pad(z % 60, "0", 2);
	}

	function formatUTCDayOfMonth(d, p) {
	  return pad(d.getUTCDate(), p, 2);
	}

	function formatUTCHour24(d, p) {
	  return pad(d.getUTCHours(), p, 2);
	}

	function formatUTCHour12(d, p) {
	  return pad(d.getUTCHours() % 12 || 12, p, 2);
	}

	function formatUTCDayOfYear(d, p) {
	  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
	}

	function formatUTCMilliseconds(d, p) {
	  return pad(d.getUTCMilliseconds(), p, 3);
	}

	function formatUTCMonthNumber(d, p) {
	  return pad(d.getUTCMonth() + 1, p, 2);
	}

	function formatUTCMinutes(d, p) {
	  return pad(d.getUTCMinutes(), p, 2);
	}

	function formatUTCSeconds(d, p) {
	  return pad(d.getUTCSeconds(), p, 2);
	}

	function formatUTCWeekNumberSunday(d, p) {
	  return pad(utcWeek.count(utcYear(d), d), p, 2);
	}

	function formatUTCWeekdayNumber(d) {
	  return d.getUTCDay();
	}

	function formatUTCWeekNumberMonday(d, p) {
	  return pad(utcMonday.count(utcYear(d), d), p, 2);
	}

	function formatUTCYear(d, p) {
	  return pad(d.getUTCFullYear() % 100, p, 2);
	}

	function formatUTCFullYear(d, p) {
	  return pad(d.getUTCFullYear() % 10000, p, 4);
	}

	function formatUTCZone() {
	  return "+0000";
	}

	function formatLiteralPercent() {
	  return "%";
	}

	var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

	function formatIsoNative(date) {
	  return date.toISOString();
	}

	var formatIso = Date.prototype.toISOString
	    ? formatIsoNative
	    : utcFormat(isoSpecifier);

	function parseIsoNative(string) {
	  var date = new Date(string);
	  return isNaN(date) ? null : date;
	}

	var parseIso = +new Date("2000-01-01T00:00:00.000Z")
	    ? parseIsoNative
	    : utcParse(isoSpecifier);

	function colors(s) {
	  return s.match(/.{6}/g).map(function(x) {
	    return "#" + x;
	  });
	}

	colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

	colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

	colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

	colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

	interpolateCubehelixLong(cubehelix$3(300, 0.5, 0.0), cubehelix$3(-240, 0.5, 1.0));

	var warm = interpolateCubehelixLong(cubehelix$3(-100, 0.75, 0.35), cubehelix$3(80, 1.50, 0.8));

	var cool = interpolateCubehelixLong(cubehelix$3(260, 0.75, 0.35), cubehelix$3(80, 1.50, 0.8));

	var rainbow = cubehelix$3();

	function ramp(range) {
	  var n = range.length;
	  return function(t) {
	    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
	  };
	}

	ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

	var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

	var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

	var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

	function Circle$1(){
	  return ReactiveModel()
	    .call(SVG)
	    .call(Margin)
	    .call(Data)

	    .call(Column, "x")
	    .call(Column, "y")
	    .call(Column, "size")

	    // The x scale.
	    ("xDomain", function (data, accessor){
	      return extent(data, accessor);
	    }, "data, xAccessor")
	    ("xRange", function (innerWidth){
	      return [0, innerWidth];
	    }, "innerWidth")
	    .call(Scale, "x", linear$2)

	    // The y scale.
	    ("yDomain", function (data, accessor){
	      return extent(data, accessor);
	    }, "data, yAccessor")
	    ("yRange", function (innerHeight){
	      return [innerHeight, 0];
	    }, "innerHeight")
	    .call(Scale, "y", linear$2)

	    // The size scale.
	    ("sizeMax", 20)
	    ("sizeDomain", function (data, accessor){
	      return [0, max(data, accessor)];
	    }, "data, sizeAccessor")
	    ("sizeRange", function (sizeMax){
	      return [0, sizeMax];
	    }, "sizeMax")
	    .call(Scale, "size", sqrt)

	    // This is the single SVG group for the scatter layer.
	    ("scatterLayer", function (g){

	      var scatterLayer = g.selectAll(".reactive-vis-scatter-layer")
	        .data([1]);

	      return scatterLayer.enter().append("g")
	          .attr("class", "reactive-vis-scatter-layer")
	        .merge(scatterLayer);

	    }, "g")

	    // This is the selection of many g elements, corresponding to the data.
	    ("marks", function (scatterLayer, data, xScaled, yScaled, sizeScaled){

	      var scatter = scatterLayer.selectAll(".reactive-vis-scatter-mark")
	        .data(data);

	      scatter.exit().remove();

	      var sizeLocal = local$1();

	      var marks = scatter.enter().append("g")
	          .attr("class", "reactive-vis-scatter-mark")
	        .merge(scatter)
	          .attr("transform", function (d){
	            return "translate(" + xScaled(d) + "," + yScaled(d) + ")";
	          })
	          .each(function(d) {
	            sizeLocal.set(this, sizeScaled(d));
	          });

	      marks.sizeLocal = sizeLocal;

	      return marks;
	    }, "scatterLayer, data, xScaled, yScaled, sizeScaled");
	}

	// This needs to be used to construct ReactiveModel instances,
	// because it is the version that's bundled within ReactiveVis.
	// If an externally loaded instance of the ReactiveModel module
	// (from NPM) is used, the "digest" function won't work correctly,
	// because the two modules have different data flow graphs.
	var Model = ReactiveModel;

	// Expose digest at this level for convenience.
	var digest = ReactiveModel.digest;

	exports.Model = Model;
	exports.digest = digest;
	exports.SVG = SVG;
	exports.Margin = Margin;
	exports.Data = Data;
	exports.Column = Column;
	exports.Scale = Scale;
	exports.Resize = Resize;
	exports.Circle = Circle;
	exports.Scatter = Circle$1;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1x1MDAwMGNvbW1vbmpzSGVscGVycyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdGl2ZS1wcm9wZXJ0eS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9ncmFwaC1kYXRhLXN0cnVjdHVyZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdGl2ZS1mdW5jdGlvbi9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdGl2ZS1tb2RlbC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1kaXNwYXRjaC9zcmMvZGlzcGF0Y2guanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9zY2hlZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL25vZGVfbW9kdWxlcy9kMy1jb2xvci9zcmMvZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9jb2xvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL25vZGVfbW9kdWxlcy9kMy1jb2xvci9zcmMvbWF0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL25vZGVfbW9kdWxlcy9kMy1jb2xvci9zcmMvbGFiLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9jdWJlaGVsaXguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2NvbnN0YW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jb2xvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvcmdiLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jdWJlaGVsaXguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZWFzZS9zcmMvcG9seS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1lYXNlL3NyYy9iYWNrLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWVhc2Uvc3JjL2VsYXN0aWMuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2VzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbmFtZXNwYWNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvY3JlYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2xvY2FsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbWF0Y2hlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9vbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yQWxsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdEFsbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9maWx0ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jb25zdGFudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9kYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NwYXJzZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbnRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9leGl0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL21lcmdlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29yZGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NvcnQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2FsbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2Rlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2RlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NpemUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZW1wdHkuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZWFjaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9hdHRyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvd2luZG93LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3N0eWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3Byb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2NsYXNzZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vdGV4dC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9odG1sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JhaXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2xvd2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2FwcGVuZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbnNlcnQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmVtb3ZlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2RhdHVtLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2Rpc3BhdGNoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0LmpzIiwiLi4vc3JjL21peGlucy9zdmcuanMiLCIuLi9zcmMvbWl4aW5zL21hcmdpbi5qcyIsIi4uL3NyYy9taXhpbnMvZGF0YS5qcyIsIi4uL3NyYy9taXhpbnMvY29sdW1uLmpzIiwiLi4vc3JjL21peGlucy9zY2FsZS5qcyIsIi4uL3NyYy9taXhpbnMvcmVzaXplLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvY2lyY2xlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9hc2NlbmRpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL2Jpc2VjdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9iaXNlY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL2V4dGVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvbWF4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvYXNjZW5kaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvYmlzZWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9iaXNlY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9yYW5nZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL3RpY2tzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9hcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1jb2xvci9zcmMvZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9jb2xvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1jb2xvci9zcmMvbWF0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1jb2xvci9zcmMvbGFiLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9jdWJlaGVsaXguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2NvbnN0YW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jb2xvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvcmdiLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9hcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvbnVtYmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3N0cmluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvdmFsdWUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3JvdW5kLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jdWJlaGVsaXguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2NvbnN0YW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9udW1iZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2NvbnRpbnVvdXMuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXREZWNpbWFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZXhwb25lbnQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRHcm91cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdERlZmF1bHQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRQcmVmaXhBdXRvLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZm9ybWF0Um91bmRlZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdFR5cGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZm9ybWF0U3BlY2lmaWVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvbG9jYWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvcHJlY2lzaW9uRml4ZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9wcmVjaXNpb25QcmVmaXguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9wcmVjaXNpb25Sb3VuZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvdGlja0Zvcm1hdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvbGluZWFyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9wb3cuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvaW50ZXJ2YWwuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvbWlsbGlzZWNvbmQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvZHVyYXRpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvc2Vjb25kLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL21pbnV0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy9ob3VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL2RheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy93ZWVrLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL21vbnRoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL3llYXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvdXRjTWludXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL3V0Y0hvdXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvdXRjRGF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL3V0Y1dlZWsuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvdXRjTW9udGguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvdXRjWWVhci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lLWZvcm1hdC9zcmMvbG9jYWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUtZm9ybWF0L3NyYy9pc29Gb3JtYXQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS1mb3JtYXQvc3JjL2lzb1BhcnNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9jb2xvcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2NhdGVnb3J5MTAuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2NhdGVnb3J5MjBiLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9jYXRlZ29yeTIwYy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvY2F0ZWdvcnkyMC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvY3ViZWhlbGl4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9yYWluYm93LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy92aXJpZGlzLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvc2NhdHRlci5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCB2YXIgY29tbW9uanNHbG9iYWwgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHt9XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb21tb25qc01vZHVsZShmbiwgbW9kdWxlKSB7XG5cdHJldHVybiBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH0sIGZuKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMpLCBtb2R1bGUuZXhwb3J0cztcbn0iLCIvLyBVTUQgYm9pbGVycGxhdGUgKGZyb20gUm9sbHVwKVxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOiAoZ2xvYmFsLlJlYWN0aXZlUHJvcGVydHkgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7IFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIEVycm9yIG1lc3NhZ2VzIGZvciBleGNlcHRpb25zIHRocm93bi5cbiAgdmFyIGVycm9ycyA9IHtcbiAgICB0b29NYW55QXJnc0NvbnN0cnVjdG9yOiBcIlJlYWN0aXZlUHJvcGVydHkodmFsdWUpIGFjY2VwdHMgb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhlIGluaXRpYWwgdmFsdWUuXCIsXG4gICAgdG9vTWFueUFyZ3NTZXR0ZXI6IFwicmVhY3RpdmVQcm9wZXJ0eShuZXdWYWx1ZSkgYWNjZXB0cyBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGUgbmV3IHZhbHVlLlwiLFxuICAgIG9uTm9uRnVuY3Rpb246IFwiUmVhY3RpdmVQcm9wZXJ0eS5vbihsaXN0ZW5lcikgb25seSBhY2NlcHRzIGZ1bmN0aW9ucywgbm90IHZhbHVlcy5cIixcbiAgICBvbkFyZ3M6IFwiUmVhY3RpdmVQcm9wZXJ0eS5vbihsaXN0ZW5lcikgYWNjZXB0cyBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlwiXG4gIH07XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiBnZW5lcmF0ZXMgYSBnZXR0ZXItc2V0dGVyIHdpdGggY2hhbmdlIGxpc3RlbmVycy5cbiAgcmV0dXJuIGZ1bmN0aW9uIFJlYWN0aXZlUHJvcGVydHkodmFsdWUpe1xuXG4gICAgLy8gQW4gYXJyYXkgb2YgcmVnaXN0ZXJlZCBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgdmFyIGxpc3RlbmVycztcbiAgICBcbiAgICAvLyBDaGVjayBmb3IgdG9vIG1hbnkgYXJndW1lbnRzLlxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICB0aHJvdyBFcnJvcihlcnJvcnMudG9vTWFueUFyZ3NDb25zdHJ1Y3Rvcik7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyB0aGUgcmVhY3RpdmUgcHJvcGVydHkgZnVuY3Rpb24gdGhhdCBnZXRzIHJldHVybmVkLlxuICAgIGZ1bmN0aW9uIHJlYWN0aXZlUHJvcGVydHkobmV3VmFsdWUpe1xuICAgIFxuICAgICAgLy8gQ2hlY2sgZm9yIHRvbyBtYW55IGFyZ3VtZW50cy5cbiAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRocm93IEVycm9yKGVycm9ycy50b29NYW55QXJnc1NldHRlcik7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFRoaXMgaW1wbGVtZW50cyB0aGUgc2V0dGVyIHBhcnQgb2YgdGhlIHNldHRlci1nZXR0ZXIuXG4gICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKXtcblxuICAgICAgICAvLyBHcmFiIHRoZSBvbGQgdmFsdWUgZm9yIHBhc3NpbmcgaW50byB0aGUgbGlzdGVuZXIuXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIC8vIFRyYWNrIHRoZSBuZXcgdmFsdWUgaW50ZXJuYWxseS5cbiAgICAgICAgdmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgICAvLyBOb3RpZnkgcmVnaXN0ZXJlZCBsaXN0ZW5lcnMuXG4gICAgICAgIGlmKGxpc3RlbmVycyl7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBsaXN0ZW5lcnNbaV0obmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdXBwb3J0IG1ldGhvZCBjaGFpbmluZyBieSByZXR1cm5pbmcgJ3RoaXMnLlxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyBpbXBsZW1lbnRzIHRoZSBnZXR0ZXIgcGFydCBvZiB0aGUgc2V0dGVyLWdldHRlci5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBSZWdpc3RlcnMgYSBuZXcgbGlzdGVuZXIgdG8gcmVjZWl2ZSB1cGRhdGVzLlxuICAgIHJlYWN0aXZlUHJvcGVydHkub24gPSBmdW5jdGlvbiAobGlzdGVuZXIpe1xuXG4gICAgICAvLyBDaGVjayBmb3IgaW52YWxpZCB0eXBlcy5cbiAgICAgIGlmKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3JzLm9uTm9uRnVuY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3Igd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cy5cbiAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDApe1xuICAgICAgICB0aHJvdyBFcnJvcihlcnJvcnMub25BcmdzKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbm8gbGlzdGVuZXJzIGhhdmUgYmVlbiBhZGRlZCB5ZXQsIGluaXRpYWxpemUgdGhlIGFycmF5LlxuICAgICAgaWYoIWxpc3RlbmVycyl7XG4gICAgICAgIGxpc3RlbmVycyA9IFtdO1xuICAgICAgfVxuXG4gICAgICAvLyBSZWdpc3RlciB0aGUgbGlzdGVuZXIuXG4gICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGFuIGluaXRpYWwgdmFsdWUsIGludm9rZSB0aGUgbGlzdGVuZXIgaW1tZWRpYXRlbHkuXG4gICAgICAvLyBudWxsIGlzIGNvbnNpZGVyZWQgYXMgYSBkZWZpbmVkIHZhbHVlLlxuICAgICAgaWYodmFsdWUgIT09IHZvaWQgMCl7XG4gICAgICAgIGxpc3RlbmVyKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIGNvbnZlbmllbmNlLCB0aGUgbGlzdGVuZXIgaXMgcmV0dXJuZWQuXG4gICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgfTtcblxuICAgIC8vIFVucmVnaXN0ZXJzIHRoZSBnaXZlbiBsaXN0ZW5lciBmdW5jdGlvbi5cbiAgICByZWFjdGl2ZVByb3BlcnR5Lm9mZiA9IGZ1bmN0aW9uIChsaXN0ZW5lclRvUmVtb3ZlKXtcbiAgICAgIGlmKGxpc3RlbmVycyl7XG4gICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIoZnVuY3Rpb24gKGxpc3RlbmVyKXtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXIgIT09IGxpc3RlbmVyVG9SZW1vdmU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBVbnJlZ2lzdGVycyBhbGwgbGlzdGVuZXJzLlxuICAgIHJlYWN0aXZlUHJvcGVydHkuZGVzdHJveSA9IGZ1bmN0aW9uICgpe1xuICAgICAgbGlzdGVuZXJzID0gW107XG4gICAgfTtcblxuICAgIC8vIEV4cG9zZSB0aGUgZGVmYXVsdCB2YWx1ZVxuICAgIGlmKHZhbHVlKXtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSB2YWx1ZTtcbiAgICAgIHJlYWN0aXZlUHJvcGVydHkuZGVmYXVsdCA9IGZ1bmN0aW9uICgpe1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhY3RpdmVQcm9wZXJ0eTtcbiAgfTtcbn0pKTtcbiIsIi8vIEEgZ3JhcGggZGF0YSBzdHJ1Y3R1cmUgd2l0aCBkZXB0aC1maXJzdCBzZWFyY2ggYW5kIHRvcG9sb2dpY2FsIHNvcnQuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEdyYXBoKHNlcmlhbGl6ZWQpe1xuXG4gIC8vIFRoZSByZXR1cm5lZCBncmFwaCBpbnN0YW5jZS5cbiAgdmFyIGdyYXBoID0ge1xuICAgIGFkZE5vZGU6IGFkZE5vZGUsXG4gICAgcmVtb3ZlTm9kZTogcmVtb3ZlTm9kZSxcbiAgICBub2Rlczogbm9kZXMsXG4gICAgYWRqYWNlbnQ6IGFkamFjZW50LFxuICAgIGFkZEVkZ2U6IGFkZEVkZ2UsXG4gICAgcmVtb3ZlRWRnZTogcmVtb3ZlRWRnZSxcbiAgICBpbmRlZ3JlZTogaW5kZWdyZWUsXG4gICAgb3V0ZGVncmVlOiBvdXRkZWdyZWUsXG4gICAgZGVwdGhGaXJzdFNlYXJjaDogZGVwdGhGaXJzdFNlYXJjaCxcbiAgICB0b3BvbG9naWNhbFNvcnQ6IHRvcG9sb2dpY2FsU29ydCxcbiAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcbiAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVcbiAgfTtcblxuICAvLyBUaGUgYWRqYWNlbmN5IGxpc3Qgb2YgdGhlIGdyYXBoLlxuICAvLyBLZXlzIGFyZSBub2RlIGlkcy5cbiAgLy8gVmFsdWVzIGFyZSBhZGphY2VudCBub2RlIGlkIGFycmF5cy5cbiAgdmFyIGVkZ2VzID0ge307XG5cbiAgLy8gSWYgYSBzZXJpYWxpemVkIGdyYXBoIHdhcyBwYXNzZWQgaW50byB0aGUgY29uc3RydWN0b3IsIGRlc2VyaWFsaXplIGl0LlxuICBpZihzZXJpYWxpemVkKXtcbiAgICBkZXNlcmlhbGl6ZShzZXJpYWxpemVkKTtcbiAgfVxuXG4gIC8vIEFkZHMgYSBub2RlIHRvIHRoZSBncmFwaC5cbiAgLy8gSWYgbm9kZSB3YXMgYWxyZWFkeSBhZGRlZCwgdGhpcyBmdW5jdGlvbiBkb2VzIG5vdGhpbmcuXG4gIC8vIElmIG5vZGUgd2FzIG5vdCBhbHJlYWR5IGFkZGVkLCB0aGlzIGZ1bmN0aW9uIHNldHMgdXAgYW4gZW1wdHkgYWRqYWNlbmN5IGxpc3QuXG4gIGZ1bmN0aW9uIGFkZE5vZGUobm9kZSl7XG4gICAgZWRnZXNbbm9kZV0gPSBhZGphY2VudChub2RlKTtcbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICAvLyBSZW1vdmVzIGEgbm9kZSBmcm9tIHRoZSBncmFwaC5cbiAgLy8gQWxzbyByZW1vdmVzIGluY29taW5nIGFuZCBvdXRnb2luZyBlZGdlcy5cbiAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKXtcbiAgICBcbiAgICAvLyBSZW1vdmUgaW5jb21pbmcgZWRnZXMuXG4gICAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZnVuY3Rpb24gKHUpe1xuICAgICAgZWRnZXNbdV0uZm9yRWFjaChmdW5jdGlvbiAodil7XG4gICAgICAgIGlmKHYgPT09IG5vZGUpe1xuICAgICAgICAgIHJlbW92ZUVkZ2UodSwgdik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIG91dGdvaW5nIGVkZ2VzIChhbmQgc2lnbmFsIHRoYXQgdGhlIG5vZGUgbm8gbG9uZ2VyIGV4aXN0cykuXG4gICAgZGVsZXRlIGVkZ2VzW25vZGVdO1xuXG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgLy8gR2V0cyB0aGUgbGlzdCBvZiBub2RlcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgZ3JhcGguXG4gIGZ1bmN0aW9uIG5vZGVzKCl7XG4gICAgdmFyIG5vZGVTZXQgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhlZGdlcykuZm9yRWFjaChmdW5jdGlvbiAodSl7XG4gICAgICBub2RlU2V0W3VdID0gdHJ1ZTtcbiAgICAgIGVkZ2VzW3VdLmZvckVhY2goZnVuY3Rpb24gKHYpe1xuICAgICAgICBub2RlU2V0W3ZdID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhub2RlU2V0KTtcbiAgfVxuXG4gIC8vIEdldHMgdGhlIGFkamFjZW50IG5vZGUgbGlzdCBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gIC8vIFJldHVybnMgYW4gZW1wdHkgYXJyYXkgZm9yIHVua25vd24gbm9kZXMuXG4gIGZ1bmN0aW9uIGFkamFjZW50KG5vZGUpe1xuICAgIHJldHVybiBlZGdlc1tub2RlXSB8fCBbXTtcbiAgfVxuXG4gIC8vIEFkZHMgYW4gZWRnZSBmcm9tIG5vZGUgdSB0byBub2RlIHYuXG4gIC8vIEltcGxpY2l0bHkgYWRkcyB0aGUgbm9kZXMgaWYgdGhleSB3ZXJlIG5vdCBhbHJlYWR5IGFkZGVkLlxuICBmdW5jdGlvbiBhZGRFZGdlKHUsIHYpe1xuICAgIGFkZE5vZGUodSk7XG4gICAgYWRkTm9kZSh2KTtcbiAgICBhZGphY2VudCh1KS5wdXNoKHYpO1xuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIC8vIFJlbW92ZXMgdGhlIGVkZ2UgZnJvbSBub2RlIHUgdG8gbm9kZSB2LlxuICAvLyBEb2VzIG5vdCByZW1vdmUgdGhlIG5vZGVzLlxuICAvLyBEb2VzIG5vdGhpbmcgaWYgdGhlIGVkZ2UgZG9lcyBub3QgZXhpc3QuXG4gIGZ1bmN0aW9uIHJlbW92ZUVkZ2UodSwgdil7XG4gICAgaWYoZWRnZXNbdV0pe1xuICAgICAgZWRnZXNbdV0gPSBhZGphY2VudCh1KS5maWx0ZXIoZnVuY3Rpb24gKF92KXtcbiAgICAgICAgcmV0dXJuIF92ICE9PSB2O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIC8vIENvbXB1dGVzIHRoZSBpbmRlZ3JlZSBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gIC8vIE5vdCB2ZXJ5IGVmZmljaWVudCwgY29zdHMgTyhFKSB3aGVyZSBFID0gbnVtYmVyIG9mIGVkZ2VzLlxuICBmdW5jdGlvbiBpbmRlZ3JlZShub2RlKXtcbiAgICB2YXIgZGVncmVlID0gMDtcbiAgICBmdW5jdGlvbiBjaGVjayh2KXtcbiAgICAgIGlmKHYgPT09IG5vZGUpe1xuICAgICAgICBkZWdyZWUrKztcbiAgICAgIH1cbiAgICB9XG4gICAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZnVuY3Rpb24gKHUpe1xuICAgICAgZWRnZXNbdV0uZm9yRWFjaChjaGVjayk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZ3JlZTtcbiAgfVxuXG4gIC8vIENvbXB1dGVzIHRoZSBvdXRkZWdyZWUgZm9yIHRoZSBnaXZlbiBub2RlLlxuICBmdW5jdGlvbiBvdXRkZWdyZWUobm9kZSl7XG4gICAgcmV0dXJuIG5vZGUgaW4gZWRnZXMgPyBlZGdlc1tub2RlXS5sZW5ndGggOiAwO1xuICB9XG5cbiAgLy8gRGVwdGggRmlyc3QgU2VhcmNoIGFsZ29yaXRobSwgaW5zcGlyZWQgYnlcbiAgLy8gQ29ybWVuIGV0IGFsLiBcIkludHJvZHVjdGlvbiB0byBBbGdvcml0aG1zXCIgM3JkIEVkLiBwLiA2MDRcbiAgLy8gVGhpcyB2YXJpYW50IGluY2x1ZGVzIGFuIGFkZGl0aW9uYWwgb3B0aW9uIFxuICAvLyBgaW5jbHVkZVNvdXJjZU5vZGVzYCB0byBzcGVjaWZ5IHdoZXRoZXIgdG8gaW5jbHVkZSBvclxuICAvLyBleGNsdWRlIHRoZSBzb3VyY2Ugbm9kZXMgZnJvbSB0aGUgcmVzdWx0ICh0cnVlIGJ5IGRlZmF1bHQpLlxuICAvLyBJZiBgc291cmNlTm9kZXNgIGlzIG5vdCBzcGVjaWZpZWQsIGFsbCBub2RlcyBpbiB0aGUgZ3JhcGhcbiAgLy8gYXJlIHVzZWQgYXMgc291cmNlIG5vZGVzLlxuICBmdW5jdGlvbiBkZXB0aEZpcnN0U2VhcmNoKHNvdXJjZU5vZGVzLCBpbmNsdWRlU291cmNlTm9kZXMpe1xuXG4gICAgaWYoIXNvdXJjZU5vZGVzKXtcbiAgICAgIHNvdXJjZU5vZGVzID0gbm9kZXMoKTtcbiAgICB9XG5cbiAgICBpZih0eXBlb2YgaW5jbHVkZVNvdXJjZU5vZGVzICE9PSBcImJvb2xlYW5cIil7XG4gICAgICBpbmNsdWRlU291cmNlTm9kZXMgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciB2aXNpdGVkID0ge307XG4gICAgdmFyIG5vZGVMaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBERlNWaXNpdChub2RlKXtcbiAgICAgIGlmKCF2aXNpdGVkW25vZGVdKXtcbiAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICAgIGFkamFjZW50KG5vZGUpLmZvckVhY2goREZTVmlzaXQpO1xuICAgICAgICBub2RlTGlzdC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGluY2x1ZGVTb3VyY2VOb2Rlcyl7XG4gICAgICBzb3VyY2VOb2Rlcy5mb3JFYWNoKERGU1Zpc2l0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSl7XG4gICAgICAgIHZpc2l0ZWRbbm9kZV0gPSB0cnVlO1xuICAgICAgfSk7XG4gICAgICBzb3VyY2VOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKXtcbiAgICAgICAgYWRqYWNlbnQobm9kZSkuZm9yRWFjaChERlNWaXNpdCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZUxpc3Q7XG4gIH1cblxuICAvLyBUaGUgdG9wb2xvZ2ljYWwgc29ydCBhbGdvcml0aG0geWllbGRzIGEgbGlzdCBvZiB2aXNpdGVkIG5vZGVzXG4gIC8vIHN1Y2ggdGhhdCBmb3IgZWFjaCB2aXNpdGVkIGVkZ2UgKHUsIHYpLCB1IGNvbWVzIGJlZm9yZSB2IGluIHRoZSBsaXN0LlxuICAvLyBBbWF6aW5nbHksIHRoaXMgY29tZXMgZnJvbSBqdXN0IHJldmVyc2luZyB0aGUgcmVzdWx0IGZyb20gZGVwdGggZmlyc3Qgc2VhcmNoLlxuICAvLyBDb3JtZW4gZXQgYWwuIFwiSW50cm9kdWN0aW9uIHRvIEFsZ29yaXRobXNcIiAzcmQgRWQuIHAuIDYxM1xuICBmdW5jdGlvbiB0b3BvbG9naWNhbFNvcnQoc291cmNlTm9kZXMsIGluY2x1ZGVTb3VyY2VOb2Rlcyl7XG4gICAgcmV0dXJuIGRlcHRoRmlyc3RTZWFyY2goc291cmNlTm9kZXMsIGluY2x1ZGVTb3VyY2VOb2RlcykucmV2ZXJzZSgpO1xuICB9XG5cbiAgLy8gU2VyaWFsaXplcyB0aGUgZ3JhcGguXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZSgpe1xuICAgIHZhciBzZXJpYWxpemVkID0ge1xuICAgICAgbm9kZXM6IG5vZGVzKCkubWFwKGZ1bmN0aW9uIChpZCl7XG4gICAgICAgIHJldHVybiB7IGlkOiBpZCB9O1xuICAgICAgfSksXG4gICAgICBsaW5rczogW11cbiAgICB9O1xuXG4gICAgc2VyaWFsaXplZC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKXtcbiAgICAgIHZhciBzb3VyY2UgPSBub2RlLmlkO1xuICAgICAgYWRqYWNlbnQoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQpe1xuICAgICAgICBzZXJpYWxpemVkLmxpbmtzLnB1c2goe1xuICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgIHRhcmdldDogdGFyZ2V0XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VyaWFsaXplZDtcbiAgfVxuXG4gIC8vIERlc2VyaWFsaXplcyB0aGUgZ2l2ZW4gc2VyaWFsaXplZCBncmFwaC5cbiAgZnVuY3Rpb24gZGVzZXJpYWxpemUoc2VyaWFsaXplZCl7XG4gICAgc2VyaWFsaXplZC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKXsgYWRkTm9kZShub2RlLmlkKTsgfSk7XG4gICAgc2VyaWFsaXplZC5saW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKXsgYWRkRWRnZShsaW5rLnNvdXJjZSwgbGluay50YXJnZXQpOyB9KTtcbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cbiAgXG4gIHJldHVybiBncmFwaDtcbn1cbiIsInZhciBSZWFjdGl2ZVByb3BlcnR5ID0gcmVxdWlyZShcInJlYWN0aXZlLXByb3BlcnR5XCIpO1xudmFyIEdyYXBoID0gcmVxdWlyZShcImdyYXBoLWRhdGEtc3RydWN0dXJlXCIpO1xuXG4vLyBVc2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGlmIGl0IGlzIGF2YWlsYWJsZS5cbi8vIE90aGVyd2lzZSBmYWxsIGJhY2sgdG8gc2V0VGltZW91dC5cbnZhciBuZXh0RnJhbWUgPSBzZXRUaW1lb3V0O1xuaWYodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgbmV4dEZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xufVxuXG4vLyBUaGUgc2luZ2xldG9uIGRhdGEgZGVwZW5kZW5jeSBncmFwaC5cbi8vIE5vZGVzIGFyZSByZWFjdGl2ZSBwcm9wZXJ0aWVzLlxuLy8gRWRnZXMgYXJlIGRlcGVuZGVuY2llcyBiZXR3ZWVuIHJlYWN0aXZlIGZ1bmN0aW9uIGlucHV0cyBhbmQgb3V0cHV0cy5cbnZhciBncmFwaCA9IEdyYXBoKCk7XG5cbi8vIEEgbWFwIGZvciBsb29raW5nIHVwIHByb3BlcnRpZXMgYmFzZWQgb24gdGhlaXIgYXNzaWduZWQgaWQuXG4vLyBLZXlzIGFyZSBwcm9wZXJ0eSBpZHMsIHZhbHVlcyBhcmUgcmVhY3RpdmUgcHJvcGVydGllcy5cbnZhciBwcm9wZXJ0aWVzID0ge307XG5cbi8vIFRoaXMgb2JqZWN0IGFjY3VtdWxhdGVzIHByb3BlcnRpZXMgdGhhdCBoYXZlIGNoYW5nZWQgc2luY2UgdGhlIGxhc3QgZGlnZXN0LlxuLy8gS2V5cyBhcmUgcHJvcGVydHkgaWRzLCB2YWx1ZXMgYXJlIHRydXRoeSAodGhlIG9iamVjdCBhY3RzIGxpa2UgYSBTZXQpLlxudmFyIGNoYW5nZWQgPSB7fTtcblxuLy8gQXNzaWducyBhbiBpZCB0byBhIHJlYWN0aXZlIHByb3BlcnR5IHNvIGl0IGNhbiBiZSBhIG5vZGUgaW4gdGhlIGdyYXBoLlxuLy8gQWxzbyBzdG9yZXMgYSByZWZlcmVuY2UgdG8gdGhlIHByb3BlcnR5IGJ5IGlkIGluIGBwcm9wZXJ0aWVzYC5cbi8vIElmIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbHJlYWR5IGhhcyBhbiBpZCwgZG9lcyBub3RoaW5nLlxudmFyIGFzc2lnbklkID0gKGZ1bmN0aW9uKCl7XG4gIHZhciBjb3VudGVyID0gMTtcbiAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wZXJ0eSl7XG4gICAgaWYoIXByb3BlcnR5LmlkKXtcbiAgICAgIHByb3BlcnR5LmlkID0gU3RyaW5nKGNvdW50ZXIrKyk7XG4gICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5LmlkXSA9IHByb3BlcnR5O1xuICAgIH1cbiAgfTtcbn0oKSk7XG5cbi8vIFRoZSByZWFjdGl2ZSBmdW5jdGlvbiBjb25zdHJ1Y3Rvci5cbi8vIEFjY2VwdHMgYW4gb3B0aW9ucyBvYmplY3Qgd2l0aFxuLy8gICogaW5wdXRzIC0gQW4gYXJyYXkgb2YgcmVhY3RpdmUgcHJvcGVydGllcy5cbi8vICAqIGNhbGxiYWNrIC0gQSBmdW5jdGlvbiB3aXRoIGFyZ3VtZW50cyBjb3JyZXNwb25kaW5nIHRvIHZhbHVlcyBvZiBpbnB1dHMuXG4vLyAgKiBvdXRwdXQgLSBBIHJlYWN0aXZlIHByb3BlcnR5IChvcHRpb25hbCkuXG5mdW5jdGlvbiBSZWFjdGl2ZUZ1bmN0aW9uKG9wdGlvbnMpe1xuXG4gIHZhciBpbnB1dHMgPSBvcHRpb25zLmlucHV0cztcbiAgdmFyIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjaztcbiAgdmFyIG91dHB1dCA9IG9wdGlvbnMub3V0cHV0O1xuICBcbiAgaWYoIW91dHB1dCl7XG4gICAgb3V0cHV0ID0gZnVuY3Rpb24gKCl7fTtcbiAgICBvdXRwdXQucHJvcGVydHlOYW1lID0gXCJcIjtcbiAgfVxuXG4gIC8vIFRoaXMgZ2V0cyBpbnZva2VkIGR1cmluZyBhIGRpZ2VzdCwgYWZ0ZXIgaW5wdXRzIGhhdmUgYmVlbiBldmFsdWF0ZWQuXG4gIG91dHB1dC5ldmFsdWF0ZSA9IGZ1bmN0aW9uICgpe1xuXG4gICAgLy8gR2V0IHRoZSB2YWx1ZXMgZm9yIGVhY2ggb2YgdGhlIGlucHV0IHJlYWN0aXZlIHByb3BlcnRpZXMuXG4gICAgdmFyIHZhbHVlcyA9IGlucHV0cy5tYXAoZnVuY3Rpb24gKGlucHV0KXtcbiAgICAgIHJldHVybiBpbnB1dCgpO1xuICAgIH0pO1xuXG4gICAgLy8gSWYgYWxsIGlucHV0IHZhbHVlcyBhcmUgZGVmaW5lZCxcbiAgICBpZihkZWZpbmVkKHZhbHVlcykpe1xuXG4gICAgICAvLyBpbnZva2UgdGhlIGNhbGxiYWNrIGFuZCBhc3NpZ24gdGhlIG91dHB1dCB2YWx1ZS5cbiAgICAgIG91dHB1dChjYWxsYmFjay5hcHBseShudWxsLCB2YWx1ZXMpKTtcbiAgICB9XG5cbiAgfTtcblxuICAvLyBBc3NpZ24gbm9kZSBpZHMgdG8gaW5wdXRzIGFuZCBvdXRwdXQuXG4gIGFzc2lnbklkKG91dHB1dCk7XG4gIGlucHV0cy5mb3JFYWNoKGFzc2lnbklkKTtcblxuICAvLyBTZXQgdXAgZWRnZXMgaW4gdGhlIGdyYXBoIGZyb20gZWFjaCBpbnB1dC5cbiAgaW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKGlucHV0KXtcbiAgICBncmFwaC5hZGRFZGdlKGlucHV0LmlkLCBvdXRwdXQuaWQpO1xuICB9KTtcblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVycyB0byBlYWNoIGlucHV0IHByb3BlcnR5LlxuICAvLyBUaGVzZSBtYXJrIHRoZSBwcm9wZXJ0aWVzIGFzIGNoYW5nZWQgYW5kIHF1ZXVlIHRoZSBuZXh0IGRpZ2VzdC5cbiAgdmFyIGxpc3RlbmVycyA9IGlucHV0cy5tYXAoZnVuY3Rpb24gKHByb3BlcnR5KXtcbiAgICByZXR1cm4gcHJvcGVydHkub24oZnVuY3Rpb24gKCl7XG4gICAgICBjaGFuZ2VkW3Byb3BlcnR5LmlkXSA9IHRydWU7XG4gICAgICBxdWV1ZURpZ2VzdCgpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBSZXR1cm4gYW4gb2JqZWN0IHRoYXQgY2FuIGRlc3Ryb3kgdGhlIGxpc3RlbmVycyBhbmQgZWRnZXMgc2V0IHVwLlxuICByZXR1cm4ge1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCB0byBleHBsaWNpdGx5IGRlc3Ryb3kgYSByZWFjdGl2ZSBmdW5jdGlvbi5cbiAgICAvLyBHYXJiYWdlIGNvbGxlY3Rpb24gaXMgbm90IGVub3VnaCwgYXMgd2UgaGF2ZSBhZGRlZCBsaXN0ZW5lcnMgYW5kIGVkZ2VzLlxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpe1xuXG4gICAgICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVycyBmcm9tIGlucHV0cy5cbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lciwgaSl7XG4gICAgICAgIGlucHV0c1tpXS5vZmYobGlzdGVuZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgZWRnZXMgdGhhdCB3ZXJlIGFkZGVkIHRvIHRoZSBkZXBlbmRlbmN5IGdyYXBoLlxuICAgICAgaW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKGlucHV0KXtcbiAgICAgICAgZ3JhcGgucmVtb3ZlRWRnZShpbnB1dC5pZCwgb3V0cHV0LmlkKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZW1vdmUgcHJvcGVydHkgbm9kZXMgd2l0aCBubyBlZGdlcyBjb25uZWN0ZWQuXG4gICAgICBpbnB1dHMuY29uY2F0KFtvdXRwdXRdKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSl7XG4gICAgICAgIHZhciBub2RlID0gcHJvcGVydHkuaWQ7XG4gICAgICAgIGlmKGdyYXBoLmluZGVncmVlKG5vZGUpICsgZ3JhcGgub3V0ZGVncmVlKG5vZGUpID09PSAwKXtcbiAgICAgICAgICBncmFwaC5yZW1vdmVOb2RlKHByb3BlcnR5LmlkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgcmVmZXJlbmNlIHRvIHRoZSAnZXZhbHVhdGUnIGZ1bmN0aW9uLlxuICAgICAgZGVsZXRlIG91dHB1dC5ldmFsdWF0ZTtcblxuICAgICAgLy8gUmVtb3ZlIHJlZmVyZW5jZXMgdG8gZXZlcnl0aGluZy5cbiAgICAgIGlucHV0cyA9IGNhbGxiYWNrID0gb3V0cHV0ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gUHJvcGFnYXRlcyBjaGFuZ2VzIHRocm91Z2ggdGhlIGRlcGVuZGVuY3kgZ3JhcGguXG5SZWFjdGl2ZUZ1bmN0aW9uLmRpZ2VzdCA9IGZ1bmN0aW9uICgpe1xuICB2YXIgY2hhbmdlZElkcyA9IE9iamVjdC5rZXlzKGNoYW5nZWQpO1xuICBjaGFuZ2VkID0ge307XG4gIGdyYXBoXG4gICAgLnRvcG9sb2dpY2FsU29ydChjaGFuZ2VkSWRzLCBmYWxzZSlcbiAgICAubWFwKGZ1bmN0aW9uIChpZCl7XG4gICAgICByZXR1cm4gcHJvcGVydGllc1tpZF07XG4gICAgfSlcbiAgICAuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpe1xuICAgICAgcHJvcGVydHkuZXZhbHVhdGUoKTtcbiAgICB9KTtcbiAgY2hhbmdlZCA9IHt9O1xufTtcblxuLy8gVGhpcyBmdW5jdGlvbiBxdWV1ZXMgYSBkaWdlc3QgYXQgdGhlIG5leHQgdGljayBvZiB0aGUgZXZlbnQgbG9vcC5cbnZhciBxdWV1ZURpZ2VzdCA9IGRlYm91bmNlKFJlYWN0aXZlRnVuY3Rpb24uZGlnZXN0KTtcblxuLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gaW52b2tlZCwgc2NoZWR1bGVzIHRoZSBnaXZlbiBmdW5jdGlvblxuLy8gdG8gZXhlY3V0ZSBvbmNlIG9uIHRoZSBuZXh0IGZyYW1lLlxuLy8gU2ltaWxhciB0byBodHRwOi8vdW5kZXJzY29yZWpzLm9yZy8jZGVib3VuY2VcbmZ1bmN0aW9uIGRlYm91bmNlKGNhbGxiYWNrKXtcbiAgdmFyIHF1ZXVlZCA9IGZhbHNlO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmKCFxdWV1ZWQpe1xuICAgICAgcXVldWVkID0gdHJ1ZTtcbiAgICAgIG5leHRGcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHF1ZXVlZCA9IGZhbHNlO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBSZXR1cm5zIHRydWUgaWYgYWxsIGVsZW1lbnRzIG9mIHRoZSBnaXZlbiBhcnJheSBhcmUgZGVmaW5lZC5cbmZ1bmN0aW9uIGRlZmluZWQoYXJyKXtcbiAgcmV0dXJuICFhcnIuc29tZShpc1VuZGVmaW5lZCk7XG59XG5cbi8vIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIHVuZGVmaW5lZC5cbi8vIFJldHVybnMgZmFsc2UgaWYgdGhlIGdpdmVuIG9iamVjdCBpcyBzb21lIHZhbHVlLCBpbmNsdWRpbmcgbnVsbC5cbi8vIEluc3BpcmVkIGJ5IGh0dHA6Ly9yeWFubW9yci5jb20vZXhwbG9yaW5nLXRoZS1ldGVybmFsLWFieXNzLW9mLW51bGwtYW5kLXVuZGVmaW5lZC9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iail7XG4gIHJldHVybiBvYmogPT09IHZvaWQgMDtcbn1cblxuUmVhY3RpdmVGdW5jdGlvbi5uZXh0RnJhbWUgPSBuZXh0RnJhbWU7XG5cblJlYWN0aXZlRnVuY3Rpb24uc2VyaWFsaXplR3JhcGggPSBmdW5jdGlvbiAoKXtcbiAgdmFyIHNlcmlhbGl6ZWQgPSBncmFwaC5zZXJpYWxpemUoKTtcblxuICAvLyBBZGQgcHJvcGVydHkgbmFtZXMuXG4gIHNlcmlhbGl6ZWQubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSl7XG4gICAgdmFyIHByb3BlcnR5TmFtZSA9IHByb3BlcnRpZXNbbm9kZS5pZF0ucHJvcGVydHlOYW1lO1xuICAgIGlmKHR5cGVvZiBwcm9wZXJ0eU5hbWUgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgbm9kZS5wcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gc2VyaWFsaXplZDtcbn1cblxuUmVhY3RpdmVGdW5jdGlvbi5saW5rID0gZnVuY3Rpb24gKHByb3BlcnR5QSwgcHJvcGVydHlCKXtcbiAgcmV0dXJuIFJlYWN0aXZlRnVuY3Rpb24oe1xuICAgIGlucHV0czogW3Byb3BlcnR5QV0sXG4gICAgb3V0cHV0OiBwcm9wZXJ0eUIsXG4gICAgY2FsbGJhY2s6IGZ1bmN0aW9uICh4KXsgcmV0dXJuIHg7IH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RpdmVGdW5jdGlvbjtcbiIsIi8vIEJ5IEN1cnJhbiBLZWxsZWhlclxuLy8gTGFzdCB1cGRhdGVkIE1heSAyMDE2XG5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZGF0YXZpcy10ZWNoL3JlYWN0aXZlLWZ1bmN0aW9uXG52YXIgUmVhY3RpdmVGdW5jdGlvbiA9IHJlcXVpcmUoXCJyZWFjdGl2ZS1mdW5jdGlvblwiKTtcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhdmlzLXRlY2gvcmVhY3RpdmUtcHJvcGVydHlcbnZhciBSZWFjdGl2ZVByb3BlcnR5ID0gcmVxdWlyZShcInJlYWN0aXZlLXByb3BlcnR5XCIpO1xuXG4vLyBGdW5jdGlvbmFsIHV0aWxpdHkgZm9yIGludm9raW5nIG1ldGhvZHMgb24gY29sbGVjdGlvbnMuXG5mdW5jdGlvbiBpbnZva2UobWV0aG9kKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpe1xuICAgIHJldHVybiBkW21ldGhvZF0oKTtcbiAgfTtcbn1cblxuLy8gVGhlIGNvbnN0cnVjdG9yIGZvciByZWFjdGl2ZSBtb2RlbHMuXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIGV4cG9ydGVkIGFzIHRoZSBwdWJsaWMgQVBJIG9mIHRoaXMgbW9kdWxlLlxuZnVuY3Rpb24gUmVhY3RpdmVNb2RlbCgpe1xuXG4gIC8vIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGZvciBleHBvc2VkIHByb3BlcnRpZXMuXG4gIHZhciBleHBvc2VkUHJvcGVydGllcztcblxuICAvLyBUaGlzIGlzIGEgc3RyaW5nLCB0aGUgbmFtZSBvZiB0aGUgbGFzdCBwcm9wZXJ0eSBhZGRlZC5cbiAgLy8gVGhpcyBpcyB1c2VkIGluIGBleHBvc2UoKWA7XG4gIHZhciBsYXN0UHJvcGVydHlBZGRlZDtcblxuICAvLyBUaGUgY29uZmlndXJhdGlvbiBvZiB0aGUgbW9kZWwgaXMgcmVwcmVzZW50ZWQgYXMgYW4gb2JqZWN0IGFuZCBzdG9yZWRcbiAgLy8gaW4gdGhpcyByZWFjdGl2ZSBwcm9wZXJ0eS4gTm90ZSB0aGF0IG9ubHkgdmFsdWVzIGZvciBleHBvc2VkIHByb3BlcnRpZXNcbiAgLy8gd2hvc2UgdmFsdWVzIGRpZmZlciBmcm9tIHRoZWlyIGRlZmF1bHRzIGFyZSBpbmNsdWRlZCBpbiB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gIC8vIFRoZSBwdXJwb3NlIG9mIHRoZSBjb25maWd1cmF0aW9uIGFjY2Vzc29yIEFQSSBpcyBzZXJpYWxpemF0aW9uIGFuZCBkZXNlcmlhbGl6YXRpb24sXG4gIC8vIHNvIGRlZmF1bHQgdmFsdWVzIGFyZSBsZWZ0IG91dCBmb3IgYSBjb25jaXNlIHNlcmlhbGl6ZWQgZm9ybS5cbiAgdmFyIGNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSA9IFJlYWN0aXZlUHJvcGVydHkoKTtcbiAgY29uZmlndXJhdGlvblByb3BlcnR5LnByb3BlcnR5TmFtZSA9IFwiY29uZmlndXJhdGlvblwiO1xuXG4gIC8vIFRoaXMgaXMgYSByZWFjdGl2ZSBmdW5jdGlvbiBzZXQgdXAgdG8gbGlzdGVuIGZvciBjaGFuZ2VzIGluIGFsbFxuICAvLyBleHBvc2VkIHByb3BlcnRpZXMgYW5kIHNldCB0aGUgY29uZmlndXJhdGlvblByb3BlcnR5IHZhbHVlLlxuICB2YXIgY29uZmlndXJhdGlvblJlYWN0aXZlRnVuY3Rpb247XG5cbiAgLy8gQW4gYXJyYXkgb2YgcmVhY3RpdmUgZnVuY3Rpb25zIHRoYXQgaGF2ZSBiZWVuIHNldCB1cCBvbiB0aGlzIG1vZGVsLlxuICAvLyBUaGVzZSBhcmUgdHJhY2tlZCBvbmx5IHNvIHRoZXkgY2FuIGJlIGRlc3Ryb3llZCBpbiBtb2RlbC5kZXN0cm95KCkuXG4gIHZhciByZWFjdGl2ZUZ1bmN0aW9ucyA9IFtdO1xuXG4gIC8vIFRoZSBtb2RlbCBpbnN0YW5jZSBvYmplY3QuXG4gIC8vIFRoaXMgaXMgdGhlIHZhbHVlIHJldHVybmVkIGZyb20gdGhlIGNvbnN0cnVjdG9yLlxuICB2YXIgbW9kZWwgPSBmdW5jdGlvbiAoKXtcbiAgICB2YXIgb3V0cHV0UHJvcGVydHlOYW1lLCBjYWxsYmFjaywgaW5wdXRQcm9wZXJ0eU5hbWVzXG5cbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAwKXtcbiAgICAgIHJldHVybiBjb25maWd1cmF0aW9uUHJvcGVydHkoKTtcbiAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSl7XG4gICAgICBpZih0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm9iamVjdFwiKXtcblxuICAgICAgICAvLyBUaGUgaW52b2NhdGlvbiBpcyBvZiB0aGUgZm9ybSBtb2RlbChjb25maWd1cmF0aW9uKVxuICAgICAgICByZXR1cm4gc2V0Q29uZmlndXJhdGlvbihhcmd1bWVudHNbMF0pO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAvLyBUaGUgaW52b2NhdGlvbiBpcyBvZiB0aGUgZm9ybSBtb2RlbChwcm9wZXJ0eU5hbWUpXG4gICAgICAgIHJldHVybiBhZGRQcm9wZXJ0eShhcmd1bWVudHNbMF0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKXtcbiAgICAgIGlmKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09IFwiZnVuY3Rpb25cIil7XG5cbiAgICAgICAgLy8gVGhlIGludm9jYXRpb24gaXMgb2YgdGhlIGZvcm0gbW9kZWwoY2FsbGJhY2ssIGlucHV0UHJvcGVydHlOYW1lcylcbiAgICAgICAgaW5wdXRQcm9wZXJ0eU5hbWVzID0gYXJndW1lbnRzWzFdO1xuICAgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgb3V0cHV0UHJvcGVydHlOYW1lID0gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAvLyBUaGUgaW52b2NhdGlvbiBpcyBvZiB0aGUgZm9ybSBtb2RlbChwcm9wZXJ0eU5hbWUsIGRlZmF1bHRWYWx1ZSlcbiAgICAgICAgcmV0dXJuIGFkZFByb3BlcnR5KGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyl7XG4gICAgICBvdXRwdXRQcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlucHV0UHJvcGVydHlOYW1lcyA9IGFyZ3VtZW50c1syXTtcbiAgICB9XG5cbiAgICAvLyBpbnB1dFByb3BlcnR5TmFtZXMgbWF5IGJlIGEgc3RyaW5nIG9mIGNvbW1hLXNlcGFyYXRlZCBwcm9wZXJ0eSBuYW1lcyxcbiAgICAvLyBvciBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAgICBpZih0eXBlb2YgaW5wdXRQcm9wZXJ0eU5hbWVzID09PSBcInN0cmluZ1wiKXtcbiAgICAgIGlucHV0UHJvcGVydHlOYW1lcyA9IGlucHV0UHJvcGVydHlOYW1lcy5zcGxpdChcIixcIikubWFwKGludm9rZShcInRyaW1cIikpO1xuICAgIH1cblxuICAgIC8vIFRPRE8gdGhyb3cgYW4gZXJyb3IgaWYgYSBwcm9wZXJ0eSBpcyBub3Qgb24gdGhlIG1vZGVsLlxuICAgIHZhciBpbnB1dHMgPSBpbnB1dFByb3BlcnR5TmFtZXMubWFwKGdldFByb3BlcnR5KTtcblxuICAgIC8vIENyZWF0ZSBhIG5ldyByZWFjdGl2ZSBwcm9wZXJ0eSBmb3IgdGhlIG91dHB1dCBhbmQgYXNzaWduIGl0IHRvIHRoZSBtb2RlbC5cbiAgICAvLyBUT0RPIHRocm93IGFuIGVycm9yIGlmIHRoZSBvdXRwdXQgcHJvcGVydHkgaXMgYWxyZWFkeSBkZWZpbmVkIG9uIHRoZSBtb2RlbC5cbiAgICBpZihvdXRwdXRQcm9wZXJ0eU5hbWUpe1xuICAgICAgdmFyIG91dHB1dCA9IFJlYWN0aXZlUHJvcGVydHkoKTtcbiAgICAgIG91dHB1dC5wcm9wZXJ0eU5hbWUgPSBvdXRwdXRQcm9wZXJ0eU5hbWU7XG4gICAgICBtb2RlbFtvdXRwdXRQcm9wZXJ0eU5hbWVdID0gb3V0cHV0O1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIGV4cGVjdGVkIGJ5IHRoZSBjYWxsYmFjayBpcyBvbmUgZ3JlYXRlciB0aGFuIHRoZVxuICAgIC8vIG51bWJlciBvZiBpbnB1dHMsIHRoZW4gdGhlIGxhc3QgYXJndW1lbnQgaXMgdGhlIFwiZG9uZVwiIGNhbGxiYWNrLCBhbmQgdGhpc1xuICAgIC8vIHJlYWN0aXZlIGZ1bmN0aW9uIHdpbGwgYmUgc2V0IHVwIHRvIGJlIGFzeW5jaHJvbm91cy4gVGhlIFwiZG9uZVwiIGNhbGxiYWNrIHNob3VsZFxuICAgIC8vIGJlIGNhbGxlZCB3aXRoIHRoZSBuZXcgdmFsdWUgb2YgdGhlIG91dHB1dCBwcm9wZXJ0eSBhc3luY2hyb25vdXNseS5cbiAgICB2YXIgaXNBc3luY2hyb25vdXMgPSAoY2FsbGJhY2subGVuZ3RoID09PSBpbnB1dHMubGVuZ3RoICsgMSk7XG4gICAgaWYoaXNBc3luY2hyb25vdXMpe1xuICAgICAgcmVhY3RpdmVGdW5jdGlvbnMucHVzaChSZWFjdGl2ZUZ1bmN0aW9uKHtcbiAgICAgICAgaW5wdXRzOiBpbnB1dHMsXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoKXtcblxuICAgICAgICAgIC8vIENvbnZlcnQgdGhlIGFyZ3VtZW50cyBwYXNzZWQgaW50byB0aGlzIGZ1bmN0aW9uIGludG8gYW4gYXJyYXkuXG4gICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgICAgLy8gUHVzaCB0aGUgXCJkb25lXCIgY2FsbGJhY2sgb250byB0aGUgYXJncyBhcnJheS5cbiAgICAgICAgICAvLyBXZSBhcmUgYWN0YWxseSBwYXNzaW5nIHRoZSBvdXRwdXQgcmVhY3RpdmUgcHJvcGVydHkgaGVyZSwgaW52b2tpbmcgaXRcbiAgICAgICAgICAvLyBhcyB0aGUgXCJkb25lXCIgY2FsbGJhY2sgd2lsbCBzZXQgdGhlIHZhbHVlIG9mIHRoZSBvdXRwdXQgcHJvcGVydHkuXG4gICAgICAgICAgYXJncy5wdXNoKG91dHB1dCk7XG5cbiAgICAgICAgICAvLyBXcmFwIGluIHNldFRpbWVvdXQgdG8gZ3VhcmFudGVlIHRoYXQgdGhlIG91dHB1dCBwcm9wZXJ0eSBpcyBzZXRcbiAgICAgICAgICAvLyBhc3luY2hyb25vdXNseSwgb3V0c2lkZSBvZiB0aGUgY3VycmVudCBkaWdlc3QuIFRoaXMgaXMgbmVjZXNzYXJ5XG4gICAgICAgICAgLy8gdG8gZW5zdXJlIHRoYXQgaWYgZGV2ZWxvcGVycyBpbmFkdmVydGVudGx5IGludm9rZSB0aGUgXCJkb25lXCIgY2FsbGJhY2sgXG4gICAgICAgICAgLy8gc3luY2hyb25vdXNseSwgdGhlaXIgY29kZSB3aWxsIHN0aWxsIGhhdmUgdGhlIGV4cGVjdGVkIGJlaGF2aW9yLlxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XG5cbiAgICAgICAgICAgIC8vIEludm9rZSB0aGUgb3JpZ2luYWwgY2FsbGJhY2sgd2l0aCB0aGUgYXJncyBhcnJheSBhcyBhcmd1bWVudHMuXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWFjdGl2ZUZ1bmN0aW9ucy5wdXNoKFJlYWN0aXZlRnVuY3Rpb24oe1xuICAgICAgICBpbnB1dHM6IGlucHV0cyxcbiAgICAgICAgb3V0cHV0OiBvdXRwdXQsIC8vIFRoaXMgbWF5IGJlIHVuZGVmaW5lZC5cbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJldHVybiBtb2RlbDtcbiAgfTtcblxuICAvLyBHZXRzIGEgcmVhY3RpdmUgcHJvcGVydHkgZnJvbSB0aGUgbW9kZWwgYnkgbmFtZS5cbiAgLy8gQ29udmVuaWVudCBmb3IgZnVuY3Rpb25hbCBwYXR0ZXJucyBsaWtlIGBwcm9wZXJ0eU5hbWVzLm1hcChnZXRQcm9wZXJ0eSlgXG4gIGZ1bmN0aW9uIGdldFByb3BlcnR5KHByb3BlcnR5TmFtZSl7XG4gICAgcmV0dXJuIG1vZGVsW3Byb3BlcnR5TmFtZV07XG4gIH1cblxuICAvLyBBZGRzIGEgcHJvcGVydHkgdG8gdGhlIG1vZGVsIHRoYXQgaXMgbm90IGV4cG9zZWQsXG4gIC8vIG1lYW5pbmcgdGhhdCBpdCBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICBmdW5jdGlvbiBhZGRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIGRlZmF1bHRWYWx1ZSl7XG4gICAgdmFyIHByb3BlcnR5ID0gUmVhY3RpdmVQcm9wZXJ0eShkZWZhdWx0VmFsdWUpO1xuICAgIHByb3BlcnR5LnByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZTtcbiAgICBtb2RlbFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHk7XG4gICAgbGFzdFByb3BlcnR5QWRkZWQgPSBwcm9wZXJ0eU5hbWU7XG4gICAgcmV0dXJuIG1vZGVsO1xuXG4gICAgLy8gVE9ETyB0aHJvdyBhbiBlcnJvciBpZiB0aGUgbmFtZSBpcyBub3QgYXZhaWxhYmxlIChlLmcuIGFub3RoZXIgcHJvcGVydHkgbmFtZSwgXCJjb25maWd1cmF0aW9uXCIgb3IgXCJhZGRQdWJsaWNQcm9wZXJ0eVwiKS5cbiAgfVxuXG4gIC8vIEV4cG9zZXMgdGhlIGxhc3QgYWRkZWQgcHJvcGVydHkgdG8gdGhlIGNvbmZpZ3VyYXRpb24uXG4gIGZ1bmN0aW9uIGV4cG9zZSgpe1xuXG4gICAgLy8gVE9ETyB0ZXN0IHRoaXNcbiAgICAvLyBpZighaXNEZWZpbmVkKGRlZmF1bHRWYWx1ZSkpe1xuICAgIC8vICB0aHJvdyBuZXcgRXJyb3IoXCJtb2RlbC5hZGRQdWJsaWNQcm9wZXJ0eSgpIGlzIGJlaW5nIFwiICtcbiAgICAvLyAgICBcImludm9rZWQgd2l0aCBhbiB1bmRlZmluZWQgZGVmYXVsdCB2YWx1ZS4gRGVmYXVsdCB2YWx1ZXMgZm9yIGV4cG9zZWQgcHJvcGVydGllcyBcIiArXG4gICAgLy8gICAgXCJtdXN0IGJlIGRlZmluZWQsIHRvIGd1YXJhbnRlZSBwcmVkaWN0YWJsZSBiZWhhdmlvci4gRm9yIGV4cG9zZWQgcHJvcGVydGllcyB0aGF0IFwiICtcbiAgICAvLyAgICBcImFyZSBvcHRpb25hbCBhbmQgc2hvdWxkIGhhdmUgdGhlIHNlbWFudGljcyBvZiBhbiB1bmRlZmluZWQgdmFsdWUsIFwiICtcbiAgICAvLyAgICBcInVzZSBudWxsIGFzIHRoZSBkZWZhdWx0IHZhbHVlLlwiKTtcbiAgICAvL31cblxuICAgIC8vIFRPRE8gdGVzdCB0aGlzXG4gICAgaWYoIWxhc3RQcm9wZXJ0eUFkZGVkKXtcbiAgICAgIHRocm93IEVycm9yKFwiRXhwb3NlKCkgd2FzIGNhbGxlZCB3aXRob3V0IGZpcnN0IGFkZGluZyBhIHByb3BlcnR5LlwiKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvcGVydHlOYW1lID0gbGFzdFByb3BlcnR5QWRkZWQ7XG5cbiAgICBpZighZXhwb3NlZFByb3BlcnRpZXMpe1xuICAgICAgZXhwb3NlZFByb3BlcnRpZXMgPSBbXTtcbiAgICB9XG4gICAgZXhwb3NlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXG4gICAgLy8gRGVzdHJveSB0aGUgcHJldmlvdXMgcmVhY3RpdmUgZnVuY3Rpb24gdGhhdCB3YXMgbGlzdGVuaW5nIGZvciBjaGFuZ2VzXG4gICAgLy8gaW4gYWxsIGV4cG9zZWQgcHJvcGVydGllcyBleGNlcHQgdGhlIG5ld2x5IGFkZGVkIG9uZS5cbiAgICAvLyBUT0RPIHRoaW5rIGFib3V0IGhvdyB0aGlzIG1pZ2h0IGJlIGRvbmUgb25seSBvbmNlLCBhdCB0aGUgc2FtZSB0aW1lIGlzRmluYWxpemVkIGlzIHNldC5cbiAgICBpZihjb25maWd1cmF0aW9uUmVhY3RpdmVGdW5jdGlvbil7XG4gICAgICBjb25maWd1cmF0aW9uUmVhY3RpdmVGdW5jdGlvbi5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHVwIHRoZSBuZXcgcmVhY3RpdmUgZnVuY3Rpb24gdGhhdCB3aWxsIGxpc3RlbiBmb3IgY2hhbmdlc1xuICAgIC8vIGluIGFsbCBleHBvc2VkIHByb3BlcnRpZXMgaW5jbHVkaW5nIHRoZSBuZXdseSBhZGRlZCBvbmUuXG4gICAgdmFyIGlucHV0UHJvcGVydHlOYW1lcyA9IGV4cG9zZWRQcm9wZXJ0aWVzO1xuXG4gICAgLy9jb25zb2xlLmxvZyhpbnB1dFByb3BlcnR5TmFtZXMpO1xuICAgIGNvbmZpZ3VyYXRpb25SZWFjdGl2ZUZ1bmN0aW9uID0gUmVhY3RpdmVGdW5jdGlvbih7XG4gICAgICBpbnB1dHM6IGlucHV0UHJvcGVydHlOYW1lcy5tYXAoZ2V0UHJvcGVydHkpLFxuICAgICAgb3V0cHV0OiBjb25maWd1cmF0aW9uUHJvcGVydHksXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24gKCl7XG4gICAgICAgIHZhciBjb25maWd1cmF0aW9uID0ge307XG4gICAgICAgIGlucHV0UHJvcGVydHlOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpe1xuICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IGdldFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XG5cbiAgICAgICAgICAvLyBPbWl0IGRlZmF1bHQgdmFsdWVzIGZyb20gdGhlIHJldHVybmVkIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgICAgICAgIGlmKHByb3BlcnR5KCkgIT09IHByb3BlcnR5LmRlZmF1bHQoKSl7XG4gICAgICAgICAgICBjb25maWd1cmF0aW9uW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU3VwcG9ydCBtZXRob2QgY2hhaW5pbmcuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q29uZmlndXJhdGlvbihuZXdDb25maWd1cmF0aW9uKXtcblxuICAgIGV4cG9zZWRQcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSl7XG4gICAgICB2YXIgcHJvcGVydHkgPSBnZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpO1xuICAgICAgdmFyIG9sZFZhbHVlID0gcHJvcGVydHkoKTtcbiAgICAgIHZhciBuZXdWYWx1ZTtcblxuICAgICAgaWYocHJvcGVydHlOYW1lIGluIG5ld0NvbmZpZ3VyYXRpb24pe1xuICAgICAgICBuZXdWYWx1ZSA9IG5ld0NvbmZpZ3VyYXRpb25bcHJvcGVydHlOYW1lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1ZhbHVlID0gcHJvcGVydHkuZGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICBpZihvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpe1xuICAgICAgICBtb2RlbFtwcm9wZXJ0eU5hbWVdKG5ld1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtb2RlbDtcbiAgfVxuXG4gIC8vIERlc3Ryb3lzIGFsbCByZWFjdGl2ZSBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIG1vZGVsLlxuICBmdW5jdGlvbiBkZXN0cm95KCl7XG4gICAgXG4gICAgLy8gRGVzdHJveSByZWFjdGl2ZSBmdW5jdGlvbnMuXG4gICAgcmVhY3RpdmVGdW5jdGlvbnMuZm9yRWFjaChpbnZva2UoXCJkZXN0cm95XCIpKTtcbiAgICBpZihjb25maWd1cmF0aW9uUmVhY3RpdmVGdW5jdGlvbil7XG4gICAgICBjb25maWd1cmF0aW9uUmVhY3RpdmVGdW5jdGlvbi5kZXN0cm95KCk7XG4gICAgfVxuICAgIFxuICAgIC8vIERlc3Ryb3kgcHJvcGVydGllcyAocmVtb3ZlcyBsaXN0ZW5lcnMpLlxuICAgIE9iamVjdC5rZXlzKG1vZGVsKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpe1xuICAgICAgdmFyIHByb3BlcnR5ID0gbW9kZWxbcHJvcGVydHlOYW1lXTtcbiAgICAgIGlmKHByb3BlcnR5LmRlc3Ryb3kpe1xuICAgICAgICBwcm9wZXJ0eS5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBSZWxlYXNlIHJlZmVyZW5jZXMuXG4gICAgcmVhY3RpdmVGdW5jdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgY29uZmlndXJhdGlvblJlYWN0aXZlRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYWxsIChmbil7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGFyZ3NbMF0gPSBtb2RlbDtcbiAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICByZXR1cm4gbW9kZWw7XG4gIH07XG5cbiAgbW9kZWwuZXhwb3NlID0gZXhwb3NlO1xuICBtb2RlbC5kZXN0cm95ID0gZGVzdHJveTtcbiAgbW9kZWwuY2FsbCA9IGNhbGw7XG4gIG1vZGVsLm9uID0gZnVuY3Rpb24gKGNhbGxiYWNrKXtcbiAgXG4gICAgLy8gRW5zdXJlIHRoZSBjYWxsYmFjayBpcyBpbnZva2VkIGFzeW5jaHJvbm91c2x5LFxuICAgIC8vIHNvIHRoYXQgcHJvcGVydHkgdmFsdWVzIGNhbiBiZSBzZXQgaW5zaWRlIGl0LlxuICAgIHJldHVybiBjb25maWd1cmF0aW9uUHJvcGVydHkub24oZnVuY3Rpb24gKG5ld0NvbmZpZ3VyYXRpb24pe1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgY2FsbGJhY2sobmV3Q29uZmlndXJhdGlvbik7XG4gICAgICB9LCAwKTtcbiAgICB9KTtcbiAgfTtcblxuICBtb2RlbC5vZmYgPSBjb25maWd1cmF0aW9uUHJvcGVydHkub2ZmO1xuXG4gIC8vIEV4cG9zZSBkaWdlc3Qgb24gaW5zdGFuY2VzIGZvciBjb252ZW5pZW5jZS5cbiAgbW9kZWwuZGlnZXN0ID0gZnVuY3Rpb24gKCl7XG4gICAgUmVhY3RpdmVNb2RlbC5kaWdlc3QoKTtcbiAgICByZXR1cm4gbW9kZWw7XG4gIH07XG5cbiAgcmV0dXJuIG1vZGVsO1xufVxuXG4vLyBFeHBvc2Ugc3RhdGljIGZ1bmN0aW9ucyBmcm9tIFJlYWN0aXZlRnVuY3Rpb24uXG5SZWFjdGl2ZU1vZGVsLmRpZ2VzdCAgICAgICAgID0gUmVhY3RpdmVGdW5jdGlvbi5kaWdlc3Q7XG5SZWFjdGl2ZU1vZGVsLnNlcmlhbGl6ZUdyYXBoID0gUmVhY3RpdmVGdW5jdGlvbi5zZXJpYWxpemVHcmFwaDtcblJlYWN0aXZlTW9kZWwubGluayAgICAgICAgICAgPSBSZWFjdGl2ZUZ1bmN0aW9uLmxpbms7XG5cbi8vUmVhY3RpdmVNb2RlbC5uZXh0RnJhbWUgPSBSZWFjdGl2ZUZ1bmN0aW9uLm5leHRGcmFtZTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdGl2ZU1vZGVsO1xuIiwidmFyIG5vb3AgPSB7dmFsdWU6IGZ1bmN0aW9uKCkge319O1xuXG5mdW5jdGlvbiBkaXNwYXRjaCgpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcmd1bWVudHMubGVuZ3RoLCBfID0ge30sIHQ7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoISh0ID0gYXJndW1lbnRzW2ldICsgXCJcIikgfHwgKHQgaW4gXykpIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgdHlwZTogXCIgKyB0KTtcbiAgICBfW3RdID0gW107XG4gIH1cbiAgcmV0dXJuIG5ldyBEaXNwYXRjaChfKTtcbn1cblxuZnVuY3Rpb24gRGlzcGF0Y2goXykge1xuICB0aGlzLl8gPSBfO1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMsIHR5cGVzKSB7XG4gIHJldHVybiB0eXBlbmFtZXMudHJpbSgpLnNwbGl0KC9efFxccysvKS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHZhciBuYW1lID0gXCJcIiwgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgbmFtZSA9IHQuc2xpY2UoaSArIDEpLCB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICBpZiAodCAmJiAhdHlwZXMuaGFzT3duUHJvcGVydHkodCkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0KTtcbiAgICByZXR1cm4ge3R5cGU6IHQsIG5hbWU6IG5hbWV9O1xuICB9KTtcbn1cblxuRGlzcGF0Y2gucHJvdG90eXBlID0gZGlzcGF0Y2gucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRGlzcGF0Y2gsXG4gIG9uOiBmdW5jdGlvbih0eXBlbmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgXyA9IHRoaXMuXyxcbiAgICAgICAgVCA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiwgXyksXG4gICAgICAgIHQsXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IFQubGVuZ3RoO1xuXG4gICAgLy8gSWYgbm8gY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBjYWxsYmFjayBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSAmJiAodCA9IGdldChfW3RdLCB0eXBlbmFtZS5uYW1lKSkpIHJldHVybiB0O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIGEgdHlwZSB3YXMgc3BlY2lmaWVkLCBzZXQgdGhlIGNhbGxiYWNrIGZvciB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICAvLyBPdGhlcndpc2UsIGlmIGEgbnVsbCBjYWxsYmFjayB3YXMgc3BlY2lmaWVkLCByZW1vdmUgY2FsbGJhY2tzIG9mIHRoZSBnaXZlbiBuYW1lLlxuICAgIGlmIChjYWxsYmFjayAhPSBudWxsICYmIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGNhbGxiYWNrOiBcIiArIGNhbGxiYWNrKTtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgaWYgKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIGNhbGxiYWNrKTtcbiAgICAgIGVsc2UgaWYgKGNhbGxiYWNrID09IG51bGwpIGZvciAodCBpbiBfKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjb3B5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29weSA9IHt9LCBfID0gdGhpcy5fO1xuICAgIGZvciAodmFyIHQgaW4gXykgY29weVt0XSA9IF9bdF0uc2xpY2UoKTtcbiAgICByZXR1cm4gbmV3IERpc3BhdGNoKGNvcHkpO1xuICB9LFxuICBjYWxsOiBmdW5jdGlvbih0eXBlLCB0aGF0KSB7XG4gICAgaWYgKChuID0gYXJndW1lbnRzLmxlbmd0aCAtIDIpID4gMCkgZm9yICh2YXIgYXJncyA9IG5ldyBBcnJheShuKSwgaSA9IDAsIG4sIHQ7IGkgPCBuOyArK2kpIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh0ID0gdGhpcy5fW3R5cGVdLCBpID0gMCwgbiA9IHQubGVuZ3RoOyBpIDwgbjsgKytpKSB0W2ldLnZhbHVlLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9LFxuICBhcHBseTogZnVuY3Rpb24odHlwZSwgdGhhdCwgYXJncykge1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh2YXIgdCA9IHRoaXMuX1t0eXBlXSwgaSA9IDAsIG4gPSB0Lmxlbmd0aDsgaSA8IG47ICsraSkgdFtpXS52YWx1ZS5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0KHR5cGUsIG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aCwgYzsgaSA8IG47ICsraSkge1xuICAgIGlmICgoYyA9IHR5cGVbaV0pLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiBjLnZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXQodHlwZSwgbmFtZSwgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmICh0eXBlW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHR5cGVbaV0gPSBub29wLCB0eXBlID0gdHlwZS5zbGljZSgwLCBpKS5jb25jYXQodHlwZS5zbGljZShpICsgMSkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChjYWxsYmFjayAhPSBudWxsKSB0eXBlLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiBjYWxsYmFja30pO1xuICByZXR1cm4gdHlwZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2g7XG4iLCJpbXBvcnQge2Rpc3BhdGNofSBmcm9tIFwiZDMtZGlzcGF0Y2hcIjtcbmltcG9ydCB7dGltZXIsIHRpbWVvdXR9IGZyb20gXCJkMy10aW1lclwiO1xuXG52YXIgZW1wdHlPbiA9IGRpc3BhdGNoKFwic3RhcnRcIiwgXCJlbmRcIiwgXCJpbnRlcnJ1cHRcIik7XG52YXIgZW1wdHlUd2VlbiA9IFtdO1xuXG5leHBvcnQgdmFyIENSRUFURUQgPSAwO1xuZXhwb3J0IHZhciBTQ0hFRFVMRUQgPSAxO1xuZXhwb3J0IHZhciBTVEFSVElORyA9IDI7XG5leHBvcnQgdmFyIFNUQVJURUQgPSAzO1xuZXhwb3J0IHZhciBFTkRJTkcgPSA0O1xuZXhwb3J0IHZhciBFTkRFRCA9IDU7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGUsIG5hbWUsIGlkLCBpbmRleCwgZ3JvdXAsIHRpbWluZykge1xuICB2YXIgc2NoZWR1bGVzID0gbm9kZS5fX3RyYW5zaXRpb247XG4gIGlmICghc2NoZWR1bGVzKSBub2RlLl9fdHJhbnNpdGlvbiA9IHt9O1xuICBlbHNlIGlmIChpZCBpbiBzY2hlZHVsZXMpIHJldHVybjtcbiAgY3JlYXRlKG5vZGUsIGlkLCB7XG4gICAgbmFtZTogbmFtZSxcbiAgICBpbmRleDogaW5kZXgsIC8vIEZvciBjb250ZXh0IGR1cmluZyBjYWxsYmFjay5cbiAgICBncm91cDogZ3JvdXAsIC8vIEZvciBjb250ZXh0IGR1cmluZyBjYWxsYmFjay5cbiAgICBvbjogZW1wdHlPbixcbiAgICB0d2VlbjogZW1wdHlUd2VlbixcbiAgICB0aW1lOiB0aW1pbmcudGltZSxcbiAgICBkZWxheTogdGltaW5nLmRlbGF5LFxuICAgIGR1cmF0aW9uOiB0aW1pbmcuZHVyYXRpb24sXG4gICAgZWFzZTogdGltaW5nLmVhc2UsXG4gICAgdGltZXI6IG51bGwsXG4gICAgc3RhdGU6IENSRUFURURcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KG5vZGUsIGlkKSB7XG4gIHZhciBzY2hlZHVsZSA9IG5vZGUuX190cmFuc2l0aW9uO1xuICBpZiAoIXNjaGVkdWxlIHx8ICEoc2NoZWR1bGUgPSBzY2hlZHVsZVtpZF0pIHx8IHNjaGVkdWxlLnN0YXRlID4gQ1JFQVRFRCkgdGhyb3cgbmV3IEVycm9yKFwidG9vIGxhdGVcIik7XG4gIHJldHVybiBzY2hlZHVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldChub2RlLCBpZCkge1xuICB2YXIgc2NoZWR1bGUgPSBub2RlLl9fdHJhbnNpdGlvbjtcbiAgaWYgKCFzY2hlZHVsZSB8fCAhKHNjaGVkdWxlID0gc2NoZWR1bGVbaWRdKSB8fCBzY2hlZHVsZS5zdGF0ZSA+IFNUQVJUSU5HKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b28gbGF0ZVwiKTtcbiAgcmV0dXJuIHNjaGVkdWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KG5vZGUsIGlkKSB7XG4gIHZhciBzY2hlZHVsZSA9IG5vZGUuX190cmFuc2l0aW9uO1xuICBpZiAoIXNjaGVkdWxlIHx8ICEoc2NoZWR1bGUgPSBzY2hlZHVsZVtpZF0pKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b28gbGF0ZVwiKTtcbiAgcmV0dXJuIHNjaGVkdWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGUobm9kZSwgaWQsIHNlbGYpIHtcbiAgdmFyIHNjaGVkdWxlcyA9IG5vZGUuX190cmFuc2l0aW9uLFxuICAgICAgdHdlZW47XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgc2VsZiB0aW1lciB3aGVuIHRoZSB0cmFuc2l0aW9uIGlzIGNyZWF0ZWQuXG4gIC8vIE5vdGUgdGhlIGFjdHVhbCBkZWxheSBpcyBub3Qga25vd24gdW50aWwgdGhlIGZpcnN0IGNhbGxiYWNrIVxuICBzY2hlZHVsZXNbaWRdID0gc2VsZjtcbiAgc2VsZi50aW1lciA9IHRpbWVyKHNjaGVkdWxlLCAwLCBzZWxmLnRpbWUpO1xuXG4gIC8vIElmIHRoZSBkZWxheSBpcyBncmVhdGVyIHRoYW4gdGhpcyBmaXJzdCBzbGVlcCwgc2xlZXAgc29tZSBtb3JlO1xuICAvLyBvdGhlcndpc2UsIHN0YXJ0IGltbWVkaWF0ZWx5LlxuICBmdW5jdGlvbiBzY2hlZHVsZShlbGFwc2VkKSB7XG4gICAgc2VsZi5zdGF0ZSA9IFNDSEVEVUxFRDtcbiAgICBpZiAoc2VsZi5kZWxheSA8PSBlbGFwc2VkKSBzdGFydChlbGFwc2VkIC0gc2VsZi5kZWxheSk7XG4gICAgZWxzZSBzZWxmLnRpbWVyLnJlc3RhcnQoc3RhcnQsIHNlbGYuZGVsYXksIHNlbGYudGltZSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydChlbGFwc2VkKSB7XG4gICAgdmFyIGksIGosIG4sIG87XG5cbiAgICBmb3IgKGkgaW4gc2NoZWR1bGVzKSB7XG4gICAgICBvID0gc2NoZWR1bGVzW2ldO1xuICAgICAgaWYgKG8ubmFtZSAhPT0gc2VsZi5uYW1lKSBjb250aW51ZTtcblxuICAgICAgLy8gSW50ZXJydXB0IHRoZSBhY3RpdmUgdHJhbnNpdGlvbiwgaWYgYW55LlxuICAgICAgLy8gRGlzcGF0Y2ggdGhlIGludGVycnVwdCBldmVudC5cbiAgICAgIGlmIChvLnN0YXRlID09PSBTVEFSVEVEKSB7XG4gICAgICAgIG8uc3RhdGUgPSBFTkRFRDtcbiAgICAgICAgby50aW1lci5zdG9wKCk7XG4gICAgICAgIG8ub24uY2FsbChcImludGVycnVwdFwiLCBub2RlLCBub2RlLl9fZGF0YV9fLCBvLmluZGV4LCBvLmdyb3VwKTtcbiAgICAgICAgZGVsZXRlIHNjaGVkdWxlc1tpXTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FuY2VsIGFueSBwcmUtZW1wdGVkIHRyYW5zaXRpb25zLiBObyBpbnRlcnJ1cHQgZXZlbnQgaXMgZGlzcGF0Y2hlZFxuICAgICAgLy8gYmVjYXVzZSB0aGUgY2FuY2VsbGVkIHRyYW5zaXRpb25zIG5ldmVyIHN0YXJ0ZWQuIE5vdGUgdGhhdCB0aGlzIGFsc29cbiAgICAgIC8vIHJlbW92ZXMgdGhpcyB0cmFuc2l0aW9uIGZyb20gdGhlIHBlbmRpbmcgbGlzdCFcbiAgICAgIGVsc2UgaWYgKCtpIDwgaWQpIHtcbiAgICAgICAgby5zdGF0ZSA9IEVOREVEO1xuICAgICAgICBvLnRpbWVyLnN0b3AoKTtcbiAgICAgICAgZGVsZXRlIHNjaGVkdWxlc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEZWZlciB0aGUgZmlyc3QgdGljayB0byBlbmQgb2YgdGhlIGN1cnJlbnQgZnJhbWU7IHNlZSBtYm9zdG9jay9kMyMxNTc2LlxuICAgIC8vIE5vdGUgdGhlIHRyYW5zaXRpb24gbWF5IGJlIGNhbmNlbGVkIGFmdGVyIHN0YXJ0IGFuZCBiZWZvcmUgdGhlIGZpcnN0IHRpY2shXG4gICAgLy8gTm90ZSB0aGlzIG11c3QgYmUgc2NoZWR1bGVkIGJlZm9yZSB0aGUgc3RhcnQgZXZlbnQ7IHNlZSBkMy9kMy10cmFuc2l0aW9uIzE2IVxuICAgIC8vIEFzc3VtaW5nIHRoaXMgaXMgc3VjY2Vzc2Z1bCwgc3Vic2VxdWVudCBjYWxsYmFja3MgZ28gc3RyYWlnaHQgdG8gdGljay5cbiAgICB0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNlbGYuc3RhdGUgPT09IFNUQVJURUQpIHtcbiAgICAgICAgc2VsZi50aW1lci5yZXN0YXJ0KHRpY2ssIHNlbGYuZGVsYXksIHNlbGYudGltZSk7XG4gICAgICAgIHRpY2soZWxhcHNlZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBEaXNwYXRjaCB0aGUgc3RhcnQgZXZlbnQuXG4gICAgLy8gTm90ZSB0aGlzIG11c3QgYmUgZG9uZSBiZWZvcmUgdGhlIHR3ZWVuIGFyZSBpbml0aWFsaXplZC5cbiAgICBzZWxmLnN0YXRlID0gU1RBUlRJTkc7XG4gICAgc2VsZi5vbi5jYWxsKFwic3RhcnRcIiwgbm9kZSwgbm9kZS5fX2RhdGFfXywgc2VsZi5pbmRleCwgc2VsZi5ncm91cCk7XG4gICAgaWYgKHNlbGYuc3RhdGUgIT09IFNUQVJUSU5HKSByZXR1cm47IC8vIGludGVycnVwdGVkXG4gICAgc2VsZi5zdGF0ZSA9IFNUQVJURUQ7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSB0d2VlbiwgZGVsZXRpbmcgbnVsbCB0d2Vlbi5cbiAgICB0d2VlbiA9IG5ldyBBcnJheShuID0gc2VsZi50d2Vlbi5sZW5ndGgpO1xuICAgIGZvciAoaSA9IDAsIGogPSAtMTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG8gPSBzZWxmLnR3ZWVuW2ldLnZhbHVlLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgc2VsZi5pbmRleCwgc2VsZi5ncm91cCkpIHtcbiAgICAgICAgdHdlZW5bKytqXSA9IG87XG4gICAgICB9XG4gICAgfVxuICAgIHR3ZWVuLmxlbmd0aCA9IGogKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gdGljayhlbGFwc2VkKSB7XG4gICAgdmFyIHQgPSBlbGFwc2VkIDwgc2VsZi5kdXJhdGlvbiA/IHNlbGYuZWFzZS5jYWxsKG51bGwsIGVsYXBzZWQgLyBzZWxmLmR1cmF0aW9uKSA6IChzZWxmLnN0YXRlID0gRU5ESU5HLCAxKSxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBuID0gdHdlZW4ubGVuZ3RoO1xuXG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIHR3ZWVuW2ldLmNhbGwobnVsbCwgdCk7XG4gICAgfVxuXG4gICAgLy8gRGlzcGF0Y2ggdGhlIGVuZCBldmVudC5cbiAgICBpZiAoc2VsZi5zdGF0ZSA9PT0gRU5ESU5HKSB7XG4gICAgICBzZWxmLnN0YXRlID0gRU5ERUQ7XG4gICAgICBzZWxmLnRpbWVyLnN0b3AoKTtcbiAgICAgIHNlbGYub24uY2FsbChcImVuZFwiLCBub2RlLCBub2RlLl9fZGF0YV9fLCBzZWxmLmluZGV4LCBzZWxmLmdyb3VwKTtcbiAgICAgIGZvciAoaSBpbiBzY2hlZHVsZXMpIGlmICgraSAhPT0gaWQpIHJldHVybiB2b2lkIGRlbGV0ZSBzY2hlZHVsZXNbaWRdO1xuICAgICAgZGVsZXRlIG5vZGUuX190cmFuc2l0aW9uO1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29uc3RydWN0b3IsIGZhY3RvcnksIHByb3RvdHlwZSkge1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBmYWN0b3J5LnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgcHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQocGFyZW50LCBkZWZpbml0aW9uKSB7XG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xuICBmb3IgKHZhciBrZXkgaW4gZGVmaW5pdGlvbikgcHJvdG90eXBlW2tleV0gPSBkZWZpbml0aW9uW2tleV07XG4gIHJldHVybiBwcm90b3R5cGU7XG59XG4iLCJpbXBvcnQgZGVmaW5lLCB7ZXh0ZW5kfSBmcm9tIFwiLi9kZWZpbmVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbG9yKCkge31cblxuZXhwb3J0IHZhciBkYXJrZXIgPSAwLjc7XG5leHBvcnQgdmFyIGJyaWdodGVyID0gMSAvIGRhcmtlcjtcblxudmFyIHJlSGV4MyA9IC9eIyhbMC05YS1mXXszfSkkLyxcbiAgICByZUhleDYgPSAvXiMoWzAtOWEtZl17Nn0pJC8sXG4gICAgcmVSZ2JJbnRlZ2VyID0gL15yZ2JcXChcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKlxcKSQvLFxuICAgIHJlUmdiUGVyY2VudCA9IC9ecmdiXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccypcXCkkLyxcbiAgICByZVJnYmFJbnRlZ2VyID0gL15yZ2JhXFwoXFxzKihbLStdP1xcZCspXFxzKixcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKSQvLFxuICAgIHJlUmdiYVBlcmNlbnQgPSAvXnJnYmFcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqXFwpJC8sXG4gICAgcmVIc2xQZXJjZW50ID0gL15oc2xcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqXFwpJC8sXG4gICAgcmVIc2xhUGVyY2VudCA9IC9eaHNsYVxcKFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKSQvO1xuXG52YXIgbmFtZWQgPSB7XG4gIGFsaWNlYmx1ZTogMHhmMGY4ZmYsXG4gIGFudGlxdWV3aGl0ZTogMHhmYWViZDcsXG4gIGFxdWE6IDB4MDBmZmZmLFxuICBhcXVhbWFyaW5lOiAweDdmZmZkNCxcbiAgYXp1cmU6IDB4ZjBmZmZmLFxuICBiZWlnZTogMHhmNWY1ZGMsXG4gIGJpc3F1ZTogMHhmZmU0YzQsXG4gIGJsYWNrOiAweDAwMDAwMCxcbiAgYmxhbmNoZWRhbG1vbmQ6IDB4ZmZlYmNkLFxuICBibHVlOiAweDAwMDBmZixcbiAgYmx1ZXZpb2xldDogMHg4YTJiZTIsXG4gIGJyb3duOiAweGE1MmEyYSxcbiAgYnVybHl3b29kOiAweGRlYjg4NyxcbiAgY2FkZXRibHVlOiAweDVmOWVhMCxcbiAgY2hhcnRyZXVzZTogMHg3ZmZmMDAsXG4gIGNob2NvbGF0ZTogMHhkMjY5MWUsXG4gIGNvcmFsOiAweGZmN2Y1MCxcbiAgY29ybmZsb3dlcmJsdWU6IDB4NjQ5NWVkLFxuICBjb3Juc2lsazogMHhmZmY4ZGMsXG4gIGNyaW1zb246IDB4ZGMxNDNjLFxuICBjeWFuOiAweDAwZmZmZixcbiAgZGFya2JsdWU6IDB4MDAwMDhiLFxuICBkYXJrY3lhbjogMHgwMDhiOGIsXG4gIGRhcmtnb2xkZW5yb2Q6IDB4Yjg4NjBiLFxuICBkYXJrZ3JheTogMHhhOWE5YTksXG4gIGRhcmtncmVlbjogMHgwMDY0MDAsXG4gIGRhcmtncmV5OiAweGE5YTlhOSxcbiAgZGFya2toYWtpOiAweGJkYjc2YixcbiAgZGFya21hZ2VudGE6IDB4OGIwMDhiLFxuICBkYXJrb2xpdmVncmVlbjogMHg1NTZiMmYsXG4gIGRhcmtvcmFuZ2U6IDB4ZmY4YzAwLFxuICBkYXJrb3JjaGlkOiAweDk5MzJjYyxcbiAgZGFya3JlZDogMHg4YjAwMDAsXG4gIGRhcmtzYWxtb246IDB4ZTk5NjdhLFxuICBkYXJrc2VhZ3JlZW46IDB4OGZiYzhmLFxuICBkYXJrc2xhdGVibHVlOiAweDQ4M2Q4YixcbiAgZGFya3NsYXRlZ3JheTogMHgyZjRmNGYsXG4gIGRhcmtzbGF0ZWdyZXk6IDB4MmY0ZjRmLFxuICBkYXJrdHVycXVvaXNlOiAweDAwY2VkMSxcbiAgZGFya3Zpb2xldDogMHg5NDAwZDMsXG4gIGRlZXBwaW5rOiAweGZmMTQ5MyxcbiAgZGVlcHNreWJsdWU6IDB4MDBiZmZmLFxuICBkaW1ncmF5OiAweDY5Njk2OSxcbiAgZGltZ3JleTogMHg2OTY5NjksXG4gIGRvZGdlcmJsdWU6IDB4MWU5MGZmLFxuICBmaXJlYnJpY2s6IDB4YjIyMjIyLFxuICBmbG9yYWx3aGl0ZTogMHhmZmZhZjAsXG4gIGZvcmVzdGdyZWVuOiAweDIyOGIyMixcbiAgZnVjaHNpYTogMHhmZjAwZmYsXG4gIGdhaW5zYm9ybzogMHhkY2RjZGMsXG4gIGdob3N0d2hpdGU6IDB4ZjhmOGZmLFxuICBnb2xkOiAweGZmZDcwMCxcbiAgZ29sZGVucm9kOiAweGRhYTUyMCxcbiAgZ3JheTogMHg4MDgwODAsXG4gIGdyZWVuOiAweDAwODAwMCxcbiAgZ3JlZW55ZWxsb3c6IDB4YWRmZjJmLFxuICBncmV5OiAweDgwODA4MCxcbiAgaG9uZXlkZXc6IDB4ZjBmZmYwLFxuICBob3RwaW5rOiAweGZmNjliNCxcbiAgaW5kaWFucmVkOiAweGNkNWM1YyxcbiAgaW5kaWdvOiAweDRiMDA4MixcbiAgaXZvcnk6IDB4ZmZmZmYwLFxuICBraGFraTogMHhmMGU2OGMsXG4gIGxhdmVuZGVyOiAweGU2ZTZmYSxcbiAgbGF2ZW5kZXJibHVzaDogMHhmZmYwZjUsXG4gIGxhd25ncmVlbjogMHg3Y2ZjMDAsXG4gIGxlbW9uY2hpZmZvbjogMHhmZmZhY2QsXG4gIGxpZ2h0Ymx1ZTogMHhhZGQ4ZTYsXG4gIGxpZ2h0Y29yYWw6IDB4ZjA4MDgwLFxuICBsaWdodGN5YW46IDB4ZTBmZmZmLFxuICBsaWdodGdvbGRlbnJvZHllbGxvdzogMHhmYWZhZDIsXG4gIGxpZ2h0Z3JheTogMHhkM2QzZDMsXG4gIGxpZ2h0Z3JlZW46IDB4OTBlZTkwLFxuICBsaWdodGdyZXk6IDB4ZDNkM2QzLFxuICBsaWdodHBpbms6IDB4ZmZiNmMxLFxuICBsaWdodHNhbG1vbjogMHhmZmEwN2EsXG4gIGxpZ2h0c2VhZ3JlZW46IDB4MjBiMmFhLFxuICBsaWdodHNreWJsdWU6IDB4ODdjZWZhLFxuICBsaWdodHNsYXRlZ3JheTogMHg3Nzg4OTksXG4gIGxpZ2h0c2xhdGVncmV5OiAweDc3ODg5OSxcbiAgbGlnaHRzdGVlbGJsdWU6IDB4YjBjNGRlLFxuICBsaWdodHllbGxvdzogMHhmZmZmZTAsXG4gIGxpbWU6IDB4MDBmZjAwLFxuICBsaW1lZ3JlZW46IDB4MzJjZDMyLFxuICBsaW5lbjogMHhmYWYwZTYsXG4gIG1hZ2VudGE6IDB4ZmYwMGZmLFxuICBtYXJvb246IDB4ODAwMDAwLFxuICBtZWRpdW1hcXVhbWFyaW5lOiAweDY2Y2RhYSxcbiAgbWVkaXVtYmx1ZTogMHgwMDAwY2QsXG4gIG1lZGl1bW9yY2hpZDogMHhiYTU1ZDMsXG4gIG1lZGl1bXB1cnBsZTogMHg5MzcwZGIsXG4gIG1lZGl1bXNlYWdyZWVuOiAweDNjYjM3MSxcbiAgbWVkaXVtc2xhdGVibHVlOiAweDdiNjhlZSxcbiAgbWVkaXVtc3ByaW5nZ3JlZW46IDB4MDBmYTlhLFxuICBtZWRpdW10dXJxdW9pc2U6IDB4NDhkMWNjLFxuICBtZWRpdW12aW9sZXRyZWQ6IDB4YzcxNTg1LFxuICBtaWRuaWdodGJsdWU6IDB4MTkxOTcwLFxuICBtaW50Y3JlYW06IDB4ZjVmZmZhLFxuICBtaXN0eXJvc2U6IDB4ZmZlNGUxLFxuICBtb2NjYXNpbjogMHhmZmU0YjUsXG4gIG5hdmFqb3doaXRlOiAweGZmZGVhZCxcbiAgbmF2eTogMHgwMDAwODAsXG4gIG9sZGxhY2U6IDB4ZmRmNWU2LFxuICBvbGl2ZTogMHg4MDgwMDAsXG4gIG9saXZlZHJhYjogMHg2YjhlMjMsXG4gIG9yYW5nZTogMHhmZmE1MDAsXG4gIG9yYW5nZXJlZDogMHhmZjQ1MDAsXG4gIG9yY2hpZDogMHhkYTcwZDYsXG4gIHBhbGVnb2xkZW5yb2Q6IDB4ZWVlOGFhLFxuICBwYWxlZ3JlZW46IDB4OThmYjk4LFxuICBwYWxldHVycXVvaXNlOiAweGFmZWVlZSxcbiAgcGFsZXZpb2xldHJlZDogMHhkYjcwOTMsXG4gIHBhcGF5YXdoaXA6IDB4ZmZlZmQ1LFxuICBwZWFjaHB1ZmY6IDB4ZmZkYWI5LFxuICBwZXJ1OiAweGNkODUzZixcbiAgcGluazogMHhmZmMwY2IsXG4gIHBsdW06IDB4ZGRhMGRkLFxuICBwb3dkZXJibHVlOiAweGIwZTBlNixcbiAgcHVycGxlOiAweDgwMDA4MCxcbiAgcmViZWNjYXB1cnBsZTogMHg2NjMzOTksXG4gIHJlZDogMHhmZjAwMDAsXG4gIHJvc3licm93bjogMHhiYzhmOGYsXG4gIHJveWFsYmx1ZTogMHg0MTY5ZTEsXG4gIHNhZGRsZWJyb3duOiAweDhiNDUxMyxcbiAgc2FsbW9uOiAweGZhODA3MixcbiAgc2FuZHlicm93bjogMHhmNGE0NjAsXG4gIHNlYWdyZWVuOiAweDJlOGI1NyxcbiAgc2Vhc2hlbGw6IDB4ZmZmNWVlLFxuICBzaWVubmE6IDB4YTA1MjJkLFxuICBzaWx2ZXI6IDB4YzBjMGMwLFxuICBza3libHVlOiAweDg3Y2VlYixcbiAgc2xhdGVibHVlOiAweDZhNWFjZCxcbiAgc2xhdGVncmF5OiAweDcwODA5MCxcbiAgc2xhdGVncmV5OiAweDcwODA5MCxcbiAgc25vdzogMHhmZmZhZmEsXG4gIHNwcmluZ2dyZWVuOiAweDAwZmY3ZixcbiAgc3RlZWxibHVlOiAweDQ2ODJiNCxcbiAgdGFuOiAweGQyYjQ4YyxcbiAgdGVhbDogMHgwMDgwODAsXG4gIHRoaXN0bGU6IDB4ZDhiZmQ4LFxuICB0b21hdG86IDB4ZmY2MzQ3LFxuICB0dXJxdW9pc2U6IDB4NDBlMGQwLFxuICB2aW9sZXQ6IDB4ZWU4MmVlLFxuICB3aGVhdDogMHhmNWRlYjMsXG4gIHdoaXRlOiAweGZmZmZmZixcbiAgd2hpdGVzbW9rZTogMHhmNWY1ZjUsXG4gIHllbGxvdzogMHhmZmZmMDAsXG4gIHllbGxvd2dyZWVuOiAweDlhY2QzMlxufTtcblxuZGVmaW5lKENvbG9yLCBjb2xvciwge1xuICBkaXNwbGF5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmdiKCkuZGlzcGxheWFibGUoKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJnYigpICsgXCJcIjtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbG9yKGZvcm1hdCkge1xuICB2YXIgbTtcbiAgZm9ybWF0ID0gKGZvcm1hdCArIFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKG0gPSByZUhleDMuZXhlYyhmb3JtYXQpKSA/IChtID0gcGFyc2VJbnQobVsxXSwgMTYpLCBuZXcgUmdiKChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4MGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpLCAxKSkgLy8gI2YwMFxuICAgICAgOiAobSA9IHJlSGV4Ni5leGVjKGZvcm1hdCkpID8gcmdibihwYXJzZUludChtWzFdLCAxNikpIC8vICNmZjAwMDBcbiAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSwgbVsyXSwgbVszXSwgMSkgLy8gcmdiKDI1NSwgMCwgMClcbiAgICAgIDogKG0gPSByZVJnYlBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgMSkgLy8gcmdiKDEwMCUsIDAlLCAwJSlcbiAgICAgIDogKG0gPSByZVJnYmFJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyByZ2JhKG1bMV0sIG1bMl0sIG1bM10sIG1bNF0pIC8vIHJnYmEoMjU1LCAwLCAwLCAxKVxuICAgICAgOiAobSA9IHJlUmdiYVBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IHJnYmEobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgbVs0XSkgLy8gcmdiKDEwMCUsIDAlLCAwJSwgMSlcbiAgICAgIDogKG0gPSByZUhzbFBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbGEobVsxXSwgbVsyXSAvIDEwMCwgbVszXSAvIDEwMCwgMSkgLy8gaHNsKDEyMCwgNTAlLCA1MCUpXG4gICAgICA6IChtID0gcmVIc2xhUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsYShtWzFdLCBtWzJdIC8gMTAwLCBtWzNdIC8gMTAwLCBtWzRdKSAvLyBoc2xhKDEyMCwgNTAlLCA1MCUsIDEpXG4gICAgICA6IG5hbWVkLmhhc093blByb3BlcnR5KGZvcm1hdCkgPyByZ2JuKG5hbWVkW2Zvcm1hdF0pXG4gICAgICA6IGZvcm1hdCA9PT0gXCJ0cmFuc3BhcmVudFwiID8gbmV3IFJnYihOYU4sIE5hTiwgTmFOLCAwKVxuICAgICAgOiBudWxsO1xufVxuXG5mdW5jdGlvbiByZ2JuKG4pIHtcbiAgcmV0dXJuIG5ldyBSZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmLCAxKTtcbn1cblxuZnVuY3Rpb24gcmdiYShyLCBnLCBiLCBhKSB7XG4gIGlmIChhIDw9IDApIHIgPSBnID0gYiA9IE5hTjtcbiAgcmV0dXJuIG5ldyBSZ2IociwgZywgYiwgYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZ2JDb252ZXJ0KG8pIHtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIENvbG9yKSkgbyA9IGNvbG9yKG8pO1xuICBpZiAoIW8pIHJldHVybiBuZXcgUmdiO1xuICBvID0gby5yZ2IoKTtcbiAgcmV0dXJuIG5ldyBSZ2Ioby5yLCBvLmcsIG8uYiwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYihyLCBnLCBiLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gcmdiQ29udmVydChyKSA6IG5ldyBSZ2IociwgZywgYiwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmdiKHIsIGcsIGIsIG9wYWNpdHkpIHtcbiAgdGhpcy5yID0gK3I7XG4gIHRoaXMuZyA9ICtnO1xuICB0aGlzLmIgPSArYjtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShSZ2IsIHJnYiwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGRpc3BsYXlhYmxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKDAgPD0gdGhpcy5yICYmIHRoaXMuciA8PSAyNTUpXG4gICAgICAgICYmICgwIDw9IHRoaXMuZyAmJiB0aGlzLmcgPD0gMjU1KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmIgJiYgdGhpcy5iIDw9IDI1NSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5vcGFjaXR5ICYmIHRoaXMub3BhY2l0eSA8PSAxKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhID0gdGhpcy5vcGFjaXR5OyBhID0gaXNOYU4oYSkgPyAxIDogTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgYSkpO1xuICAgIHJldHVybiAoYSA9PT0gMSA/IFwicmdiKFwiIDogXCJyZ2JhKFwiKVxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLnIpIHx8IDApKSArIFwiLCBcIlxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLmcpIHx8IDApKSArIFwiLCBcIlxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLmIpIHx8IDApKVxuICAgICAgICArIChhID09PSAxID8gXCIpXCIgOiBcIiwgXCIgKyBhICsgXCIpXCIpO1xuICB9XG59KSk7XG5cbmZ1bmN0aW9uIGhzbGEoaCwgcywgbCwgYSkge1xuICBpZiAoYSA8PSAwKSBoID0gcyA9IGwgPSBOYU47XG4gIGVsc2UgaWYgKGwgPD0gMCB8fCBsID49IDEpIGggPSBzID0gTmFOO1xuICBlbHNlIGlmIChzIDw9IDApIGggPSBOYU47XG4gIHJldHVybiBuZXcgSHNsKGgsIHMsIGwsIGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHNsQ29udmVydChvKSB7XG4gIGlmIChvIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gbmV3IEhzbChvLmgsIG8ucywgby5sLCBvLm9wYWNpdHkpO1xuICBpZiAoIShvIGluc3RhbmNlb2YgQ29sb3IpKSBvID0gY29sb3Iobyk7XG4gIGlmICghbykgcmV0dXJuIG5ldyBIc2w7XG4gIGlmIChvIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gbztcbiAgbyA9IG8ucmdiKCk7XG4gIHZhciByID0gby5yIC8gMjU1LFxuICAgICAgZyA9IG8uZyAvIDI1NSxcbiAgICAgIGIgPSBvLmIgLyAyNTUsXG4gICAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcbiAgICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxuICAgICAgaCA9IE5hTixcbiAgICAgIHMgPSBtYXggLSBtaW4sXG4gICAgICBsID0gKG1heCArIG1pbikgLyAyO1xuICBpZiAocykge1xuICAgIGlmIChyID09PSBtYXgpIGggPSAoZyAtIGIpIC8gcyArIChnIDwgYikgKiA2O1xuICAgIGVsc2UgaWYgKGcgPT09IG1heCkgaCA9IChiIC0gcikgLyBzICsgMjtcbiAgICBlbHNlIGggPSAociAtIGcpIC8gcyArIDQ7XG4gICAgcyAvPSBsIDwgMC41ID8gbWF4ICsgbWluIDogMiAtIG1heCAtIG1pbjtcbiAgICBoICo9IDYwO1xuICB9IGVsc2Uge1xuICAgIHMgPSBsID4gMCAmJiBsIDwgMSA/IDAgOiBoO1xuICB9XG4gIHJldHVybiBuZXcgSHNsKGgsIHMsIGwsIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoc2woaCwgcywgbCwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IGhzbENvbnZlcnQoaCkgOiBuZXcgSHNsKGgsIHMsIGwsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZnVuY3Rpb24gSHNsKGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgdGhpcy5oID0gK2g7XG4gIHRoaXMucyA9ICtzO1xuICB0aGlzLmwgPSArbDtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShIc2wsIGhzbCwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXI6IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaCA9IHRoaXMuaCAlIDM2MCArICh0aGlzLmggPCAwKSAqIDM2MCxcbiAgICAgICAgcyA9IGlzTmFOKGgpIHx8IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zLFxuICAgICAgICBsID0gdGhpcy5sLFxuICAgICAgICBtMiA9IGwgKyAobCA8IDAuNSA/IGwgOiAxIC0gbCkgKiBzLFxuICAgICAgICBtMSA9IDIgKiBsIC0gbTI7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICBoc2wycmdiKGggPj0gMjQwID8gaCAtIDI0MCA6IGggKyAxMjAsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGgsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGggPCAxMjAgPyBoICsgMjQwIDogaCAtIDEyMCwgbTEsIG0yKSxcbiAgICAgIHRoaXMub3BhY2l0eVxuICAgICk7XG4gIH0sXG4gIGRpc3BsYXlhYmxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKDAgPD0gdGhpcy5zICYmIHRoaXMucyA8PSAxIHx8IGlzTmFOKHRoaXMucykpXG4gICAgICAgICYmICgwIDw9IHRoaXMubCAmJiB0aGlzLmwgPD0gMSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5vcGFjaXR5ICYmIHRoaXMub3BhY2l0eSA8PSAxKTtcbiAgfVxufSkpO1xuXG4vKiBGcm9tIEZ2RCAxMy4zNywgQ1NTIENvbG9yIE1vZHVsZSBMZXZlbCAzICovXG5mdW5jdGlvbiBoc2wycmdiKGgsIG0xLCBtMikge1xuICByZXR1cm4gKGggPCA2MCA/IG0xICsgKG0yIC0gbTEpICogaCAvIDYwXG4gICAgICA6IGggPCAxODAgPyBtMlxuICAgICAgOiBoIDwgMjQwID8gbTEgKyAobTIgLSBtMSkgKiAoMjQwIC0gaCkgLyA2MFxuICAgICAgOiBtMSkgKiAyNTU7XG59XG4iLCJleHBvcnQgdmFyIGRlZzJyYWQgPSBNYXRoLlBJIC8gMTgwO1xuZXhwb3J0IHZhciByYWQyZGVnID0gMTgwIC8gTWF0aC5QSTtcbiIsImltcG9ydCBkZWZpbmUsIHtleHRlbmR9IGZyb20gXCIuL2RlZmluZVwiO1xuaW1wb3J0IHtDb2xvciwgcmdiQ29udmVydCwgUmdifSBmcm9tIFwiLi9jb2xvclwiO1xuaW1wb3J0IHtkZWcycmFkLCByYWQyZGVnfSBmcm9tIFwiLi9tYXRoXCI7XG5cbnZhciBLbiA9IDE4LFxuICAgIFhuID0gMC45NTA0NzAsIC8vIEQ2NSBzdGFuZGFyZCByZWZlcmVudFxuICAgIFluID0gMSxcbiAgICBabiA9IDEuMDg4ODMwLFxuICAgIHQwID0gNCAvIDI5LFxuICAgIHQxID0gNiAvIDI5LFxuICAgIHQyID0gMyAqIHQxICogdDEsXG4gICAgdDMgPSB0MSAqIHQxICogdDE7XG5cbmZ1bmN0aW9uIGxhYkNvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIExhYikgcmV0dXJuIG5ldyBMYWIoby5sLCBvLmEsIG8uYiwgby5vcGFjaXR5KTtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIY2wpIHtcbiAgICB2YXIgaCA9IG8uaCAqIGRlZzJyYWQ7XG4gICAgcmV0dXJuIG5ldyBMYWIoby5sLCBNYXRoLmNvcyhoKSAqIG8uYywgTWF0aC5zaW4oaCkgKiBvLmMsIG8ub3BhY2l0eSk7XG4gIH1cbiAgaWYgKCEobyBpbnN0YW5jZW9mIFJnYikpIG8gPSByZ2JDb252ZXJ0KG8pO1xuICB2YXIgYiA9IHJnYjJ4eXooby5yKSxcbiAgICAgIGEgPSByZ2IyeHl6KG8uZyksXG4gICAgICBsID0gcmdiMnh5eihvLmIpLFxuICAgICAgeCA9IHh5ejJsYWIoKDAuNDEyNDU2NCAqIGIgKyAwLjM1NzU3NjEgKiBhICsgMC4xODA0Mzc1ICogbCkgLyBYbiksXG4gICAgICB5ID0geHl6MmxhYigoMC4yMTI2NzI5ICogYiArIDAuNzE1MTUyMiAqIGEgKyAwLjA3MjE3NTAgKiBsKSAvIFluKSxcbiAgICAgIHogPSB4eXoybGFiKCgwLjAxOTMzMzkgKiBiICsgMC4xMTkxOTIwICogYSArIDAuOTUwMzA0MSAqIGwpIC8gWm4pO1xuICByZXR1cm4gbmV3IExhYigxMTYgKiB5IC0gMTYsIDUwMCAqICh4IC0geSksIDIwMCAqICh5IC0geiksIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxhYihsLCBhLCBiLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gbGFiQ29udmVydChsKSA6IG5ldyBMYWIobCwgYSwgYiwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTGFiKGwsIGEsIGIsIG9wYWNpdHkpIHtcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMuYSA9ICthO1xuICB0aGlzLmIgPSArYjtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShMYWIsIGxhYiwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sICsgS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYiwgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYiwgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgeSA9ICh0aGlzLmwgKyAxNikgLyAxMTYsXG4gICAgICAgIHggPSBpc05hTih0aGlzLmEpID8geSA6IHkgKyB0aGlzLmEgLyA1MDAsXG4gICAgICAgIHogPSBpc05hTih0aGlzLmIpID8geSA6IHkgLSB0aGlzLmIgLyAyMDA7XG4gICAgeSA9IFluICogbGFiMnh5eih5KTtcbiAgICB4ID0gWG4gKiBsYWIyeHl6KHgpO1xuICAgIHogPSBabiAqIGxhYjJ4eXooeik7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICB4eXoycmdiKCAzLjI0MDQ1NDIgKiB4IC0gMS41MzcxMzg1ICogeSAtIDAuNDk4NTMxNCAqIHopLCAvLyBENjUgLT4gc1JHQlxuICAgICAgeHl6MnJnYigtMC45NjkyNjYwICogeCArIDEuODc2MDEwOCAqIHkgKyAwLjA0MTU1NjAgKiB6KSxcbiAgICAgIHh5ejJyZ2IoIDAuMDU1NjQzNCAqIHggLSAwLjIwNDAyNTkgKiB5ICsgMS4wNTcyMjUyICogeiksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9XG59KSk7XG5cbmZ1bmN0aW9uIHh5ejJsYWIodCkge1xuICByZXR1cm4gdCA+IHQzID8gTWF0aC5wb3codCwgMSAvIDMpIDogdCAvIHQyICsgdDA7XG59XG5cbmZ1bmN0aW9uIGxhYjJ4eXoodCkge1xuICByZXR1cm4gdCA+IHQxID8gdCAqIHQgKiB0IDogdDIgKiAodCAtIHQwKTtcbn1cblxuZnVuY3Rpb24geHl6MnJnYih4KSB7XG4gIHJldHVybiAyNTUgKiAoeCA8PSAwLjAwMzEzMDggPyAxMi45MiAqIHggOiAxLjA1NSAqIE1hdGgucG93KHgsIDEgLyAyLjQpIC0gMC4wNTUpO1xufVxuXG5mdW5jdGlvbiByZ2IyeHl6KHgpIHtcbiAgcmV0dXJuICh4IC89IDI1NSkgPD0gMC4wNDA0NSA/IHggLyAxMi45MiA6IE1hdGgucG93KCh4ICsgMC4wNTUpIC8gMS4wNTUsIDIuNCk7XG59XG5cbmZ1bmN0aW9uIGhjbENvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIEhjbCkgcmV0dXJuIG5ldyBIY2woby5oLCBvLmMsIG8ubCwgby5vcGFjaXR5KTtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIExhYikpIG8gPSBsYWJDb252ZXJ0KG8pO1xuICB2YXIgaCA9IE1hdGguYXRhbjIoby5iLCBvLmEpICogcmFkMmRlZztcbiAgcmV0dXJuIG5ldyBIY2woaCA8IDAgPyBoICsgMzYwIDogaCwgTWF0aC5zcXJ0KG8uYSAqIG8uYSArIG8uYiAqIG8uYiksIG8ubCwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhjbChoLCBjLCBsLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gaGNsQ29udmVydChoKSA6IG5ldyBIY2woaCwgYywgbCwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGNsKGgsIGMsIGwsIG9wYWNpdHkpIHtcbiAgdGhpcy5oID0gK2g7XG4gIHRoaXMuYyA9ICtjO1xuICB0aGlzLmwgPSArbDtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShIY2wsIGhjbCwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBIY2wodGhpcy5oLCB0aGlzLmMsIHRoaXMubCArIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBIY2wodGhpcy5oLCB0aGlzLmMsIHRoaXMubCAtIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbGFiQ29udmVydCh0aGlzKS5yZ2IoKTtcbiAgfVxufSkpO1xuIiwiaW1wb3J0IGRlZmluZSwge2V4dGVuZH0gZnJvbSBcIi4vZGVmaW5lXCI7XG5pbXBvcnQge0NvbG9yLCByZ2JDb252ZXJ0LCBSZ2IsIGRhcmtlciwgYnJpZ2h0ZXJ9IGZyb20gXCIuL2NvbG9yXCI7XG5pbXBvcnQge2RlZzJyYWQsIHJhZDJkZWd9IGZyb20gXCIuL21hdGhcIjtcblxudmFyIEEgPSAtMC4xNDg2MSxcbiAgICBCID0gKzEuNzgyNzcsXG4gICAgQyA9IC0wLjI5MjI3LFxuICAgIEQgPSAtMC45MDY0OSxcbiAgICBFID0gKzEuOTcyOTQsXG4gICAgRUQgPSBFICogRCxcbiAgICBFQiA9IEUgKiBCLFxuICAgIEJDX0RBID0gQiAqIEMgLSBEICogQTtcblxuZnVuY3Rpb24gY3ViZWhlbGl4Q29udmVydChvKSB7XG4gIGlmIChvIGluc3RhbmNlb2YgQ3ViZWhlbGl4KSByZXR1cm4gbmV3IEN1YmVoZWxpeChvLmgsIG8ucywgby5sLCBvLm9wYWNpdHkpO1xuICBpZiAoIShvIGluc3RhbmNlb2YgUmdiKSkgbyA9IHJnYkNvbnZlcnQobyk7XG4gIHZhciByID0gby5yIC8gMjU1LFxuICAgICAgZyA9IG8uZyAvIDI1NSxcbiAgICAgIGIgPSBvLmIgLyAyNTUsXG4gICAgICBsID0gKEJDX0RBICogYiArIEVEICogciAtIEVCICogZykgLyAoQkNfREEgKyBFRCAtIEVCKSxcbiAgICAgIGJsID0gYiAtIGwsXG4gICAgICBrID0gKEUgKiAoZyAtIGwpIC0gQyAqIGJsKSAvIEQsXG4gICAgICBzID0gTWF0aC5zcXJ0KGsgKiBrICsgYmwgKiBibCkgLyAoRSAqIGwgKiAoMSAtIGwpKSwgLy8gTmFOIGlmIGw9MCBvciBsPTFcbiAgICAgIGggPSBzID8gTWF0aC5hdGFuMihrLCBibCkgKiByYWQyZGVnIC0gMTIwIDogTmFOO1xuICByZXR1cm4gbmV3IEN1YmVoZWxpeChoIDwgMCA/IGggKyAzNjAgOiBoLCBzLCBsLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjdWJlaGVsaXgoaCwgcywgbCwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IGN1YmVoZWxpeENvbnZlcnQoaCkgOiBuZXcgQ3ViZWhlbGl4KGgsIHMsIGwsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEN1YmVoZWxpeChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHRoaXMuaCA9ICtoO1xuICB0aGlzLnMgPSArcztcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoQ3ViZWhlbGl4LCBjdWJlaGVsaXgsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEN1YmVoZWxpeCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSBpc05hTih0aGlzLmgpID8gMCA6ICh0aGlzLmggKyAxMjApICogZGVnMnJhZCxcbiAgICAgICAgbCA9ICt0aGlzLmwsXG4gICAgICAgIGEgPSBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyAqIGwgKiAoMSAtIGwpLFxuICAgICAgICBjb3NoID0gTWF0aC5jb3MoaCksXG4gICAgICAgIHNpbmggPSBNYXRoLnNpbihoKTtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIDI1NSAqIChsICsgYSAqIChBICogY29zaCArIEIgKiBzaW5oKSksXG4gICAgICAyNTUgKiAobCArIGEgKiAoQyAqIGNvc2ggKyBEICogc2luaCkpLFxuICAgICAgMjU1ICogKGwgKyBhICogKEUgKiBjb3NoKSksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9XG59KSk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsImltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudFwiO1xuXG5mdW5jdGlvbiBsaW5lYXIoYSwgZCkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICsgdCAqIGQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV4cG9uZW50aWFsKGEsIGIsIHkpIHtcbiAgcmV0dXJuIGEgPSBNYXRoLnBvdyhhLCB5KSwgYiA9IE1hdGgucG93KGIsIHkpIC0gYSwgeSA9IDEgLyB5LCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KGEgKyB0ICogYiwgeSk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodWUoYSwgYikge1xuICB2YXIgZCA9IGIgLSBhO1xuICByZXR1cm4gZCA/IGxpbmVhcihhLCBkID4gMTgwIHx8IGQgPCAtMTgwID8gZCAtIDM2MCAqIE1hdGgucm91bmQoZCAvIDM2MCkgOiBkKSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2FtbWEoeSkge1xuICByZXR1cm4gKHkgPSAreSkgPT09IDEgPyBub2dhbW1hIDogZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiIC0gYSA/IGV4cG9uZW50aWFsKGEsIGIsIHkpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vZ2FtbWEoYSwgYikge1xuICB2YXIgZCA9IGIgLSBhO1xuICByZXR1cm4gZCA/IGxpbmVhcihhLCBkKSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xufVxuIiwiaW1wb3J0IHtyZ2IgYXMgY29sb3JSZ2J9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IGJhc2lzIGZyb20gXCIuL2Jhc2lzXCI7XG5pbXBvcnQgYmFzaXNDbG9zZWQgZnJvbSBcIi4vYmFzaXNDbG9zZWRcIjtcbmltcG9ydCB7Z2FtbWF9IGZyb20gXCIuL2NvbG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiByZ2JHYW1tYSh5KSB7XG4gIHZhciBjb2xvciA9IGdhbW1hKHkpO1xuXG4gIGZ1bmN0aW9uIHJnYihzdGFydCwgZW5kKSB7XG4gICAgdmFyIHIgPSBjb2xvcigoc3RhcnQgPSBjb2xvclJnYihzdGFydCkpLnIsIChlbmQgPSBjb2xvclJnYihlbmQpKS5yKSxcbiAgICAgICAgZyA9IGNvbG9yKHN0YXJ0LmcsIGVuZC5nKSxcbiAgICAgICAgYiA9IGNvbG9yKHN0YXJ0LmIsIGVuZC5iKSxcbiAgICAgICAgb3BhY2l0eSA9IGNvbG9yKHN0YXJ0Lm9wYWNpdHksIGVuZC5vcGFjaXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgc3RhcnQuciA9IHIodCk7XG4gICAgICBzdGFydC5nID0gZyh0KTtcbiAgICAgIHN0YXJ0LmIgPSBiKHQpO1xuICAgICAgc3RhcnQub3BhY2l0eSA9IG9wYWNpdHkodCk7XG4gICAgICByZXR1cm4gc3RhcnQgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICByZ2IuZ2FtbWEgPSByZ2JHYW1tYTtcblxuICByZXR1cm4gcmdiO1xufSkoMSk7XG5cbmZ1bmN0aW9uIHJnYlNwbGluZShzcGxpbmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbG9ycykge1xuICAgIHZhciBuID0gY29sb3JzLmxlbmd0aCxcbiAgICAgICAgciA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgZyA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgYiA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgaSwgY29sb3I7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgY29sb3IgPSBjb2xvclJnYihjb2xvcnNbaV0pO1xuICAgICAgcltpXSA9IGNvbG9yLnIgfHwgMDtcbiAgICAgIGdbaV0gPSBjb2xvci5nIHx8IDA7XG4gICAgICBiW2ldID0gY29sb3IuYiB8fCAwO1xuICAgIH1cbiAgICByID0gc3BsaW5lKHIpO1xuICAgIGcgPSBzcGxpbmUoZyk7XG4gICAgYiA9IHNwbGluZShiKTtcbiAgICBjb2xvci5vcGFjaXR5ID0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgY29sb3IuciA9IHIodCk7XG4gICAgICBjb2xvci5nID0gZyh0KTtcbiAgICAgIGNvbG9yLmIgPSBiKHQpO1xuICAgICAgcmV0dXJuIGNvbG9yICsgXCJcIjtcbiAgICB9O1xuICB9O1xufVxuXG5leHBvcnQgdmFyIHJnYkJhc2lzID0gcmdiU3BsaW5lKGJhc2lzKTtcbmV4cG9ydCB2YXIgcmdiQmFzaXNDbG9zZWQgPSByZ2JTcGxpbmUoYmFzaXNDbG9zZWQpO1xuIiwiaW1wb3J0IHtjdWJlaGVsaXggYXMgY29sb3JDdWJlaGVsaXh9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IGNvbG9yLCB7aHVlfSBmcm9tIFwiLi9jb2xvclwiO1xuXG5mdW5jdGlvbiBjdWJlaGVsaXgoaHVlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gY3ViZWhlbGl4R2FtbWEoeSkge1xuICAgIHkgPSAreTtcblxuICAgIGZ1bmN0aW9uIGN1YmVoZWxpeChzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgaCA9IGh1ZSgoc3RhcnQgPSBjb2xvckN1YmVoZWxpeChzdGFydCkpLmgsIChlbmQgPSBjb2xvckN1YmVoZWxpeChlbmQpKS5oKSxcbiAgICAgICAgICBzID0gY29sb3Ioc3RhcnQucywgZW5kLnMpLFxuICAgICAgICAgIGwgPSBjb2xvcihzdGFydC5sLCBlbmQubCksXG4gICAgICAgICAgb3BhY2l0eSA9IGNvbG9yKHN0YXJ0Lm9wYWNpdHksIGVuZC5vcGFjaXR5KTtcbiAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHN0YXJ0LmggPSBoKHQpO1xuICAgICAgICBzdGFydC5zID0gcyh0KTtcbiAgICAgICAgc3RhcnQubCA9IGwoTWF0aC5wb3codCwgeSkpO1xuICAgICAgICBzdGFydC5vcGFjaXR5ID0gb3BhY2l0eSh0KTtcbiAgICAgICAgcmV0dXJuIHN0YXJ0ICsgXCJcIjtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY3ViZWhlbGl4LmdhbW1hID0gY3ViZWhlbGl4R2FtbWE7XG5cbiAgICByZXR1cm4gY3ViZWhlbGl4O1xuICB9KSgxKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3ViZWhlbGl4KGh1ZSk7XG5leHBvcnQgdmFyIGN1YmVoZWxpeExvbmcgPSBjdWJlaGVsaXgoY29sb3IpO1xuIiwidmFyIGV4cG9uZW50ID0gMztcblxuZXhwb3J0IHZhciBwb2x5SW4gPSAoZnVuY3Rpb24gY3VzdG9tKGUpIHtcbiAgZSA9ICtlO1xuXG4gIGZ1bmN0aW9uIHBvbHlJbih0KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KHQsIGUpO1xuICB9XG5cbiAgcG9seUluLmV4cG9uZW50ID0gY3VzdG9tO1xuXG4gIHJldHVybiBwb2x5SW47XG59KShleHBvbmVudCk7XG5cbmV4cG9ydCB2YXIgcG9seU91dCA9IChmdW5jdGlvbiBjdXN0b20oZSkge1xuICBlID0gK2U7XG5cbiAgZnVuY3Rpb24gcG9seU91dCh0KSB7XG4gICAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0gdCwgZSk7XG4gIH1cblxuICBwb2x5T3V0LmV4cG9uZW50ID0gY3VzdG9tO1xuXG4gIHJldHVybiBwb2x5T3V0O1xufSkoZXhwb25lbnQpO1xuXG5leHBvcnQgdmFyIHBvbHlJbk91dCA9IChmdW5jdGlvbiBjdXN0b20oZSkge1xuICBlID0gK2U7XG5cbiAgZnVuY3Rpb24gcG9seUluT3V0KHQpIHtcbiAgICByZXR1cm4gKCh0ICo9IDIpIDw9IDEgPyBNYXRoLnBvdyh0LCBlKSA6IDIgLSBNYXRoLnBvdygyIC0gdCwgZSkpIC8gMjtcbiAgfVxuXG4gIHBvbHlJbk91dC5leHBvbmVudCA9IGN1c3RvbTtcblxuICByZXR1cm4gcG9seUluT3V0O1xufSkoZXhwb25lbnQpO1xuIiwidmFyIG92ZXJzaG9vdCA9IDEuNzAxNTg7XG5cbmV4cG9ydCB2YXIgYmFja0luID0gKGZ1bmN0aW9uIGN1c3RvbShzKSB7XG4gIHMgPSArcztcblxuICBmdW5jdGlvbiBiYWNrSW4odCkge1xuICAgIHJldHVybiB0ICogdCAqICgocyArIDEpICogdCAtIHMpO1xuICB9XG5cbiAgYmFja0luLm92ZXJzaG9vdCA9IGN1c3RvbTtcblxuICByZXR1cm4gYmFja0luO1xufSkob3ZlcnNob290KTtcblxuZXhwb3J0IHZhciBiYWNrT3V0ID0gKGZ1bmN0aW9uIGN1c3RvbShzKSB7XG4gIHMgPSArcztcblxuICBmdW5jdGlvbiBiYWNrT3V0KHQpIHtcbiAgICByZXR1cm4gLS10ICogdCAqICgocyArIDEpICogdCArIHMpICsgMTtcbiAgfVxuXG4gIGJhY2tPdXQub3ZlcnNob290ID0gY3VzdG9tO1xuXG4gIHJldHVybiBiYWNrT3V0O1xufSkob3ZlcnNob290KTtcblxuZXhwb3J0IHZhciBiYWNrSW5PdXQgPSAoZnVuY3Rpb24gY3VzdG9tKHMpIHtcbiAgcyA9ICtzO1xuXG4gIGZ1bmN0aW9uIGJhY2tJbk91dCh0KSB7XG4gICAgcmV0dXJuICgodCAqPSAyKSA8IDEgPyB0ICogdCAqICgocyArIDEpICogdCAtIHMpIDogKHQgLT0gMikgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAyKSAvIDI7XG4gIH1cblxuICBiYWNrSW5PdXQub3ZlcnNob290ID0gY3VzdG9tO1xuXG4gIHJldHVybiBiYWNrSW5PdXQ7XG59KShvdmVyc2hvb3QpO1xuIiwidmFyIHRhdSA9IDIgKiBNYXRoLlBJLFxuICAgIGFtcGxpdHVkZSA9IDEsXG4gICAgcGVyaW9kID0gMC4zO1xuXG5leHBvcnQgdmFyIGVsYXN0aWNJbiA9IChmdW5jdGlvbiBjdXN0b20oYSwgcCkge1xuICB2YXIgcyA9IE1hdGguYXNpbigxIC8gKGEgPSBNYXRoLm1heCgxLCBhKSkpICogKHAgLz0gdGF1KTtcblxuICBmdW5jdGlvbiBlbGFzdGljSW4odCkge1xuICAgIHJldHVybiBhICogTWF0aC5wb3coMiwgMTAgKiAtLXQpICogTWF0aC5zaW4oKHMgLSB0KSAvIHApO1xuICB9XG5cbiAgZWxhc3RpY0luLmFtcGxpdHVkZSA9IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGN1c3RvbShhLCBwICogdGF1KTsgfTtcbiAgZWxhc3RpY0luLnBlcmlvZCA9IGZ1bmN0aW9uKHApIHsgcmV0dXJuIGN1c3RvbShhLCBwKTsgfTtcblxuICByZXR1cm4gZWxhc3RpY0luO1xufSkoYW1wbGl0dWRlLCBwZXJpb2QpO1xuXG5leHBvcnQgdmFyIGVsYXN0aWNPdXQgPSAoZnVuY3Rpb24gY3VzdG9tKGEsIHApIHtcbiAgdmFyIHMgPSBNYXRoLmFzaW4oMSAvIChhID0gTWF0aC5tYXgoMSwgYSkpKSAqIChwIC89IHRhdSk7XG5cbiAgZnVuY3Rpb24gZWxhc3RpY091dCh0KSB7XG4gICAgcmV0dXJuIDEgLSBhICogTWF0aC5wb3coMiwgLTEwICogKHQgPSArdCkpICogTWF0aC5zaW4oKHQgKyBzKSAvIHApO1xuICB9XG5cbiAgZWxhc3RpY091dC5hbXBsaXR1ZGUgPSBmdW5jdGlvbihhKSB7IHJldHVybiBjdXN0b20oYSwgcCAqIHRhdSk7IH07XG4gIGVsYXN0aWNPdXQucGVyaW9kID0gZnVuY3Rpb24ocCkgeyByZXR1cm4gY3VzdG9tKGEsIHApOyB9O1xuXG4gIHJldHVybiBlbGFzdGljT3V0O1xufSkoYW1wbGl0dWRlLCBwZXJpb2QpO1xuXG5leHBvcnQgdmFyIGVsYXN0aWNJbk91dCA9IChmdW5jdGlvbiBjdXN0b20oYSwgcCkge1xuICB2YXIgcyA9IE1hdGguYXNpbigxIC8gKGEgPSBNYXRoLm1heCgxLCBhKSkpICogKHAgLz0gdGF1KTtcblxuICBmdW5jdGlvbiBlbGFzdGljSW5PdXQodCkge1xuICAgIHJldHVybiAoKHQgPSB0ICogMiAtIDEpIDwgMFxuICAgICAgICA/IGEgKiBNYXRoLnBvdygyLCAxMCAqIHQpICogTWF0aC5zaW4oKHMgLSB0KSAvIHApXG4gICAgICAgIDogMiAtIGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKChzICsgdCkgLyBwKSkgLyAyO1xuICB9XG5cbiAgZWxhc3RpY0luT3V0LmFtcGxpdHVkZSA9IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGN1c3RvbShhLCBwICogdGF1KTsgfTtcbiAgZWxhc3RpY0luT3V0LnBlcmlvZCA9IGZ1bmN0aW9uKHApIHsgcmV0dXJuIGN1c3RvbShhLCBwKTsgfTtcblxuICByZXR1cm4gZWxhc3RpY0luT3V0O1xufSkoYW1wbGl0dWRlLCBwZXJpb2QpO1xuIiwiZXhwb3J0IHZhciB4aHRtbCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogeGh0bWwsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuIiwiaW1wb3J0IG5hbWVzcGFjZXMgZnJvbSBcIi4vbmFtZXNwYWNlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBwcmVmaXggPSBuYW1lICs9IFwiXCIsIGkgPSBwcmVmaXguaW5kZXhPZihcIjpcIik7XG4gIGlmIChpID49IDAgJiYgKHByZWZpeCA9IG5hbWUuc2xpY2UoMCwgaSkpICE9PSBcInhtbG5zXCIpIG5hbWUgPSBuYW1lLnNsaWNlKGkgKyAxKTtcbiAgcmV0dXJuIG5hbWVzcGFjZXMuaGFzT3duUHJvcGVydHkocHJlZml4KSA/IHtzcGFjZTogbmFtZXNwYWNlc1twcmVmaXhdLCBsb2NhbDogbmFtZX0gOiBuYW1lO1xufVxuIiwiaW1wb3J0IG5hbWVzcGFjZSBmcm9tIFwiLi9uYW1lc3BhY2VcIjtcbmltcG9ydCB7eGh0bWx9IGZyb20gXCIuL25hbWVzcGFjZXNcIjtcblxuZnVuY3Rpb24gY3JlYXRvckluaGVyaXQobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50LFxuICAgICAgICB1cmkgPSB0aGlzLm5hbWVzcGFjZVVSSTtcbiAgICByZXR1cm4gdXJpID09PSB4aHRtbCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubmFtZXNwYWNlVVJJID09PSB4aHRtbFxuICAgICAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModXJpLCBuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRvckZpeGVkKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcbiAgcmV0dXJuIChmdWxsbmFtZS5sb2NhbFxuICAgICAgPyBjcmVhdG9yRml4ZWRcbiAgICAgIDogY3JlYXRvckluaGVyaXQpKGZ1bGxuYW1lKTtcbn1cbiIsInZhciBuZXh0SWQgPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2NhbCgpIHtcbiAgcmV0dXJuIG5ldyBMb2NhbDtcbn1cblxuZnVuY3Rpb24gTG9jYWwoKSB7XG4gIHRoaXMuXyA9IFwiQFwiICsgKCsrbmV4dElkKS50b1N0cmluZygzNik7XG59XG5cbkxvY2FsLnByb3RvdHlwZSA9IGxvY2FsLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IExvY2FsLFxuICBnZXQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIgaWQgPSB0aGlzLl87XG4gICAgd2hpbGUgKCEoaWQgaW4gbm9kZSkpIGlmICghKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpKSByZXR1cm47XG4gICAgcmV0dXJuIG5vZGVbaWRdO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgcmV0dXJuIG5vZGVbdGhpcy5fXSA9IHZhbHVlO1xuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5fIGluIG5vZGUgJiYgZGVsZXRlIG5vZGVbdGhpcy5fXTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl87XG4gIH1cbn07XG4iLCJ2YXIgbWF0Y2hlciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn07XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGlmICghZWxlbWVudC5tYXRjaGVzKSB7XG4gICAgdmFyIHZlbmRvck1hdGNoZXMgPSBlbGVtZW50LndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICAgICAgICB8fCBlbGVtZW50Lm1zTWF0Y2hlc1NlbGVjdG9yXG4gICAgICAgIHx8IGVsZW1lbnQubW96TWF0Y2hlc1NlbGVjdG9yXG4gICAgICAgIHx8IGVsZW1lbnQub01hdGNoZXNTZWxlY3RvcjtcbiAgICBtYXRjaGVyID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZlbmRvck1hdGNoZXMuY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbWF0Y2hlcjtcbiIsInZhciBmaWx0ZXJFdmVudHMgPSB7fTtcblxuZXhwb3J0IHZhciBldmVudCA9IG51bGw7XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGlmICghKFwib25tb3VzZWVudGVyXCIgaW4gZWxlbWVudCkpIHtcbiAgICBmaWx0ZXJFdmVudHMgPSB7bW91c2VlbnRlcjogXCJtb3VzZW92ZXJcIiwgbW91c2VsZWF2ZTogXCJtb3VzZW91dFwifTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJDb250ZXh0TGlzdGVuZXIobGlzdGVuZXIsIGluZGV4LCBncm91cCkge1xuICBsaXN0ZW5lciA9IGNvbnRleHRMaXN0ZW5lcihsaXN0ZW5lciwgaW5kZXgsIGdyb3VwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHJlbGF0ZWQgPSBldmVudC5yZWxhdGVkVGFyZ2V0O1xuICAgIGlmICghcmVsYXRlZCB8fCAocmVsYXRlZCAhPT0gdGhpcyAmJiAhKHJlbGF0ZWQuY29tcGFyZURvY3VtZW50UG9zaXRpb24odGhpcykgJiA4KSkpIHtcbiAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udGV4dExpc3RlbmVyKGxpc3RlbmVyLCBpbmRleCwgZ3JvdXApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50MSkge1xuICAgIHZhciBldmVudDAgPSBldmVudDsgLy8gRXZlbnRzIGNhbiBiZSByZWVudHJhbnQgKGUuZy4sIGZvY3VzKS5cbiAgICBldmVudCA9IGV2ZW50MTtcbiAgICB0cnkge1xuICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCB0aGlzLl9fZGF0YV9fLCBpbmRleCwgZ3JvdXApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBldmVudCA9IGV2ZW50MDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lcykge1xuICByZXR1cm4gdHlwZW5hbWVzLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgbmFtZSA9IFwiXCIsIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIG5hbWUgPSB0LnNsaWNlKGkgKyAxKSwgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgcmV0dXJuIHt0eXBlOiB0LCBuYW1lOiBuYW1lfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uUmVtb3ZlKHR5cGVuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb247XG4gICAgaWYgKCFvbikgcmV0dXJuO1xuICAgIGZvciAodmFyIGogPSAwLCBpID0gLTEsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGlmIChvID0gb25bal0sICghdHlwZW5hbWUudHlwZSB8fCBvLnR5cGUgPT09IHR5cGVuYW1lLnR5cGUpICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLmNhcHR1cmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25bKytpXSA9IG87XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgrK2kpIG9uLmxlbmd0aCA9IGk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fX29uO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbkFkZCh0eXBlbmFtZSwgdmFsdWUsIGNhcHR1cmUpIHtcbiAgdmFyIHdyYXAgPSBmaWx0ZXJFdmVudHMuaGFzT3duUHJvcGVydHkodHlwZW5hbWUudHlwZSkgPyBmaWx0ZXJDb250ZXh0TGlzdGVuZXIgOiBjb250ZXh0TGlzdGVuZXI7XG4gIHJldHVybiBmdW5jdGlvbihkLCBpLCBncm91cCkge1xuICAgIHZhciBvbiA9IHRoaXMuX19vbiwgbywgbGlzdGVuZXIgPSB3cmFwKHZhbHVlLCBpLCBncm91cCk7XG4gICAgaWYgKG9uKSBmb3IgKHZhciBqID0gMCwgbSA9IG9uLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgICAgaWYgKChvID0gb25bal0pLnR5cGUgPT09IHR5cGVuYW1lLnR5cGUgJiYgby5uYW1lID09PSB0eXBlbmFtZS5uYW1lKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIsIG8uY2FwdHVyZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIgPSBsaXN0ZW5lciwgby5jYXB0dXJlID0gY2FwdHVyZSk7XG4gICAgICAgIG8udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodHlwZW5hbWUudHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpO1xuICAgIG8gPSB7dHlwZTogdHlwZW5hbWUudHlwZSwgbmFtZTogdHlwZW5hbWUubmFtZSwgdmFsdWU6IHZhbHVlLCBsaXN0ZW5lcjogbGlzdGVuZXIsIGNhcHR1cmU6IGNhcHR1cmV9O1xuICAgIGlmICghb24pIHRoaXMuX19vbiA9IFtvXTtcbiAgICBlbHNlIG9uLnB1c2gobyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHR5cGVuYW1lLCB2YWx1ZSwgY2FwdHVyZSkge1xuICB2YXIgdHlwZW5hbWVzID0gcGFyc2VUeXBlbmFtZXModHlwZW5hbWUgKyBcIlwiKSwgaSwgbiA9IHR5cGVuYW1lcy5sZW5ndGgsIHQ7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG9uID0gdGhpcy5ub2RlKCkuX19vbjtcbiAgICBpZiAob24pIGZvciAodmFyIGogPSAwLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBmb3IgKGkgPSAwLCBvID0gb25bal07IGkgPCBuOyArK2kpIHtcbiAgICAgICAgaWYgKCh0ID0gdHlwZW5hbWVzW2ldKS50eXBlID09PSBvLnR5cGUgJiYgdC5uYW1lID09PSBvLm5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gby52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBvbiA9IHZhbHVlID8gb25BZGQgOiBvblJlbW92ZTtcbiAgaWYgKGNhcHR1cmUgPT0gbnVsbCkgY2FwdHVyZSA9IGZhbHNlO1xuICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB0aGlzLmVhY2gob24odHlwZW5hbWVzW2ldLCB2YWx1ZSwgY2FwdHVyZSkpO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbUV2ZW50KGV2ZW50MSwgbGlzdGVuZXIsIHRoYXQsIGFyZ3MpIHtcbiAgdmFyIGV2ZW50MCA9IGV2ZW50O1xuICBldmVudDEuc291cmNlRXZlbnQgPSBldmVudDtcbiAgZXZlbnQgPSBldmVudDE7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9IGZpbmFsbHkge1xuICAgIGV2ZW50ID0gZXZlbnQwO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIH07XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCBzZWxlY3RvciBmcm9tIFwiLi4vc2VsZWN0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IHNlbGVjdG9yKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgc3Vibm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAoc3Vibm9kZSA9IHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkpIHtcbiAgICAgICAgaWYgKFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgICAgc3ViZ3JvdXBbaV0gPSBzdWJub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIH07XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCBzZWxlY3RvckFsbCBmcm9tIFwiLi4vc2VsZWN0b3JBbGxcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IHNlbGVjdG9yQWxsKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gW10sIHBhcmVudHMgPSBbXSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXBzLnB1c2goc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKTtcbiAgICAgICAgcGFyZW50cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgcGFyZW50cyk7XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCBtYXRjaGVyIGZyb20gXCIuLi9tYXRjaGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIGlmICh0eXBlb2YgbWF0Y2ggIT09IFwiZnVuY3Rpb25cIikgbWF0Y2ggPSBtYXRjaGVyKG1hdGNoKTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gW10sIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgbWF0Y2guY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi4vY29uc3RhbnRcIjtcblxudmFyIGtleVByZWZpeCA9IFwiJFwiOyAvLyBQcm90ZWN0IGFnYWluc3Qga2V5cyBsaWtlIOKAnF9fcHJvdG9fX+KAnS5cblxuZnVuY3Rpb24gYmluZEluZGV4KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEpIHtcbiAgdmFyIGkgPSAwLFxuICAgICAgbm9kZSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBmaXQgaW50byB1cGRhdGUuXG4gIC8vIFB1dCBhbnkgbnVsbCBub2RlcyBpbnRvIGVudGVyLlxuICAvLyBQdXQgYW55IHJlbWFpbmluZyBkYXRhIGludG8gZW50ZXIuXG4gIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZG9u4oCZdCBmaXQgaW50byBleGl0LlxuICBmb3IgKDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmluZEtleShwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhLCBrZXkpIHtcbiAgdmFyIGksXG4gICAgICBub2RlLFxuICAgICAgbm9kZUJ5S2V5VmFsdWUgPSB7fSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAga2V5VmFsdWVzID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKSxcbiAgICAgIGtleVZhbHVlO1xuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBub2RlLlxuICAvLyBJZiBtdWx0aXBsZSBub2RlcyBoYXZlIHRoZSBzYW1lIGtleSwgdGhlIGR1cGxpY2F0ZXMgYXJlIGFkZGVkIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAga2V5VmFsdWVzW2ldID0ga2V5VmFsdWUgPSBrZXlQcmVmaXggKyBrZXkuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCk7XG4gICAgICBpZiAoa2V5VmFsdWUgaW4gbm9kZUJ5S2V5VmFsdWUpIHtcbiAgICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlQnlLZXlWYWx1ZVtrZXlWYWx1ZV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBkYXR1bS5cbiAgLy8gSWYgdGhlcmUgYSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleSwgam9pbiBhbmQgYWRkIGl0IHRvIHVwZGF0ZS5cbiAgLy8gSWYgdGhlcmUgaXMgbm90IChvciB0aGUga2V5IGlzIGEgZHVwbGljYXRlKSwgYWRkIGl0IHRvIGVudGVyLlxuICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAga2V5VmFsdWUgPSBrZXlQcmVmaXggKyBrZXkuY2FsbChwYXJlbnQsIGRhdGFbaV0sIGksIGRhdGEpO1xuICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWVba2V5VmFsdWVdKSB7XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICBub2RlQnlLZXlWYWx1ZVtrZXlWYWx1ZV0gPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgYW55IHJlbWFpbmluZyBub2RlcyB0aGF0IHdlcmUgbm90IGJvdW5kIHRvIGRhdGEgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKG5vZGVCeUtleVZhbHVlW2tleVZhbHVlc1tpXV0gPT09IG5vZGUpKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgZGF0YSA9IG5ldyBBcnJheSh0aGlzLnNpemUoKSksIGogPSAtMTtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oZCkgeyBkYXRhWysral0gPSBkOyB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHZhciBiaW5kID0ga2V5ID8gYmluZEtleSA6IGJpbmRJbmRleCxcbiAgICAgIHBhcmVudHMgPSB0aGlzLl9wYXJlbnRzLFxuICAgICAgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdmFsdWUgPSBjb25zdGFudCh2YWx1ZSk7XG5cbiAgZm9yICh2YXIgbSA9IGdyb3Vwcy5sZW5ndGgsIHVwZGF0ZSA9IG5ldyBBcnJheShtKSwgZW50ZXIgPSBuZXcgQXJyYXkobSksIGV4aXQgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudHNbal0sXG4gICAgICAgIGdyb3VwID0gZ3JvdXBzW2pdLFxuICAgICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgZGF0YSA9IHZhbHVlLmNhbGwocGFyZW50LCBwYXJlbnQgJiYgcGFyZW50Ll9fZGF0YV9fLCBqLCBwYXJlbnRzKSxcbiAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgICBlbnRlckdyb3VwID0gZW50ZXJbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIHVwZGF0ZUdyb3VwID0gdXBkYXRlW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICBleGl0R3JvdXAgPSBleGl0W2pdID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKTtcblxuICAgIGJpbmQocGFyZW50LCBncm91cCwgZW50ZXJHcm91cCwgdXBkYXRlR3JvdXAsIGV4aXRHcm91cCwgZGF0YSwga2V5KTtcblxuICAgIC8vIE5vdyBjb25uZWN0IHRoZSBlbnRlciBub2RlcyB0byB0aGVpciBmb2xsb3dpbmcgdXBkYXRlIG5vZGUsIHN1Y2ggdGhhdFxuICAgIC8vIGFwcGVuZENoaWxkIGNhbiBpbnNlcnQgdGhlIG1hdGVyaWFsaXplZCBlbnRlciBub2RlIGJlZm9yZSB0aGlzIG5vZGUsXG4gICAgLy8gcmF0aGVyIHRoYW4gYXQgdGhlIGVuZCBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgZm9yICh2YXIgaTAgPSAwLCBpMSA9IDAsIHByZXZpb3VzLCBuZXh0OyBpMCA8IGRhdGFMZW5ndGg7ICsraTApIHtcbiAgICAgIGlmIChwcmV2aW91cyA9IGVudGVyR3JvdXBbaTBdKSB7XG4gICAgICAgIGlmIChpMCA+PSBpMSkgaTEgPSBpMCArIDE7XG4gICAgICAgIHdoaWxlICghKG5leHQgPSB1cGRhdGVHcm91cFtpMV0pICYmICsraTEgPCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgcHJldmlvdXMuX25leHQgPSBuZXh0IHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlID0gbmV3IFNlbGVjdGlvbih1cGRhdGUsIHBhcmVudHMpO1xuICB1cGRhdGUuX2VudGVyID0gZW50ZXI7XG4gIHVwZGF0ZS5fZXhpdCA9IGV4aXQ7XG4gIHJldHVybiB1cGRhdGU7XG59XG5cbmZ1bmN0aW9uIEVudGVyTm9kZShwYXJlbnQsIGRhdHVtKSB7XG4gIHRoaXMub3duZXJEb2N1bWVudCA9IHBhcmVudC5vd25lckRvY3VtZW50O1xuICB0aGlzLm5hbWVzcGFjZVVSSSA9IHBhcmVudC5uYW1lc3BhY2VVUkk7XG4gIHRoaXMuX25leHQgPSBudWxsO1xuICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuX19kYXRhX18gPSBkYXR1bTtcbn1cblxuRW50ZXJOb2RlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEVudGVyTm9kZSxcbiAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKGNoaWxkKSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCB0aGlzLl9uZXh0KTsgfSxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihjaGlsZCwgbmV4dCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgbmV4dCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7IH1cbn07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cGRhdGUpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh1cGRhdGUubGVuZ3RoKTtcbn1cbiIsImltcG9ydCBzcGFyc2UgZnJvbSBcIi4vc3BhcnNlXCI7XG5pbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2VudGVyIHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG4iLCJpbXBvcnQgc3BhcnNlIGZyb20gXCIuL3NwYXJzZVwiO1xuaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9leGl0IHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0aW9uKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzMCA9IHRoaXMuX2dyb3VwcywgZ3JvdXBzMSA9IHNlbGVjdGlvbi5fZ3JvdXBzLCBtMCA9IGdyb3VwczAubGVuZ3RoLCBtMSA9IGdyb3VwczEubGVuZ3RoLCBtID0gTWF0aC5taW4obTAsIG0xKSwgbWVyZ2VzID0gbmV3IEFycmF5KG0wKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cDAgPSBncm91cHMwW2pdLCBncm91cDEgPSBncm91cHMxW2pdLCBuID0gZ3JvdXAwLmxlbmd0aCwgbWVyZ2UgPSBtZXJnZXNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwMFtpXSB8fCBncm91cDFbaV0pIHtcbiAgICAgICAgbWVyZ2VbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBqIDwgbTA7ICsraikge1xuICAgIG1lcmdlc1tqXSA9IGdyb3VwczBbal07XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihtZXJnZXMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gLTEsIG0gPSBncm91cHMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gZ3JvdXAubGVuZ3RoIC0gMSwgbmV4dCA9IGdyb3VwW2ldLCBub2RlOyAtLWkgPj0gMDspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgaWYgKG5leHQgJiYgbmV4dCAhPT0gbm9kZS5uZXh0U2libGluZykgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29tcGFyZSkge1xuICBpZiAoIWNvbXBhcmUpIGNvbXBhcmUgPSBhc2NlbmRpbmc7XG5cbiAgZnVuY3Rpb24gY29tcGFyZU5vZGUoYSwgYikge1xuICAgIHJldHVybiBhICYmIGIgPyBjb21wYXJlKGEuX19kYXRhX18sIGIuX19kYXRhX18pIDogIWEgLSAhYjtcbiAgfVxuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHNvcnRncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHNvcnRncm91cCA9IHNvcnRncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHNvcnRncm91cFtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvcnRncm91cC5zb3J0KGNvbXBhcmVOb2RlKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHNvcnRncm91cHMsIHRoaXMuX3BhcmVudHMpLm9yZGVyKCk7XG59XG5cbmZ1bmN0aW9uIGFzY2VuZGluZyhhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMF07XG4gIGFyZ3VtZW50c1swXSA9IHRoaXM7XG4gIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBub2RlcyA9IG5ldyBBcnJheSh0aGlzLnNpemUoKSksIGkgPSAtMTtcbiAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyBub2Rlc1srK2ldID0gdGhpczsgfSk7XG4gIHJldHVybiBub2Rlcztcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICB2YXIgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgaWYgKG5vZGUpIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBzaXplID0gMDtcbiAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyArK3NpemU7IH0pO1xuICByZXR1cm4gc2l6ZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMubm9kZSgpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2spIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgY2FsbGJhY2suY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuLi9uYW1lc3BhY2VcIjtcblxuZnVuY3Rpb24gYXR0clJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0clJlbW92ZU5TKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudChuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnROUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCB2KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgcmV0dXJuIGZ1bGxuYW1lLmxvY2FsXG4gICAgICAgID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpXG4gICAgICAgIDogbm9kZS5nZXRBdHRyaWJ1dGUoZnVsbG5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyUmVtb3ZlTlMgOiBhdHRyUmVtb3ZlKSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyRnVuY3Rpb25OUyA6IGF0dHJGdW5jdGlvbilcbiAgICAgIDogKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQpKSkoZnVsbG5hbWUsIHZhbHVlKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihub2RlKSB7XG4gIHJldHVybiAobm9kZS5vd25lckRvY3VtZW50ICYmIG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldykgLy8gbm9kZSBpcyBhIE5vZGVcbiAgICAgIHx8IChub2RlLmRvY3VtZW50ICYmIG5vZGUpIC8vIG5vZGUgaXMgYSBXaW5kb3dcbiAgICAgIHx8IG5vZGUuZGVmYXVsdFZpZXc7IC8vIG5vZGUgaXMgYSBEb2N1bWVudFxufVxuIiwiaW1wb3J0IGRlZmF1bHRWaWV3IGZyb20gXCIuLi93aW5kb3dcIjtcblxuZnVuY3Rpb24gc3R5bGVSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVDb25zdGFudChuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVGdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2LCBwcmlvcml0eSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICB2YXIgbm9kZTtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICA/IHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyBzdHlsZVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IHN0eWxlRnVuY3Rpb25cbiAgICAgICAgICAgIDogc3R5bGVDb25zdGFudCkobmFtZSwgdmFsdWUsIHByaW9yaXR5ID09IG51bGwgPyBcIlwiIDogcHJpb3JpdHkpKVxuICAgICAgOiBkZWZhdWx0Vmlldyhub2RlID0gdGhpcy5ub2RlKCkpXG4gICAgICAgICAgLmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbClcbiAgICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcbn1cbiIsImZ1bmN0aW9uIHByb3BlcnR5UmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5RnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICBlbHNlIHRoaXNbbmFtZV0gPSB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBwcm9wZXJ0eVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uXG4gICAgICAgICAgOiBwcm9wZXJ0eUNvbnN0YW50KShuYW1lLCB2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpW25hbWVdO1xufVxuIiwiZnVuY3Rpb24gY2xhc3NBcnJheShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy50cmltKCkuc3BsaXQoL158XFxzKy8pO1xufVxuXG5mdW5jdGlvbiBjbGFzc0xpc3Qobm9kZSkge1xuICByZXR1cm4gbm9kZS5jbGFzc0xpc3QgfHwgbmV3IENsYXNzTGlzdChub2RlKTtcbn1cblxuZnVuY3Rpb24gQ2xhc3NMaXN0KG5vZGUpIHtcbiAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gIHRoaXMuX25hbWVzID0gY2xhc3NBcnJheShub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpO1xufVxuXG5DbGFzc0xpc3QucHJvdG90eXBlID0ge1xuICBhZGQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgdGhpcy5fbmFtZXMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICBjb250YWluczogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpID49IDA7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNsYXNzZWRBZGQobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QuYWRkKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFJlbW92ZShub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5yZW1vdmUobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkVHJ1ZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZEFkZCh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGYWxzZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZFJlbW92ZSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGdW5jdGlvbihuYW1lcywgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICh2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpID8gY2xhc3NlZEFkZCA6IGNsYXNzZWRSZW1vdmUpKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIG5hbWVzID0gY2xhc3NBcnJheShuYW1lICsgXCJcIik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIGxpc3QgPSBjbGFzc0xpc3QodGhpcy5ub2RlKCkpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICghbGlzdC5jb250YWlucyhuYW1lc1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvbiA6IHZhbHVlXG4gICAgICA/IGNsYXNzZWRUcnVlXG4gICAgICA6IGNsYXNzZWRGYWxzZSkobmFtZXMsIHZhbHVlKSk7XG59XG4iLCJmdW5jdGlvbiB0ZXh0UmVtb3ZlKCkge1xuICB0aGlzLnRleHRDb250ZW50ID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gdGV4dENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHRleHRSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHRleHRGdW5jdGlvblxuICAgICAgICAgIDogdGV4dENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufVxuIiwiZnVuY3Rpb24gaHRtbFJlbW92ZSgpIHtcbiAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiBodG1sQ29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWxGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBodG1sUmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBodG1sRnVuY3Rpb25cbiAgICAgICAgICA6IGh0bWxDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG59XG4iLCJmdW5jdGlvbiByYWlzZSgpIHtcbiAgaWYgKHRoaXMubmV4dFNpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmFpc2UpO1xufVxuIiwiZnVuY3Rpb24gbG93ZXIoKSB7XG4gIGlmICh0aGlzLnByZXZpb3VzU2libGluZykgdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLCB0aGlzLnBhcmVudE5vZGUuZmlyc3RDaGlsZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKGxvd2VyKTtcbn1cbiIsImltcG9ydCBjcmVhdG9yIGZyb20gXCIuLi9jcmVhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFwcGVuZENoaWxkKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgY3JlYXRvciBmcm9tIFwiLi4vY3JlYXRvclwiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3RvclwiO1xuXG5mdW5jdGlvbiBjb25zdGFudE51bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKSxcbiAgICAgIHNlbGVjdCA9IGJlZm9yZSA9PSBudWxsID8gY29uc3RhbnROdWxsIDogdHlwZW9mIGJlZm9yZSA9PT0gXCJmdW5jdGlvblwiID8gYmVmb3JlIDogc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gIH0pO1xufVxuIiwiZnVuY3Rpb24gcmVtb3ZlKCkge1xuICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKHJlbW92ZSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMubm9kZSgpLl9fZGF0YV9fO1xufVxuIiwiaW1wb3J0IGRlZmF1bHRWaWV3IGZyb20gXCIuLi93aW5kb3dcIjtcblxuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChub2RlLCB0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIHdpbmRvdyA9IGRlZmF1bHRWaWV3KG5vZGUpLFxuICAgICAgZXZlbnQgPSB3aW5kb3cuQ3VzdG9tRXZlbnQ7XG5cbiAgaWYgKGV2ZW50KSB7XG4gICAgZXZlbnQgPSBuZXcgZXZlbnQodHlwZSwgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgIGlmIChwYXJhbXMpIGV2ZW50LmluaXRFdmVudCh0eXBlLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpLCBldmVudC5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICAgIGVsc2UgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaENvbnN0YW50KHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hGdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiBwYXJhbXMgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBkaXNwYXRjaEZ1bmN0aW9uXG4gICAgICA6IGRpc3BhdGNoQ29uc3RhbnQpKHR5cGUsIHBhcmFtcykpO1xufVxuIiwiaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3QgZnJvbSBcIi4vc2VsZWN0XCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdEFsbCBmcm9tIFwiLi9zZWxlY3RBbGxcIjtcbmltcG9ydCBzZWxlY3Rpb25fZmlsdGVyIGZyb20gXCIuL2ZpbHRlclwiO1xuaW1wb3J0IHNlbGVjdGlvbl9kYXRhIGZyb20gXCIuL2RhdGFcIjtcbmltcG9ydCBzZWxlY3Rpb25fZW50ZXIgZnJvbSBcIi4vZW50ZXJcIjtcbmltcG9ydCBzZWxlY3Rpb25fZXhpdCBmcm9tIFwiLi9leGl0XCI7XG5pbXBvcnQgc2VsZWN0aW9uX21lcmdlIGZyb20gXCIuL21lcmdlXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29yZGVyIGZyb20gXCIuL29yZGVyXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NvcnQgZnJvbSBcIi4vc29ydFwiO1xuaW1wb3J0IHNlbGVjdGlvbl9jYWxsIGZyb20gXCIuL2NhbGxcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZXMgZnJvbSBcIi4vbm9kZXNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZSBmcm9tIFwiLi9ub2RlXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NpemUgZnJvbSBcIi4vc2l6ZVwiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbXB0eSBmcm9tIFwiLi9lbXB0eVwiO1xuaW1wb3J0IHNlbGVjdGlvbl9lYWNoIGZyb20gXCIuL2VhY2hcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXR0ciBmcm9tIFwiLi9hdHRyXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3N0eWxlIGZyb20gXCIuL3N0eWxlXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3Byb3BlcnR5IGZyb20gXCIuL3Byb3BlcnR5XCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NsYXNzZWQgZnJvbSBcIi4vY2xhc3NlZFwiO1xuaW1wb3J0IHNlbGVjdGlvbl90ZXh0IGZyb20gXCIuL3RleHRcIjtcbmltcG9ydCBzZWxlY3Rpb25faHRtbCBmcm9tIFwiLi9odG1sXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JhaXNlIGZyb20gXCIuL3JhaXNlXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2xvd2VyIGZyb20gXCIuL2xvd2VyXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2FwcGVuZCBmcm9tIFwiLi9hcHBlbmRcIjtcbmltcG9ydCBzZWxlY3Rpb25faW5zZXJ0IGZyb20gXCIuL2luc2VydFwiO1xuaW1wb3J0IHNlbGVjdGlvbl9yZW1vdmUgZnJvbSBcIi4vcmVtb3ZlXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdHVtIGZyb20gXCIuL2RhdHVtXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29uIGZyb20gXCIuL29uXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Rpc3BhdGNoIGZyb20gXCIuL2Rpc3BhdGNoXCI7XG5cbmV4cG9ydCB2YXIgcm9vdCA9IFtudWxsXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFNlbGVjdGlvbihncm91cHMsIHBhcmVudHMpIHtcbiAgdGhpcy5fZ3JvdXBzID0gZ3JvdXBzO1xuICB0aGlzLl9wYXJlbnRzID0gcGFyZW50cztcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF1dLCByb290KTtcbn1cblxuU2VsZWN0aW9uLnByb3RvdHlwZSA9IHNlbGVjdGlvbi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBTZWxlY3Rpb24sXG4gIHNlbGVjdDogc2VsZWN0aW9uX3NlbGVjdCxcbiAgc2VsZWN0QWxsOiBzZWxlY3Rpb25fc2VsZWN0QWxsLFxuICBmaWx0ZXI6IHNlbGVjdGlvbl9maWx0ZXIsXG4gIGRhdGE6IHNlbGVjdGlvbl9kYXRhLFxuICBlbnRlcjogc2VsZWN0aW9uX2VudGVyLFxuICBleGl0OiBzZWxlY3Rpb25fZXhpdCxcbiAgbWVyZ2U6IHNlbGVjdGlvbl9tZXJnZSxcbiAgb3JkZXI6IHNlbGVjdGlvbl9vcmRlcixcbiAgc29ydDogc2VsZWN0aW9uX3NvcnQsXG4gIGNhbGw6IHNlbGVjdGlvbl9jYWxsLFxuICBub2Rlczogc2VsZWN0aW9uX25vZGVzLFxuICBub2RlOiBzZWxlY3Rpb25fbm9kZSxcbiAgc2l6ZTogc2VsZWN0aW9uX3NpemUsXG4gIGVtcHR5OiBzZWxlY3Rpb25fZW1wdHksXG4gIGVhY2g6IHNlbGVjdGlvbl9lYWNoLFxuICBhdHRyOiBzZWxlY3Rpb25fYXR0cixcbiAgc3R5bGU6IHNlbGVjdGlvbl9zdHlsZSxcbiAgcHJvcGVydHk6IHNlbGVjdGlvbl9wcm9wZXJ0eSxcbiAgY2xhc3NlZDogc2VsZWN0aW9uX2NsYXNzZWQsXG4gIHRleHQ6IHNlbGVjdGlvbl90ZXh0LFxuICBodG1sOiBzZWxlY3Rpb25faHRtbCxcbiAgcmFpc2U6IHNlbGVjdGlvbl9yYWlzZSxcbiAgbG93ZXI6IHNlbGVjdGlvbl9sb3dlcixcbiAgYXBwZW5kOiBzZWxlY3Rpb25fYXBwZW5kLFxuICBpbnNlcnQ6IHNlbGVjdGlvbl9pbnNlcnQsXG4gIHJlbW92ZTogc2VsZWN0aW9uX3JlbW92ZSxcbiAgZGF0dW06IHNlbGVjdGlvbl9kYXR1bSxcbiAgb246IHNlbGVjdGlvbl9vbixcbiAgZGlzcGF0Y2g6IHNlbGVjdGlvbl9kaXNwYXRjaFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VsZWN0aW9uO1xuIiwiaW1wb3J0IHtTZWxlY3Rpb24sIHJvb3R9IGZyb20gXCIuL3NlbGVjdGlvbi9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiXG4gICAgICA/IG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKV1dLCBbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XSlcbiAgICAgIDogbmV3IFNlbGVjdGlvbihbW3NlbGVjdG9yXV0sIHJvb3QpO1xufVxuIiwiaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuXG4vLyBSZXNpemVzIHRoZSBTVkcgY29udGFpbmVyLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU1ZHIChteSl7XG4gIG15KFwic3ZnXCIpXG4gICAgKFwid2lkdGhcIiwgOTYwKVxuICAgIChcImhlaWdodFwiLCA1MDApXG5cbiAgICAoXCJzdmdTZWxlY3Rpb25cIiwgc2VsZWN0LCBcInN2Z1wiKVxuXG4gICAgKFwic3ZnLXdpZHRoXCIsIGZ1bmN0aW9uIChzdmdTZWxlY3Rpb24sIHdpZHRoKXtcbiAgICAgIHN2Z1NlbGVjdGlvbi5hdHRyKFwid2lkdGhcIiwgd2lkdGgpO1xuICAgIH0sIFwic3ZnU2VsZWN0aW9uLCB3aWR0aFwiKVxuXG4gICAgKFwic3ZnLWhlaWdodFwiLCBmdW5jdGlvbiAoc3ZnU2VsZWN0aW9uLCBoZWlnaHQpe1xuICAgICAgc3ZnU2VsZWN0aW9uLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcbiAgICB9LCBcInN2Z1NlbGVjdGlvbiwgaGVpZ2h0XCIpO1xufVxuIiwiaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuXG4vLyBFbmNhcHN1bGF0ZXMgdGhlIG1hcmdpbiBjb252ZW50aW9uLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWFyZ2luKG15KXtcbiAgbXkoXCJtYXJnaW5Ub3BcIiwgNTApXG4gICAgKFwibWFyZ2luQm90dG9tXCIsIDUwKVxuICAgIChcIm1hcmdpbkxlZnRcIiwgNTApXG4gICAgKFwibWFyZ2luUmlnaHRcIiwgNTApXG5cbiAgICAoXCJpbm5lcldpZHRoXCIsIGZ1bmN0aW9uICh3aWR0aCwgbWFyZ2luTGVmdCwgbWFyZ2luUmlnaHQpe1xuICAgICAgcmV0dXJuIHdpZHRoIC0gbWFyZ2luTGVmdCAtIG1hcmdpblJpZ2h0O1xuICAgIH0sIFwid2lkdGgsIG1hcmdpbkxlZnQsIG1hcmdpblJpZ2h0XCIpXG5cbiAgICAoXCJpbm5lckhlaWdodFwiLCBmdW5jdGlvbiAoaGVpZ2h0LCBtYXJnaW5Ub3AsIG1hcmdpbkJvdHRvbSl7XG4gICAgICByZXR1cm4gaGVpZ2h0IC0gbWFyZ2luVG9wIC0gbWFyZ2luQm90dG9tO1xuICAgIH0sIFwiaGVpZ2h0LCBtYXJnaW5Ub3AsIG1hcmdpbkJvdHRvbVwiKVxuXG4gICAgKFwiZ1wiLCBmdW5jdGlvbiAoc3ZnU2VsZWN0aW9uKXtcblxuICAgICAgdmFyIGcgPSBzdmdTZWxlY3Rpb24uc2VsZWN0QWxsKFwiLnJlYWN0aXZlLXZpcy1tYXJnaW4tZ1wiKVxuICAgICAgICAuZGF0YShbMV0pO1xuXG4gICAgICByZXR1cm4gZy5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwicmVhY3RpdmUtdmlzLW1hcmdpbi1nXCIpXG4gICAgICAgIC5tZXJnZShnKTtcblxuICAgIH0sIFwic3ZnU2VsZWN0aW9uXCIpXG5cbiAgICAoXCJnLXRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZywgbWFyZ2luTGVmdCwgbWFyZ2luVG9wKXtcbiAgICAgIGcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG1hcmdpbkxlZnQgKyBcIixcIiArIG1hcmdpblRvcCArIFwiKVwiKTtcbiAgICB9LCBcImcsIG1hcmdpbkxlZnQsIG1hcmdpblRvcFwiKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERhdGEgKG15KXtcbiAgbXkoXCJkYXRhXCIpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29sdW1uIChteSwgbmFtZSl7XG4gIG15KG5hbWUgKyBcIkNvbHVtblwiKVxuICAgIChuYW1lICsgXCJBY2Nlc3NvclwiLCBmdW5jdGlvbiAoY29sdW1uKXtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZCl7IHJldHVybiBkW2NvbHVtbl07IH07XG4gICAgfSwgbmFtZSArIFwiQ29sdW1uXCIpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2NhbGUgKG15LCBuYW1lLCBzY2FsZUNvbnN0cnVjdG9yKXtcblxuICB2YXIgc2NhbGUgPSBzY2FsZUNvbnN0cnVjdG9yKCk7XG5cbiAgbXkgKG5hbWUgKyBcIlNjYWxlXCIsIGZ1bmN0aW9uKGRvbWFpbiwgcmFuZ2Upe1xuICAgIHJldHVybiBzY2FsZVxuICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAucmFuZ2UocmFuZ2UpO1xuICB9LCBbbmFtZSArIFwiRG9tYWluXCIsIG5hbWUgKyBcIlJhbmdlXCJdKTtcblxuICBteShuYW1lICsgXCJTY2FsZWRcIiwgZnVuY3Rpb24oc2NhbGUsIGFjY2Vzc29yKXtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQpe1xuICAgICAgcmV0dXJuIHNjYWxlKGFjY2Vzc29yKGQpKTtcbiAgICB9O1xuICB9LCBbbmFtZSArIFwiU2NhbGVcIiwgbmFtZSArIFwiQWNjZXNzb3JcIl0pO1xufVxuIiwiLy8gUmVzcG9uZCB0byByZXNpemUgYnkgc2V0dGluZyB3aWR0aCBhbmQgaGVpZ2h0IGZyb20gRE9NIGVsZW1lbnQuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZXNpemUobXksIGVsKXtcblxuICBmdW5jdGlvbiByZXNpemUoKXtcbiAgICBteS53aWR0aChlbC5jbGllbnRXaWR0aClcbiAgICAgIC5oZWlnaHQoZWwuY2xpZW50SGVpZ2h0KTtcbiAgfVxuXG4gIC8vIFNldCBpbml0aWFsIHNpemUuXG4gIHJlc2l6ZSgpO1xuXG4gIC8vIEd1YXJkIHNvIHVuaXQgdGVzdHMgZG9uJ3QgYnJlYWsgaW4gTm9kZUpTIGVudmlyb25tZW50LlxuICBpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKXtcblxuICAgIC8vIFVwZGF0ZSBzaXplIHdoZW4gdGhlIGJyb3dzZXIgd2luZG93IGlzIHJlc2l6ZWQuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgcmVzaXplKTtcbiAgfVxufVxuIiwiaW1wb3J0IFJlYWN0aXZlTW9kZWwgZnJvbSBcInJlYWN0aXZlLW1vZGVsXCI7XG5pbXBvcnQgU1ZHIGZyb20gXCIuLi9taXhpbnMvc3ZnXCI7XG5pbXBvcnQgRGF0YSBmcm9tIFwiLi4vbWl4aW5zL2RhdGFcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2lyY2xlKCl7XG4gIHJldHVybiBSZWFjdGl2ZU1vZGVsKClcbiAgICAuY2FsbChTVkcpXG4gICAgLmNhbGwoRGF0YSlcblxuICAgIChcImNpcmNsZVwiLCBmdW5jdGlvbiAoc3ZnU2VsZWN0aW9uLCBkYXRhKXtcblxuICAgICAgdmFyIGNpcmNsZSA9IHN2Z1NlbGVjdGlvbi5zZWxlY3RBbGwoXCIucmVhY3RpdmUtdmlzLWNpcmNsZVwiKVxuICAgICAgICAuZGF0YShkYXRhKTtcblxuICAgICAgcmV0dXJuIGNpcmNsZS5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJyZWFjdGl2ZS12aXMtY2lyY2xlXCIpXG4gICAgICAgIC5tZXJnZShjaXJjbGUpO1xuXG4gICAgfSwgXCJzdmdTZWxlY3Rpb24sIGRhdGFcIik7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn1cbiIsImltcG9ydCBhc2NlbmRpbmcgZnJvbSBcIi4vYXNjZW5kaW5nXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbXBhcmUpIHtcbiAgaWYgKGNvbXBhcmUubGVuZ3RoID09PSAxKSBjb21wYXJlID0gYXNjZW5kaW5nQ29tcGFyYXRvcihjb21wYXJlKTtcbiAgcmV0dXJuIHtcbiAgICBsZWZ0OiBmdW5jdGlvbihhLCB4LCBsbywgaGkpIHtcbiAgICAgIGlmIChsbyA9PSBudWxsKSBsbyA9IDA7XG4gICAgICBpZiAoaGkgPT0gbnVsbCkgaGkgPSBhLmxlbmd0aDtcbiAgICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgICAgICBpZiAoY29tcGFyZShhW21pZF0sIHgpIDwgMCkgbG8gPSBtaWQgKyAxO1xuICAgICAgICBlbHNlIGhpID0gbWlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxvO1xuICAgIH0sXG4gICAgcmlnaHQ6IGZ1bmN0aW9uKGEsIHgsIGxvLCBoaSkge1xuICAgICAgaWYgKGxvID09IG51bGwpIGxvID0gMDtcbiAgICAgIGlmIChoaSA9PSBudWxsKSBoaSA9IGEubGVuZ3RoO1xuICAgICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgIGlmIChjb21wYXJlKGFbbWlkXSwgeCkgPiAwKSBoaSA9IG1pZDtcbiAgICAgICAgZWxzZSBsbyA9IG1pZCArIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbG87XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBhc2NlbmRpbmdDb21wYXJhdG9yKGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQsIHgpIHtcbiAgICByZXR1cm4gYXNjZW5kaW5nKGYoZCksIHgpO1xuICB9O1xufVxuIiwiaW1wb3J0IGFzY2VuZGluZyBmcm9tIFwiLi9hc2NlbmRpbmdcIjtcbmltcG9ydCBiaXNlY3RvciBmcm9tIFwiLi9iaXNlY3RvclwiO1xuXG52YXIgYXNjZW5kaW5nQmlzZWN0ID0gYmlzZWN0b3IoYXNjZW5kaW5nKTtcbmV4cG9ydCB2YXIgYmlzZWN0UmlnaHQgPSBhc2NlbmRpbmdCaXNlY3QucmlnaHQ7XG5leHBvcnQgdmFyIGJpc2VjdExlZnQgPSBhc2NlbmRpbmdCaXNlY3QubGVmdDtcbmV4cG9ydCBkZWZhdWx0IGJpc2VjdFJpZ2h0O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYXJyYXksIGYpIHtcbiAgdmFyIGkgPSAtMSxcbiAgICAgIG4gPSBhcnJheS5sZW5ndGgsXG4gICAgICBhLFxuICAgICAgYixcbiAgICAgIGM7XG5cbiAgaWYgKGYgPT0gbnVsbCkge1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBhcnJheVtpXSkgIT0gbnVsbCAmJiBiID49IGIpIHsgYSA9IGMgPSBiOyBicmVhazsgfVxuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBhcnJheVtpXSkgIT0gbnVsbCkge1xuICAgICAgaWYgKGEgPiBiKSBhID0gYjtcbiAgICAgIGlmIChjIDwgYikgYyA9IGI7XG4gICAgfVxuICB9XG5cbiAgZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYoYXJyYXlbaV0sIGksIGFycmF5KSkgIT0gbnVsbCAmJiBiID49IGIpIHsgYSA9IGMgPSBiOyBicmVhazsgfVxuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmKGFycmF5W2ldLCBpLCBhcnJheSkpICE9IG51bGwpIHtcbiAgICAgIGlmIChhID4gYikgYSA9IGI7XG4gICAgICBpZiAoYyA8IGIpIGMgPSBiO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbYSwgY107XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhcnJheSwgZikge1xuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGEsXG4gICAgICBiO1xuXG4gIGlmIChmID09IG51bGwpIHtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gYXJyYXlbaV0pICE9IG51bGwgJiYgYiA+PSBiKSB7IGEgPSBiOyBicmVhazsgfVxuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBhcnJheVtpXSkgIT0gbnVsbCAmJiBiID4gYSkgYSA9IGI7XG4gIH1cblxuICBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gZihhcnJheVtpXSwgaSwgYXJyYXkpKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYjsgYnJlYWs7IH1cbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gZihhcnJheVtpXSwgaSwgYXJyYXkpKSAhPSBudWxsICYmIGIgPiBhKSBhID0gYjtcbiAgfVxuXG4gIHJldHVybiBhO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG59XG4iLCJpbXBvcnQgYXNjZW5kaW5nIGZyb20gXCIuL2FzY2VuZGluZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb21wYXJlKSB7XG4gIGlmIChjb21wYXJlLmxlbmd0aCA9PT0gMSkgY29tcGFyZSA9IGFzY2VuZGluZ0NvbXBhcmF0b3IoY29tcGFyZSk7XG4gIHJldHVybiB7XG4gICAgbGVmdDogZnVuY3Rpb24oYSwgeCwgbG8sIGhpKSB7XG4gICAgICBpZiAobG8gPT0gbnVsbCkgbG8gPSAwO1xuICAgICAgaWYgKGhpID09IG51bGwpIGhpID0gYS5sZW5ndGg7XG4gICAgICB3aGlsZSAobG8gPCBoaSkge1xuICAgICAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICAgICAgaWYgKGNvbXBhcmUoYVttaWRdLCB4KSA8IDApIGxvID0gbWlkICsgMTtcbiAgICAgICAgZWxzZSBoaSA9IG1pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsbztcbiAgICB9LFxuICAgIHJpZ2h0OiBmdW5jdGlvbihhLCB4LCBsbywgaGkpIHtcbiAgICAgIGlmIChsbyA9PSBudWxsKSBsbyA9IDA7XG4gICAgICBpZiAoaGkgPT0gbnVsbCkgaGkgPSBhLmxlbmd0aDtcbiAgICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgICAgICBpZiAoY29tcGFyZShhW21pZF0sIHgpID4gMCkgaGkgPSBtaWQ7XG4gICAgICAgIGVsc2UgbG8gPSBtaWQgKyAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxvO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYXNjZW5kaW5nQ29tcGFyYXRvcihmKSB7XG4gIHJldHVybiBmdW5jdGlvbihkLCB4KSB7XG4gICAgcmV0dXJuIGFzY2VuZGluZyhmKGQpLCB4KTtcbiAgfTtcbn1cbiIsImltcG9ydCBhc2NlbmRpbmcgZnJvbSBcIi4vYXNjZW5kaW5nXCI7XG5pbXBvcnQgYmlzZWN0b3IgZnJvbSBcIi4vYmlzZWN0b3JcIjtcblxudmFyIGFzY2VuZGluZ0Jpc2VjdCA9IGJpc2VjdG9yKGFzY2VuZGluZyk7XG5leHBvcnQgdmFyIGJpc2VjdFJpZ2h0ID0gYXNjZW5kaW5nQmlzZWN0LnJpZ2h0O1xuZXhwb3J0IHZhciBiaXNlY3RMZWZ0ID0gYXNjZW5kaW5nQmlzZWN0LmxlZnQ7XG5leHBvcnQgZGVmYXVsdCBiaXNlY3RSaWdodDtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gIHN0YXJ0ID0gK3N0YXJ0LCBzdG9wID0gK3N0b3AsIHN0ZXAgPSAobiA9IGFyZ3VtZW50cy5sZW5ndGgpIDwgMiA/IChzdG9wID0gc3RhcnQsIHN0YXJ0ID0gMCwgMSkgOiBuIDwgMyA/IDEgOiArc3RlcDtcblxuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IE1hdGgubWF4KDAsIE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApKSB8IDAsXG4gICAgICByYW5nZSA9IG5ldyBBcnJheShuKTtcblxuICB3aGlsZSAoKytpIDwgbikge1xuICAgIHJhbmdlW2ldID0gc3RhcnQgKyBpICogc3RlcDtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn1cbiIsImltcG9ydCByYW5nZSBmcm9tIFwiLi9yYW5nZVwiO1xuXG52YXIgZTEwID0gTWF0aC5zcXJ0KDUwKSxcbiAgICBlNSA9IE1hdGguc3FydCgxMCksXG4gICAgZTIgPSBNYXRoLnNxcnQoMik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBjb3VudCkge1xuICB2YXIgc3RlcCA9IHRpY2tTdGVwKHN0YXJ0LCBzdG9wLCBjb3VudCk7XG4gIHJldHVybiByYW5nZShcbiAgICBNYXRoLmNlaWwoc3RhcnQgLyBzdGVwKSAqIHN0ZXAsXG4gICAgTWF0aC5mbG9vcihzdG9wIC8gc3RlcCkgKiBzdGVwICsgc3RlcCAvIDIsIC8vIGluY2x1c2l2ZVxuICAgIHN0ZXBcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tTdGVwKHN0YXJ0LCBzdG9wLCBjb3VudCkge1xuICB2YXIgc3RlcDAgPSBNYXRoLmFicyhzdG9wIC0gc3RhcnQpIC8gTWF0aC5tYXgoMCwgY291bnQpLFxuICAgICAgc3RlcDEgPSBNYXRoLnBvdygxMCwgTWF0aC5mbG9vcihNYXRoLmxvZyhzdGVwMCkgLyBNYXRoLkxOMTApKSxcbiAgICAgIGVycm9yID0gc3RlcDAgLyBzdGVwMTtcbiAgaWYgKGVycm9yID49IGUxMCkgc3RlcDEgKj0gMTA7XG4gIGVsc2UgaWYgKGVycm9yID49IGU1KSBzdGVwMSAqPSA1O1xuICBlbHNlIGlmIChlcnJvciA+PSBlMikgc3RlcDEgKj0gMjtcbiAgcmV0dXJuIHN0b3AgPCBzdGFydCA/IC1zdGVwMSA6IHN0ZXAxO1xufVxuIiwidmFyIGFycmF5ID0gQXJyYXkucHJvdG90eXBlO1xuXG5leHBvcnQgdmFyIG1hcCA9IGFycmF5Lm1hcDtcbmV4cG9ydCB2YXIgc2xpY2UgPSBhcnJheS5zbGljZTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnN0cnVjdG9yLCBmYWN0b3J5LCBwcm90b3R5cGUpIHtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gZmFjdG9yeS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gIHByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHBhcmVudCwgZGVmaW5pdGlvbikge1xuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcbiAgZm9yICh2YXIga2V5IGluIGRlZmluaXRpb24pIHByb3RvdHlwZVtrZXldID0gZGVmaW5pdGlvbltrZXldO1xuICByZXR1cm4gcHJvdG90eXBlO1xufVxuIiwiaW1wb3J0IGRlZmluZSwge2V4dGVuZH0gZnJvbSBcIi4vZGVmaW5lXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb2xvcigpIHt9XG5cbmV4cG9ydCB2YXIgZGFya2VyID0gMC43O1xuZXhwb3J0IHZhciBicmlnaHRlciA9IDEgLyBkYXJrZXI7XG5cbnZhciByZUhleDMgPSAvXiMoWzAtOWEtZl17M30pJC8sXG4gICAgcmVIZXg2ID0gL14jKFswLTlhLWZdezZ9KSQvLFxuICAgIHJlUmdiSW50ZWdlciA9IC9ecmdiXFwoXFxzKihbLStdP1xcZCspXFxzKixcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccypcXCkkLyxcbiAgICByZVJnYlBlcmNlbnQgPSAvXnJnYlxcKFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqXFwpJC8sXG4gICAgcmVSZ2JhSW50ZWdlciA9IC9ecmdiYVxcKFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKixcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KVxccypcXCkkLyxcbiAgICByZVJnYmFQZXJjZW50ID0gL15yZ2JhXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKSQvLFxuICAgIHJlSHNsUGVyY2VudCA9IC9eaHNsXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKlxcKSQvLFxuICAgIHJlSHNsYVBlcmNlbnQgPSAvXmhzbGFcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KVxccypcXCkkLztcblxudmFyIG5hbWVkID0ge1xuICBhbGljZWJsdWU6IDB4ZjBmOGZmLFxuICBhbnRpcXVld2hpdGU6IDB4ZmFlYmQ3LFxuICBhcXVhOiAweDAwZmZmZixcbiAgYXF1YW1hcmluZTogMHg3ZmZmZDQsXG4gIGF6dXJlOiAweGYwZmZmZixcbiAgYmVpZ2U6IDB4ZjVmNWRjLFxuICBiaXNxdWU6IDB4ZmZlNGM0LFxuICBibGFjazogMHgwMDAwMDAsXG4gIGJsYW5jaGVkYWxtb25kOiAweGZmZWJjZCxcbiAgYmx1ZTogMHgwMDAwZmYsXG4gIGJsdWV2aW9sZXQ6IDB4OGEyYmUyLFxuICBicm93bjogMHhhNTJhMmEsXG4gIGJ1cmx5d29vZDogMHhkZWI4ODcsXG4gIGNhZGV0Ymx1ZTogMHg1ZjllYTAsXG4gIGNoYXJ0cmV1c2U6IDB4N2ZmZjAwLFxuICBjaG9jb2xhdGU6IDB4ZDI2OTFlLFxuICBjb3JhbDogMHhmZjdmNTAsXG4gIGNvcm5mbG93ZXJibHVlOiAweDY0OTVlZCxcbiAgY29ybnNpbGs6IDB4ZmZmOGRjLFxuICBjcmltc29uOiAweGRjMTQzYyxcbiAgY3lhbjogMHgwMGZmZmYsXG4gIGRhcmtibHVlOiAweDAwMDA4YixcbiAgZGFya2N5YW46IDB4MDA4YjhiLFxuICBkYXJrZ29sZGVucm9kOiAweGI4ODYwYixcbiAgZGFya2dyYXk6IDB4YTlhOWE5LFxuICBkYXJrZ3JlZW46IDB4MDA2NDAwLFxuICBkYXJrZ3JleTogMHhhOWE5YTksXG4gIGRhcmtraGFraTogMHhiZGI3NmIsXG4gIGRhcmttYWdlbnRhOiAweDhiMDA4YixcbiAgZGFya29saXZlZ3JlZW46IDB4NTU2YjJmLFxuICBkYXJrb3JhbmdlOiAweGZmOGMwMCxcbiAgZGFya29yY2hpZDogMHg5OTMyY2MsXG4gIGRhcmtyZWQ6IDB4OGIwMDAwLFxuICBkYXJrc2FsbW9uOiAweGU5OTY3YSxcbiAgZGFya3NlYWdyZWVuOiAweDhmYmM4ZixcbiAgZGFya3NsYXRlYmx1ZTogMHg0ODNkOGIsXG4gIGRhcmtzbGF0ZWdyYXk6IDB4MmY0ZjRmLFxuICBkYXJrc2xhdGVncmV5OiAweDJmNGY0ZixcbiAgZGFya3R1cnF1b2lzZTogMHgwMGNlZDEsXG4gIGRhcmt2aW9sZXQ6IDB4OTQwMGQzLFxuICBkZWVwcGluazogMHhmZjE0OTMsXG4gIGRlZXBza3libHVlOiAweDAwYmZmZixcbiAgZGltZ3JheTogMHg2OTY5NjksXG4gIGRpbWdyZXk6IDB4Njk2OTY5LFxuICBkb2RnZXJibHVlOiAweDFlOTBmZixcbiAgZmlyZWJyaWNrOiAweGIyMjIyMixcbiAgZmxvcmFsd2hpdGU6IDB4ZmZmYWYwLFxuICBmb3Jlc3RncmVlbjogMHgyMjhiMjIsXG4gIGZ1Y2hzaWE6IDB4ZmYwMGZmLFxuICBnYWluc2Jvcm86IDB4ZGNkY2RjLFxuICBnaG9zdHdoaXRlOiAweGY4ZjhmZixcbiAgZ29sZDogMHhmZmQ3MDAsXG4gIGdvbGRlbnJvZDogMHhkYWE1MjAsXG4gIGdyYXk6IDB4ODA4MDgwLFxuICBncmVlbjogMHgwMDgwMDAsXG4gIGdyZWVueWVsbG93OiAweGFkZmYyZixcbiAgZ3JleTogMHg4MDgwODAsXG4gIGhvbmV5ZGV3OiAweGYwZmZmMCxcbiAgaG90cGluazogMHhmZjY5YjQsXG4gIGluZGlhbnJlZDogMHhjZDVjNWMsXG4gIGluZGlnbzogMHg0YjAwODIsXG4gIGl2b3J5OiAweGZmZmZmMCxcbiAga2hha2k6IDB4ZjBlNjhjLFxuICBsYXZlbmRlcjogMHhlNmU2ZmEsXG4gIGxhdmVuZGVyYmx1c2g6IDB4ZmZmMGY1LFxuICBsYXduZ3JlZW46IDB4N2NmYzAwLFxuICBsZW1vbmNoaWZmb246IDB4ZmZmYWNkLFxuICBsaWdodGJsdWU6IDB4YWRkOGU2LFxuICBsaWdodGNvcmFsOiAweGYwODA4MCxcbiAgbGlnaHRjeWFuOiAweGUwZmZmZixcbiAgbGlnaHRnb2xkZW5yb2R5ZWxsb3c6IDB4ZmFmYWQyLFxuICBsaWdodGdyYXk6IDB4ZDNkM2QzLFxuICBsaWdodGdyZWVuOiAweDkwZWU5MCxcbiAgbGlnaHRncmV5OiAweGQzZDNkMyxcbiAgbGlnaHRwaW5rOiAweGZmYjZjMSxcbiAgbGlnaHRzYWxtb246IDB4ZmZhMDdhLFxuICBsaWdodHNlYWdyZWVuOiAweDIwYjJhYSxcbiAgbGlnaHRza3libHVlOiAweDg3Y2VmYSxcbiAgbGlnaHRzbGF0ZWdyYXk6IDB4Nzc4ODk5LFxuICBsaWdodHNsYXRlZ3JleTogMHg3Nzg4OTksXG4gIGxpZ2h0c3RlZWxibHVlOiAweGIwYzRkZSxcbiAgbGlnaHR5ZWxsb3c6IDB4ZmZmZmUwLFxuICBsaW1lOiAweDAwZmYwMCxcbiAgbGltZWdyZWVuOiAweDMyY2QzMixcbiAgbGluZW46IDB4ZmFmMGU2LFxuICBtYWdlbnRhOiAweGZmMDBmZixcbiAgbWFyb29uOiAweDgwMDAwMCxcbiAgbWVkaXVtYXF1YW1hcmluZTogMHg2NmNkYWEsXG4gIG1lZGl1bWJsdWU6IDB4MDAwMGNkLFxuICBtZWRpdW1vcmNoaWQ6IDB4YmE1NWQzLFxuICBtZWRpdW1wdXJwbGU6IDB4OTM3MGRiLFxuICBtZWRpdW1zZWFncmVlbjogMHgzY2IzNzEsXG4gIG1lZGl1bXNsYXRlYmx1ZTogMHg3YjY4ZWUsXG4gIG1lZGl1bXNwcmluZ2dyZWVuOiAweDAwZmE5YSxcbiAgbWVkaXVtdHVycXVvaXNlOiAweDQ4ZDFjYyxcbiAgbWVkaXVtdmlvbGV0cmVkOiAweGM3MTU4NSxcbiAgbWlkbmlnaHRibHVlOiAweDE5MTk3MCxcbiAgbWludGNyZWFtOiAweGY1ZmZmYSxcbiAgbWlzdHlyb3NlOiAweGZmZTRlMSxcbiAgbW9jY2FzaW46IDB4ZmZlNGI1LFxuICBuYXZham93aGl0ZTogMHhmZmRlYWQsXG4gIG5hdnk6IDB4MDAwMDgwLFxuICBvbGRsYWNlOiAweGZkZjVlNixcbiAgb2xpdmU6IDB4ODA4MDAwLFxuICBvbGl2ZWRyYWI6IDB4NmI4ZTIzLFxuICBvcmFuZ2U6IDB4ZmZhNTAwLFxuICBvcmFuZ2VyZWQ6IDB4ZmY0NTAwLFxuICBvcmNoaWQ6IDB4ZGE3MGQ2LFxuICBwYWxlZ29sZGVucm9kOiAweGVlZThhYSxcbiAgcGFsZWdyZWVuOiAweDk4ZmI5OCxcbiAgcGFsZXR1cnF1b2lzZTogMHhhZmVlZWUsXG4gIHBhbGV2aW9sZXRyZWQ6IDB4ZGI3MDkzLFxuICBwYXBheWF3aGlwOiAweGZmZWZkNSxcbiAgcGVhY2hwdWZmOiAweGZmZGFiOSxcbiAgcGVydTogMHhjZDg1M2YsXG4gIHBpbms6IDB4ZmZjMGNiLFxuICBwbHVtOiAweGRkYTBkZCxcbiAgcG93ZGVyYmx1ZTogMHhiMGUwZTYsXG4gIHB1cnBsZTogMHg4MDAwODAsXG4gIHJlYmVjY2FwdXJwbGU6IDB4NjYzMzk5LFxuICByZWQ6IDB4ZmYwMDAwLFxuICByb3N5YnJvd246IDB4YmM4ZjhmLFxuICByb3lhbGJsdWU6IDB4NDE2OWUxLFxuICBzYWRkbGVicm93bjogMHg4YjQ1MTMsXG4gIHNhbG1vbjogMHhmYTgwNzIsXG4gIHNhbmR5YnJvd246IDB4ZjRhNDYwLFxuICBzZWFncmVlbjogMHgyZThiNTcsXG4gIHNlYXNoZWxsOiAweGZmZjVlZSxcbiAgc2llbm5hOiAweGEwNTIyZCxcbiAgc2lsdmVyOiAweGMwYzBjMCxcbiAgc2t5Ymx1ZTogMHg4N2NlZWIsXG4gIHNsYXRlYmx1ZTogMHg2YTVhY2QsXG4gIHNsYXRlZ3JheTogMHg3MDgwOTAsXG4gIHNsYXRlZ3JleTogMHg3MDgwOTAsXG4gIHNub3c6IDB4ZmZmYWZhLFxuICBzcHJpbmdncmVlbjogMHgwMGZmN2YsXG4gIHN0ZWVsYmx1ZTogMHg0NjgyYjQsXG4gIHRhbjogMHhkMmI0OGMsXG4gIHRlYWw6IDB4MDA4MDgwLFxuICB0aGlzdGxlOiAweGQ4YmZkOCxcbiAgdG9tYXRvOiAweGZmNjM0NyxcbiAgdHVycXVvaXNlOiAweDQwZTBkMCxcbiAgdmlvbGV0OiAweGVlODJlZSxcbiAgd2hlYXQ6IDB4ZjVkZWIzLFxuICB3aGl0ZTogMHhmZmZmZmYsXG4gIHdoaXRlc21va2U6IDB4ZjVmNWY1LFxuICB5ZWxsb3c6IDB4ZmZmZjAwLFxuICB5ZWxsb3dncmVlbjogMHg5YWNkMzJcbn07XG5cbmRlZmluZShDb2xvciwgY29sb3IsIHtcbiAgZGlzcGxheWFibGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJnYigpLmRpc3BsYXlhYmxlKCk7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZ2IoKSArIFwiXCI7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvcihmb3JtYXQpIHtcbiAgdmFyIG07XG4gIGZvcm1hdCA9IChmb3JtYXQgKyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIChtID0gcmVIZXgzLmV4ZWMoZm9ybWF0KSkgPyAobSA9IHBhcnNlSW50KG1bMV0sIDE2KSwgbmV3IFJnYigobSA+PiA4ICYgMHhmKSB8IChtID4+IDQgJiAweDBmMCksIChtID4+IDQgJiAweGYpIHwgKG0gJiAweGYwKSwgKChtICYgMHhmKSA8PCA0KSB8IChtICYgMHhmKSwgMSkpIC8vICNmMDBcbiAgICAgIDogKG0gPSByZUhleDYuZXhlYyhmb3JtYXQpKSA/IHJnYm4ocGFyc2VJbnQobVsxXSwgMTYpKSAvLyAjZmYwMDAwXG4gICAgICA6IChtID0gcmVSZ2JJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyBuZXcgUmdiKG1bMV0sIG1bMl0sIG1bM10sIDEpIC8vIHJnYigyNTUsIDAsIDApXG4gICAgICA6IChtID0gcmVSZ2JQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBuZXcgUmdiKG1bMV0gKiAyNTUgLyAxMDAsIG1bMl0gKiAyNTUgLyAxMDAsIG1bM10gKiAyNTUgLyAxMDAsIDEpIC8vIHJnYigxMDAlLCAwJSwgMCUpXG4gICAgICA6IChtID0gcmVSZ2JhSW50ZWdlci5leGVjKGZvcm1hdCkpID8gcmdiYShtWzFdLCBtWzJdLCBtWzNdLCBtWzRdKSAvLyByZ2JhKDI1NSwgMCwgMCwgMSlcbiAgICAgIDogKG0gPSByZVJnYmFQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyByZ2JhKG1bMV0gKiAyNTUgLyAxMDAsIG1bMl0gKiAyNTUgLyAxMDAsIG1bM10gKiAyNTUgLyAxMDAsIG1bNF0pIC8vIHJnYigxMDAlLCAwJSwgMCUsIDEpXG4gICAgICA6IChtID0gcmVIc2xQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2xhKG1bMV0sIG1bMl0gLyAxMDAsIG1bM10gLyAxMDAsIDEpIC8vIGhzbCgxMjAsIDUwJSwgNTAlKVxuICAgICAgOiAobSA9IHJlSHNsYVBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbGEobVsxXSwgbVsyXSAvIDEwMCwgbVszXSAvIDEwMCwgbVs0XSkgLy8gaHNsYSgxMjAsIDUwJSwgNTAlLCAxKVxuICAgICAgOiBuYW1lZC5oYXNPd25Qcm9wZXJ0eShmb3JtYXQpID8gcmdibihuYW1lZFtmb3JtYXRdKVxuICAgICAgOiBmb3JtYXQgPT09IFwidHJhbnNwYXJlbnRcIiA/IG5ldyBSZ2IoTmFOLCBOYU4sIE5hTiwgMClcbiAgICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gcmdibihuKSB7XG4gIHJldHVybiBuZXcgUmdiKG4gPj4gMTYgJiAweGZmLCBuID4+IDggJiAweGZmLCBuICYgMHhmZiwgMSk7XG59XG5cbmZ1bmN0aW9uIHJnYmEociwgZywgYiwgYSkge1xuICBpZiAoYSA8PSAwKSByID0gZyA9IGIgPSBOYU47XG4gIHJldHVybiBuZXcgUmdiKHIsIGcsIGIsIGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmdiQ29udmVydChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBDb2xvcikpIG8gPSBjb2xvcihvKTtcbiAgaWYgKCFvKSByZXR1cm4gbmV3IFJnYjtcbiAgbyA9IG8ucmdiKCk7XG4gIHJldHVybiBuZXcgUmdiKG8uciwgby5nLCBvLmIsIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZ2IociwgZywgYiwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IHJnYkNvbnZlcnQocikgOiBuZXcgUmdiKHIsIGcsIGIsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJnYihyLCBnLCBiLCBvcGFjaXR5KSB7XG4gIHRoaXMuciA9ICtyO1xuICB0aGlzLmcgPSArZztcbiAgdGhpcy5iID0gK2I7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoUmdiLCByZ2IsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXI6IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBkaXNwbGF5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICgwIDw9IHRoaXMuciAmJiB0aGlzLnIgPD0gMjU1KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmcgJiYgdGhpcy5nIDw9IDI1NSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5iICYmIHRoaXMuYiA8PSAyNTUpXG4gICAgICAgICYmICgwIDw9IHRoaXMub3BhY2l0eSAmJiB0aGlzLm9wYWNpdHkgPD0gMSk7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYSA9IHRoaXMub3BhY2l0eTsgYSA9IGlzTmFOKGEpID8gMSA6IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIGEpKTtcbiAgICByZXR1cm4gKGEgPT09IDEgPyBcInJnYihcIiA6IFwicmdiYShcIilcbiAgICAgICAgKyBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQodGhpcy5yKSB8fCAwKSkgKyBcIiwgXCJcbiAgICAgICAgKyBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQodGhpcy5nKSB8fCAwKSkgKyBcIiwgXCJcbiAgICAgICAgKyBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQodGhpcy5iKSB8fCAwKSlcbiAgICAgICAgKyAoYSA9PT0gMSA/IFwiKVwiIDogXCIsIFwiICsgYSArIFwiKVwiKTtcbiAgfVxufSkpO1xuXG5mdW5jdGlvbiBoc2xhKGgsIHMsIGwsIGEpIHtcbiAgaWYgKGEgPD0gMCkgaCA9IHMgPSBsID0gTmFOO1xuICBlbHNlIGlmIChsIDw9IDAgfHwgbCA+PSAxKSBoID0gcyA9IE5hTjtcbiAgZWxzZSBpZiAocyA8PSAwKSBoID0gTmFOO1xuICByZXR1cm4gbmV3IEhzbChoLCBzLCBsLCBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzbENvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIG5ldyBIc2woby5oLCBvLnMsIG8ubCwgby5vcGFjaXR5KTtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIENvbG9yKSkgbyA9IGNvbG9yKG8pO1xuICBpZiAoIW8pIHJldHVybiBuZXcgSHNsO1xuICBpZiAobyBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIG87XG4gIG8gPSBvLnJnYigpO1xuICB2YXIgciA9IG8uciAvIDI1NSxcbiAgICAgIGcgPSBvLmcgLyAyNTUsXG4gICAgICBiID0gby5iIC8gMjU1LFxuICAgICAgbWluID0gTWF0aC5taW4ociwgZywgYiksXG4gICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcbiAgICAgIGggPSBOYU4sXG4gICAgICBzID0gbWF4IC0gbWluLFxuICAgICAgbCA9IChtYXggKyBtaW4pIC8gMjtcbiAgaWYgKHMpIHtcbiAgICBpZiAociA9PT0gbWF4KSBoID0gKGcgLSBiKSAvIHMgKyAoZyA8IGIpICogNjtcbiAgICBlbHNlIGlmIChnID09PSBtYXgpIGggPSAoYiAtIHIpIC8gcyArIDI7XG4gICAgZWxzZSBoID0gKHIgLSBnKSAvIHMgKyA0O1xuICAgIHMgLz0gbCA8IDAuNSA/IG1heCArIG1pbiA6IDIgLSBtYXggLSBtaW47XG4gICAgaCAqPSA2MDtcbiAgfSBlbHNlIHtcbiAgICBzID0gbCA+IDAgJiYgbCA8IDEgPyAwIDogaDtcbiAgfVxuICByZXR1cm4gbmV3IEhzbChoLCBzLCBsLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHNsKGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBoc2xDb252ZXJ0KGgpIDogbmV3IEhzbChoLCBzLCBsLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmZ1bmN0aW9uIEhzbChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHRoaXMuaCA9ICtoO1xuICB0aGlzLnMgPSArcztcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoSHNsLCBoc2wsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSB0aGlzLmggJSAzNjAgKyAodGhpcy5oIDwgMCkgKiAzNjAsXG4gICAgICAgIHMgPSBpc05hTihoKSB8fCBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyxcbiAgICAgICAgbCA9IHRoaXMubCxcbiAgICAgICAgbTIgPSBsICsgKGwgPCAwLjUgPyBsIDogMSAtIGwpICogcyxcbiAgICAgICAgbTEgPSAyICogbCAtIG0yO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgaHNsMnJnYihoID49IDI0MCA/IGggLSAyNDAgOiBoICsgMTIwLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoIDwgMTIwID8gaCArIDI0MCA6IGggLSAxMjAsIG0xLCBtMiksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9LFxuICBkaXNwbGF5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICgwIDw9IHRoaXMucyAmJiB0aGlzLnMgPD0gMSB8fCBpc05hTih0aGlzLnMpKVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmwgJiYgdGhpcy5sIDw9IDEpXG4gICAgICAgICYmICgwIDw9IHRoaXMub3BhY2l0eSAmJiB0aGlzLm9wYWNpdHkgPD0gMSk7XG4gIH1cbn0pKTtcblxuLyogRnJvbSBGdkQgMTMuMzcsIENTUyBDb2xvciBNb2R1bGUgTGV2ZWwgMyAqL1xuZnVuY3Rpb24gaHNsMnJnYihoLCBtMSwgbTIpIHtcbiAgcmV0dXJuIChoIDwgNjAgPyBtMSArIChtMiAtIG0xKSAqIGggLyA2MFxuICAgICAgOiBoIDwgMTgwID8gbTJcbiAgICAgIDogaCA8IDI0MCA/IG0xICsgKG0yIC0gbTEpICogKDI0MCAtIGgpIC8gNjBcbiAgICAgIDogbTEpICogMjU1O1xufVxuIiwiZXhwb3J0IHZhciBkZWcycmFkID0gTWF0aC5QSSAvIDE4MDtcbmV4cG9ydCB2YXIgcmFkMmRlZyA9IDE4MCAvIE1hdGguUEk7XG4iLCJpbXBvcnQgZGVmaW5lLCB7ZXh0ZW5kfSBmcm9tIFwiLi9kZWZpbmVcIjtcbmltcG9ydCB7Q29sb3IsIHJnYkNvbnZlcnQsIFJnYn0gZnJvbSBcIi4vY29sb3JcIjtcbmltcG9ydCB7ZGVnMnJhZCwgcmFkMmRlZ30gZnJvbSBcIi4vbWF0aFwiO1xuXG52YXIgS24gPSAxOCxcbiAgICBYbiA9IDAuOTUwNDcwLCAvLyBENjUgc3RhbmRhcmQgcmVmZXJlbnRcbiAgICBZbiA9IDEsXG4gICAgWm4gPSAxLjA4ODgzMCxcbiAgICB0MCA9IDQgLyAyOSxcbiAgICB0MSA9IDYgLyAyOSxcbiAgICB0MiA9IDMgKiB0MSAqIHQxLFxuICAgIHQzID0gdDEgKiB0MSAqIHQxO1xuXG5mdW5jdGlvbiBsYWJDb252ZXJ0KG8pIHtcbiAgaWYgKG8gaW5zdGFuY2VvZiBMYWIpIHJldHVybiBuZXcgTGFiKG8ubCwgby5hLCBvLmIsIG8ub3BhY2l0eSk7XG4gIGlmIChvIGluc3RhbmNlb2YgSGNsKSB7XG4gICAgdmFyIGggPSBvLmggKiBkZWcycmFkO1xuICAgIHJldHVybiBuZXcgTGFiKG8ubCwgTWF0aC5jb3MoaCkgKiBvLmMsIE1hdGguc2luKGgpICogby5jLCBvLm9wYWNpdHkpO1xuICB9XG4gIGlmICghKG8gaW5zdGFuY2VvZiBSZ2IpKSBvID0gcmdiQ29udmVydChvKTtcbiAgdmFyIGIgPSByZ2IyeHl6KG8uciksXG4gICAgICBhID0gcmdiMnh5eihvLmcpLFxuICAgICAgbCA9IHJnYjJ4eXooby5iKSxcbiAgICAgIHggPSB4eXoybGFiKCgwLjQxMjQ1NjQgKiBiICsgMC4zNTc1NzYxICogYSArIDAuMTgwNDM3NSAqIGwpIC8gWG4pLFxuICAgICAgeSA9IHh5ejJsYWIoKDAuMjEyNjcyOSAqIGIgKyAwLjcxNTE1MjIgKiBhICsgMC4wNzIxNzUwICogbCkgLyBZbiksXG4gICAgICB6ID0geHl6MmxhYigoMC4wMTkzMzM5ICogYiArIDAuMTE5MTkyMCAqIGEgKyAwLjk1MDMwNDEgKiBsKSAvIFpuKTtcbiAgcmV0dXJuIG5ldyBMYWIoMTE2ICogeSAtIDE2LCA1MDAgKiAoeCAtIHkpLCAyMDAgKiAoeSAtIHopLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsYWIobCwgYSwgYiwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IGxhYkNvbnZlcnQobCkgOiBuZXcgTGFiKGwsIGEsIGIsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExhYihsLCBhLCBiLCBvcGFjaXR5KSB7XG4gIHRoaXMubCA9ICtsO1xuICB0aGlzLmEgPSArYTtcbiAgdGhpcy5iID0gK2I7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoTGFiLCBsYWIsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgTGFiKHRoaXMubCArIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5hLCB0aGlzLmIsIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcjogZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgTGFiKHRoaXMubCAtIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5hLCB0aGlzLmIsIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHkgPSAodGhpcy5sICsgMTYpIC8gMTE2LFxuICAgICAgICB4ID0gaXNOYU4odGhpcy5hKSA/IHkgOiB5ICsgdGhpcy5hIC8gNTAwLFxuICAgICAgICB6ID0gaXNOYU4odGhpcy5iKSA/IHkgOiB5IC0gdGhpcy5iIC8gMjAwO1xuICAgIHkgPSBZbiAqIGxhYjJ4eXooeSk7XG4gICAgeCA9IFhuICogbGFiMnh5eih4KTtcbiAgICB6ID0gWm4gKiBsYWIyeHl6KHopO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgeHl6MnJnYiggMy4yNDA0NTQyICogeCAtIDEuNTM3MTM4NSAqIHkgLSAwLjQ5ODUzMTQgKiB6KSwgLy8gRDY1IC0+IHNSR0JcbiAgICAgIHh5ejJyZ2IoLTAuOTY5MjY2MCAqIHggKyAxLjg3NjAxMDggKiB5ICsgMC4wNDE1NTYwICogeiksXG4gICAgICB4eXoycmdiKCAwLjA1NTY0MzQgKiB4IC0gMC4yMDQwMjU5ICogeSArIDEuMDU3MjI1MiAqIHopLFxuICAgICAgdGhpcy5vcGFjaXR5XG4gICAgKTtcbiAgfVxufSkpO1xuXG5mdW5jdGlvbiB4eXoybGFiKHQpIHtcbiAgcmV0dXJuIHQgPiB0MyA/IE1hdGgucG93KHQsIDEgLyAzKSA6IHQgLyB0MiArIHQwO1xufVxuXG5mdW5jdGlvbiBsYWIyeHl6KHQpIHtcbiAgcmV0dXJuIHQgPiB0MSA/IHQgKiB0ICogdCA6IHQyICogKHQgLSB0MCk7XG59XG5cbmZ1bmN0aW9uIHh5ejJyZ2IoeCkge1xuICByZXR1cm4gMjU1ICogKHggPD0gMC4wMDMxMzA4ID8gMTIuOTIgKiB4IDogMS4wNTUgKiBNYXRoLnBvdyh4LCAxIC8gMi40KSAtIDAuMDU1KTtcbn1cblxuZnVuY3Rpb24gcmdiMnh5eih4KSB7XG4gIHJldHVybiAoeCAvPSAyNTUpIDw9IDAuMDQwNDUgPyB4IC8gMTIuOTIgOiBNYXRoLnBvdygoeCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xufVxuXG5mdW5jdGlvbiBoY2xDb252ZXJ0KG8pIHtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIY2wpIHJldHVybiBuZXcgSGNsKG8uaCwgby5jLCBvLmwsIG8ub3BhY2l0eSk7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBMYWIpKSBvID0gbGFiQ29udmVydChvKTtcbiAgdmFyIGggPSBNYXRoLmF0YW4yKG8uYiwgby5hKSAqIHJhZDJkZWc7XG4gIHJldHVybiBuZXcgSGNsKGggPCAwID8gaCArIDM2MCA6IGgsIE1hdGguc3FydChvLmEgKiBvLmEgKyBvLmIgKiBvLmIpLCBvLmwsIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoY2woaCwgYywgbCwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IGhjbENvbnZlcnQoaCkgOiBuZXcgSGNsKGgsIGMsIGwsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhjbChoLCBjLCBsLCBvcGFjaXR5KSB7XG4gIHRoaXMuaCA9ICtoO1xuICB0aGlzLmMgPSArYztcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoSGNsLCBoY2wsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgSGNsKHRoaXMuaCwgdGhpcy5jLCB0aGlzLmwgKyBLbiAqIChrID09IG51bGwgPyAxIDogayksIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcjogZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgSGNsKHRoaXMuaCwgdGhpcy5jLCB0aGlzLmwgLSBLbiAqIChrID09IG51bGwgPyAxIDogayksIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGxhYkNvbnZlcnQodGhpcykucmdiKCk7XG4gIH1cbn0pKTtcbiIsImltcG9ydCBkZWZpbmUsIHtleHRlbmR9IGZyb20gXCIuL2RlZmluZVwiO1xuaW1wb3J0IHtDb2xvciwgcmdiQ29udmVydCwgUmdiLCBkYXJrZXIsIGJyaWdodGVyfSBmcm9tIFwiLi9jb2xvclwiO1xuaW1wb3J0IHtkZWcycmFkLCByYWQyZGVnfSBmcm9tIFwiLi9tYXRoXCI7XG5cbnZhciBBID0gLTAuMTQ4NjEsXG4gICAgQiA9ICsxLjc4Mjc3LFxuICAgIEMgPSAtMC4yOTIyNyxcbiAgICBEID0gLTAuOTA2NDksXG4gICAgRSA9ICsxLjk3Mjk0LFxuICAgIEVEID0gRSAqIEQsXG4gICAgRUIgPSBFICogQixcbiAgICBCQ19EQSA9IEIgKiBDIC0gRCAqIEE7XG5cbmZ1bmN0aW9uIGN1YmVoZWxpeENvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIEN1YmVoZWxpeCkgcmV0dXJuIG5ldyBDdWJlaGVsaXgoby5oLCBvLnMsIG8ubCwgby5vcGFjaXR5KTtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIFJnYikpIG8gPSByZ2JDb252ZXJ0KG8pO1xuICB2YXIgciA9IG8uciAvIDI1NSxcbiAgICAgIGcgPSBvLmcgLyAyNTUsXG4gICAgICBiID0gby5iIC8gMjU1LFxuICAgICAgbCA9IChCQ19EQSAqIGIgKyBFRCAqIHIgLSBFQiAqIGcpIC8gKEJDX0RBICsgRUQgLSBFQiksXG4gICAgICBibCA9IGIgLSBsLFxuICAgICAgayA9IChFICogKGcgLSBsKSAtIEMgKiBibCkgLyBELFxuICAgICAgcyA9IE1hdGguc3FydChrICogayArIGJsICogYmwpIC8gKEUgKiBsICogKDEgLSBsKSksIC8vIE5hTiBpZiBsPTAgb3IgbD0xXG4gICAgICBoID0gcyA/IE1hdGguYXRhbjIoaywgYmwpICogcmFkMmRlZyAtIDEyMCA6IE5hTjtcbiAgcmV0dXJuIG5ldyBDdWJlaGVsaXgoaCA8IDAgPyBoICsgMzYwIDogaCwgcywgbCwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3ViZWhlbGl4KGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBjdWJlaGVsaXhDb252ZXJ0KGgpIDogbmV3IEN1YmVoZWxpeChoLCBzLCBsLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDdWJlaGVsaXgoaCwgcywgbCwgb3BhY2l0eSkge1xuICB0aGlzLmggPSAraDtcbiAgdGhpcy5zID0gK3M7XG4gIHRoaXMubCA9ICtsO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKEN1YmVoZWxpeCwgY3ViZWhlbGl4LCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXI6IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoID0gaXNOYU4odGhpcy5oKSA/IDAgOiAodGhpcy5oICsgMTIwKSAqIGRlZzJyYWQsXG4gICAgICAgIGwgPSArdGhpcy5sLFxuICAgICAgICBhID0gaXNOYU4odGhpcy5zKSA/IDAgOiB0aGlzLnMgKiBsICogKDEgLSBsKSxcbiAgICAgICAgY29zaCA9IE1hdGguY29zKGgpLFxuICAgICAgICBzaW5oID0gTWF0aC5zaW4oaCk7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICAyNTUgKiAobCArIGEgKiAoQSAqIGNvc2ggKyBCICogc2luaCkpLFxuICAgICAgMjU1ICogKGwgKyBhICogKEMgKiBjb3NoICsgRCAqIHNpbmgpKSxcbiAgICAgIDI1NSAqIChsICsgYSAqIChFICogY29zaCkpLFxuICAgICAgdGhpcy5vcGFjaXR5XG4gICAgKTtcbiAgfVxufSkpO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCJpbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnRcIjtcblxuZnVuY3Rpb24gbGluZWFyKGEsIGQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gYSArIHQgKiBkO1xuICB9O1xufVxuXG5mdW5jdGlvbiBleHBvbmVudGlhbChhLCBiLCB5KSB7XG4gIHJldHVybiBhID0gTWF0aC5wb3coYSwgeSksIGIgPSBNYXRoLnBvdyhiLCB5KSAtIGEsIHkgPSAxIC8geSwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBNYXRoLnBvdyhhICsgdCAqIGIsIHkpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHVlKGEsIGIpIHtcbiAgdmFyIGQgPSBiIC0gYTtcbiAgcmV0dXJuIGQgPyBsaW5lYXIoYSwgZCA+IDE4MCB8fCBkIDwgLTE4MCA/IGQgLSAzNjAgKiBNYXRoLnJvdW5kKGQgLyAzNjApIDogZCkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdhbW1hKHkpIHtcbiAgcmV0dXJuICh5ID0gK3kpID09PSAxID8gbm9nYW1tYSA6IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYiAtIGEgPyBleHBvbmVudGlhbChhLCBiLCB5KSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub2dhbW1hKGEsIGIpIHtcbiAgdmFyIGQgPSBiIC0gYTtcbiAgcmV0dXJuIGQgPyBsaW5lYXIoYSwgZCkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbn1cbiIsImltcG9ydCB7cmdiIGFzIGNvbG9yUmdifSBmcm9tIFwiZDMtY29sb3JcIjtcbmltcG9ydCBiYXNpcyBmcm9tIFwiLi9iYXNpc1wiO1xuaW1wb3J0IGJhc2lzQ2xvc2VkIGZyb20gXCIuL2Jhc2lzQ2xvc2VkXCI7XG5pbXBvcnQge2dhbW1hfSBmcm9tIFwiLi9jb2xvclwiO1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gcmdiR2FtbWEoeSkge1xuICB2YXIgY29sb3IgPSBnYW1tYSh5KTtcblxuICBmdW5jdGlvbiByZ2Ioc3RhcnQsIGVuZCkge1xuICAgIHZhciByID0gY29sb3IoKHN0YXJ0ID0gY29sb3JSZ2Ioc3RhcnQpKS5yLCAoZW5kID0gY29sb3JSZ2IoZW5kKSkuciksXG4gICAgICAgIGcgPSBjb2xvcihzdGFydC5nLCBlbmQuZyksXG4gICAgICAgIGIgPSBjb2xvcihzdGFydC5iLCBlbmQuYiksXG4gICAgICAgIG9wYWNpdHkgPSBjb2xvcihzdGFydC5vcGFjaXR5LCBlbmQub3BhY2l0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHN0YXJ0LnIgPSByKHQpO1xuICAgICAgc3RhcnQuZyA9IGcodCk7XG4gICAgICBzdGFydC5iID0gYih0KTtcbiAgICAgIHN0YXJ0Lm9wYWNpdHkgPSBvcGFjaXR5KHQpO1xuICAgICAgcmV0dXJuIHN0YXJ0ICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgcmdiLmdhbW1hID0gcmdiR2FtbWE7XG5cbiAgcmV0dXJuIHJnYjtcbn0pKDEpO1xuXG5mdW5jdGlvbiByZ2JTcGxpbmUoc3BsaW5lKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xvcnMpIHtcbiAgICB2YXIgbiA9IGNvbG9ycy5sZW5ndGgsXG4gICAgICAgIHIgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGcgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGIgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGksIGNvbG9yO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGNvbG9yID0gY29sb3JSZ2IoY29sb3JzW2ldKTtcbiAgICAgIHJbaV0gPSBjb2xvci5yIHx8IDA7XG4gICAgICBnW2ldID0gY29sb3IuZyB8fCAwO1xuICAgICAgYltpXSA9IGNvbG9yLmIgfHwgMDtcbiAgICB9XG4gICAgciA9IHNwbGluZShyKTtcbiAgICBnID0gc3BsaW5lKGcpO1xuICAgIGIgPSBzcGxpbmUoYik7XG4gICAgY29sb3Iub3BhY2l0eSA9IDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGNvbG9yLnIgPSByKHQpO1xuICAgICAgY29sb3IuZyA9IGcodCk7XG4gICAgICBjb2xvci5iID0gYih0KTtcbiAgICAgIHJldHVybiBjb2xvciArIFwiXCI7XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IHZhciByZ2JCYXNpcyA9IHJnYlNwbGluZShiYXNpcyk7XG5leHBvcnQgdmFyIHJnYkJhc2lzQ2xvc2VkID0gcmdiU3BsaW5lKGJhc2lzQ2xvc2VkKTtcbiIsImltcG9ydCB2YWx1ZSBmcm9tIFwiLi92YWx1ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBuYiA9IGIgPyBiLmxlbmd0aCA6IDAsXG4gICAgICBuYSA9IGEgPyBNYXRoLm1pbihuYiwgYS5sZW5ndGgpIDogMCxcbiAgICAgIHggPSBuZXcgQXJyYXkobmIpLFxuICAgICAgYyA9IG5ldyBBcnJheShuYiksXG4gICAgICBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBuYTsgKytpKSB4W2ldID0gdmFsdWUoYVtpXSwgYltpXSk7XG4gIGZvciAoOyBpIDwgbmI7ICsraSkgY1tpXSA9IGJbaV07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbmE7ICsraSkgY1tpXSA9IHhbaV0odCk7XG4gICAgcmV0dXJuIGM7XG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhID0gK2EsIGIgLT0gYSwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICsgYiAqIHQ7XG4gIH07XG59XG4iLCJpbXBvcnQgdmFsdWUgZnJvbSBcIi4vdmFsdWVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICB2YXIgaSA9IHt9LFxuICAgICAgYyA9IHt9LFxuICAgICAgaztcblxuICBpZiAoYSA9PT0gbnVsbCB8fCB0eXBlb2YgYSAhPT0gXCJvYmplY3RcIikgYSA9IHt9O1xuICBpZiAoYiA9PT0gbnVsbCB8fCB0eXBlb2YgYiAhPT0gXCJvYmplY3RcIikgYiA9IHt9O1xuXG4gIGZvciAoayBpbiBiKSB7XG4gICAgaWYgKGsgaW4gYSkge1xuICAgICAgaVtrXSA9IHZhbHVlKGFba10sIGJba10pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjW2tdID0gYltrXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIGZvciAoayBpbiBpKSBjW2tdID0gaVtrXSh0KTtcbiAgICByZXR1cm4gYztcbiAgfTtcbn1cbiIsImltcG9ydCBudW1iZXIgZnJvbSBcIi4vbnVtYmVyXCI7XG5cbnZhciByZUEgPSAvWy0rXT8oPzpcXGQrXFwuP1xcZCp8XFwuP1xcZCspKD86W2VFXVstK10/XFxkKyk/L2csXG4gICAgcmVCID0gbmV3IFJlZ0V4cChyZUEuc291cmNlLCBcImdcIik7XG5cbmZ1bmN0aW9uIHplcm8oYikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGI7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uZShiKSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGIodCkgKyBcIlwiO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBiaSA9IHJlQS5sYXN0SW5kZXggPSByZUIubGFzdEluZGV4ID0gMCwgLy8gc2NhbiBpbmRleCBmb3IgbmV4dCBudW1iZXIgaW4gYlxuICAgICAgYW0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYVxuICAgICAgYm0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYlxuICAgICAgYnMsIC8vIHN0cmluZyBwcmVjZWRpbmcgY3VycmVudCBudW1iZXIgaW4gYiwgaWYgYW55XG4gICAgICBpID0gLTEsIC8vIGluZGV4IGluIHNcbiAgICAgIHMgPSBbXSwgLy8gc3RyaW5nIGNvbnN0YW50cyBhbmQgcGxhY2Vob2xkZXJzXG4gICAgICBxID0gW107IC8vIG51bWJlciBpbnRlcnBvbGF0b3JzXG5cbiAgLy8gQ29lcmNlIGlucHV0cyB0byBzdHJpbmdzLlxuICBhID0gYSArIFwiXCIsIGIgPSBiICsgXCJcIjtcblxuICAvLyBJbnRlcnBvbGF0ZSBwYWlycyBvZiBudW1iZXJzIGluIGEgJiBiLlxuICB3aGlsZSAoKGFtID0gcmVBLmV4ZWMoYSkpXG4gICAgICAmJiAoYm0gPSByZUIuZXhlYyhiKSkpIHtcbiAgICBpZiAoKGJzID0gYm0uaW5kZXgpID4gYmkpIHsgLy8gYSBzdHJpbmcgcHJlY2VkZXMgdGhlIG5leHQgbnVtYmVyIGluIGJcbiAgICAgIGJzID0gYi5zbGljZShiaSwgYnMpO1xuICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICBlbHNlIHNbKytpXSA9IGJzO1xuICAgIH1cbiAgICBpZiAoKGFtID0gYW1bMF0pID09PSAoYm0gPSBibVswXSkpIHsgLy8gbnVtYmVycyBpbiBhICYgYiBtYXRjaFxuICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYm07IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICBlbHNlIHNbKytpXSA9IGJtO1xuICAgIH0gZWxzZSB7IC8vIGludGVycG9sYXRlIG5vbi1tYXRjaGluZyBudW1iZXJzXG4gICAgICBzWysraV0gPSBudWxsO1xuICAgICAgcS5wdXNoKHtpOiBpLCB4OiBudW1iZXIoYW0sIGJtKX0pO1xuICAgIH1cbiAgICBiaSA9IHJlQi5sYXN0SW5kZXg7XG4gIH1cblxuICAvLyBBZGQgcmVtYWlucyBvZiBiLlxuICBpZiAoYmkgPCBiLmxlbmd0aCkge1xuICAgIGJzID0gYi5zbGljZShiaSk7XG4gICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgZWxzZSBzWysraV0gPSBicztcbiAgfVxuXG4gIC8vIFNwZWNpYWwgb3B0aW1pemF0aW9uIGZvciBvbmx5IGEgc2luZ2xlIG1hdGNoLlxuICAvLyBPdGhlcndpc2UsIGludGVycG9sYXRlIGVhY2ggb2YgdGhlIG51bWJlcnMgYW5kIHJlam9pbiB0aGUgc3RyaW5nLlxuICByZXR1cm4gcy5sZW5ndGggPCAyID8gKHFbMF1cbiAgICAgID8gb25lKHFbMF0ueClcbiAgICAgIDogemVybyhiKSlcbiAgICAgIDogKGIgPSBxLmxlbmd0aCwgZnVuY3Rpb24odCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBvOyBpIDwgYjsgKytpKSBzWyhvID0gcVtpXSkuaV0gPSBvLngodCk7XG4gICAgICAgICAgcmV0dXJuIHMuam9pbihcIlwiKTtcbiAgICAgICAgfSk7XG59XG4iLCJpbXBvcnQge2NvbG9yfSBmcm9tIFwiZDMtY29sb3JcIjtcbmltcG9ydCByZ2IgZnJvbSBcIi4vcmdiXCI7XG5pbXBvcnQgYXJyYXkgZnJvbSBcIi4vYXJyYXlcIjtcbmltcG9ydCBudW1iZXIgZnJvbSBcIi4vbnVtYmVyXCI7XG5pbXBvcnQgb2JqZWN0IGZyb20gXCIuL29iamVjdFwiO1xuaW1wb3J0IHN0cmluZyBmcm9tIFwiLi9zdHJpbmdcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciB0ID0gdHlwZW9mIGIsIGM7XG4gIHJldHVybiBiID09IG51bGwgfHwgdCA9PT0gXCJib29sZWFuXCIgPyBjb25zdGFudChiKVxuICAgICAgOiAodCA9PT0gXCJudW1iZXJcIiA/IG51bWJlclxuICAgICAgOiB0ID09PSBcInN0cmluZ1wiID8gKChjID0gY29sb3IoYikpID8gKGIgPSBjLCByZ2IpIDogc3RyaW5nKVxuICAgICAgOiBiIGluc3RhbmNlb2YgY29sb3IgPyByZ2JcbiAgICAgIDogQXJyYXkuaXNBcnJheShiKSA/IGFycmF5XG4gICAgICA6IG9iamVjdCkoYSwgYik7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhID0gK2EsIGIgLT0gYSwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGEgKyBiICogdCk7XG4gIH07XG59XG4iLCJpbXBvcnQge2N1YmVoZWxpeCBhcyBjb2xvckN1YmVoZWxpeH0gZnJvbSBcImQzLWNvbG9yXCI7XG5pbXBvcnQgY29sb3IsIHtodWV9IGZyb20gXCIuL2NvbG9yXCI7XG5cbmZ1bmN0aW9uIGN1YmVoZWxpeChodWUpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBjdWJlaGVsaXhHYW1tYSh5KSB7XG4gICAgeSA9ICt5O1xuXG4gICAgZnVuY3Rpb24gY3ViZWhlbGl4KHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBoID0gaHVlKChzdGFydCA9IGNvbG9yQ3ViZWhlbGl4KHN0YXJ0KSkuaCwgKGVuZCA9IGNvbG9yQ3ViZWhlbGl4KGVuZCkpLmgpLFxuICAgICAgICAgIHMgPSBjb2xvcihzdGFydC5zLCBlbmQucyksXG4gICAgICAgICAgbCA9IGNvbG9yKHN0YXJ0LmwsIGVuZC5sKSxcbiAgICAgICAgICBvcGFjaXR5ID0gY29sb3Ioc3RhcnQub3BhY2l0eSwgZW5kLm9wYWNpdHkpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgc3RhcnQuaCA9IGgodCk7XG4gICAgICAgIHN0YXJ0LnMgPSBzKHQpO1xuICAgICAgICBzdGFydC5sID0gbChNYXRoLnBvdyh0LCB5KSk7XG4gICAgICAgIHN0YXJ0Lm9wYWNpdHkgPSBvcGFjaXR5KHQpO1xuICAgICAgICByZXR1cm4gc3RhcnQgKyBcIlwiO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBjdWJlaGVsaXguZ2FtbWEgPSBjdWJlaGVsaXhHYW1tYTtcblxuICAgIHJldHVybiBjdWJlaGVsaXg7XG4gIH0pKDEpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjdWJlaGVsaXgoaHVlKTtcbmV4cG9ydCB2YXIgY3ViZWhlbGl4TG9uZyA9IGN1YmVoZWxpeChjb2xvcik7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuICt4O1xufVxuIiwiaW1wb3J0IHtiaXNlY3R9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtpbnRlcnBvbGF0ZSBhcyBpbnRlcnBvbGF0ZVZhbHVlLCBpbnRlcnBvbGF0ZVJvdW5kfSBmcm9tIFwiZDMtaW50ZXJwb2xhdGVcIjtcbmltcG9ydCB7bWFwLCBzbGljZX0gZnJvbSBcIi4vYXJyYXlcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudFwiO1xuaW1wb3J0IG51bWJlciBmcm9tIFwiLi9udW1iZXJcIjtcblxudmFyIHVuaXQgPSBbMCwgMV07XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWludGVycG9sYXRlTGluZWFyKGEsIGIpIHtcbiAgcmV0dXJuIChiIC09IChhID0gK2EpKVxuICAgICAgPyBmdW5jdGlvbih4KSB7IHJldHVybiAoeCAtIGEpIC8gYjsgfVxuICAgICAgOiBjb25zdGFudChiKTtcbn1cblxuZnVuY3Rpb24gZGVpbnRlcnBvbGF0ZUNsYW1wKGRlaW50ZXJwb2xhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgZCA9IGRlaW50ZXJwb2xhdGUoYSA9ICthLCBiID0gK2IpO1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7IHJldHVybiB4IDw9IGEgPyAwIDogeCA+PSBiID8gMSA6IGQoeCk7IH07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlaW50ZXJwb2xhdGVDbGFtcChyZWludGVycG9sYXRlKSB7XG4gIHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHIgPSByZWludGVycG9sYXRlKGEgPSArYSwgYiA9ICtiKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkgeyByZXR1cm4gdCA8PSAwID8gYSA6IHQgPj0gMSA/IGIgOiByKHQpOyB9O1xuICB9O1xufVxuXG5mdW5jdGlvbiBiaW1hcChkb21haW4sIHJhbmdlLCBkZWludGVycG9sYXRlLCByZWludGVycG9sYXRlKSB7XG4gIHZhciBkMCA9IGRvbWFpblswXSwgZDEgPSBkb21haW5bMV0sIHIwID0gcmFuZ2VbMF0sIHIxID0gcmFuZ2VbMV07XG4gIGlmIChkMSA8IGQwKSBkMCA9IGRlaW50ZXJwb2xhdGUoZDEsIGQwKSwgcjAgPSByZWludGVycG9sYXRlKHIxLCByMCk7XG4gIGVsc2UgZDAgPSBkZWludGVycG9sYXRlKGQwLCBkMSksIHIwID0gcmVpbnRlcnBvbGF0ZShyMCwgcjEpO1xuICByZXR1cm4gZnVuY3Rpb24oeCkgeyByZXR1cm4gcjAoZDAoeCkpOyB9O1xufVxuXG5mdW5jdGlvbiBwb2x5bWFwKGRvbWFpbiwgcmFuZ2UsIGRlaW50ZXJwb2xhdGUsIHJlaW50ZXJwb2xhdGUpIHtcbiAgdmFyIGogPSBNYXRoLm1pbihkb21haW4ubGVuZ3RoLCByYW5nZS5sZW5ndGgpIC0gMSxcbiAgICAgIGQgPSBuZXcgQXJyYXkoaiksXG4gICAgICByID0gbmV3IEFycmF5KGopLFxuICAgICAgaSA9IC0xO1xuXG4gIC8vIFJldmVyc2UgZGVzY2VuZGluZyBkb21haW5zLlxuICBpZiAoZG9tYWluW2pdIDwgZG9tYWluWzBdKSB7XG4gICAgZG9tYWluID0gZG9tYWluLnNsaWNlKCkucmV2ZXJzZSgpO1xuICAgIHJhbmdlID0gcmFuZ2Uuc2xpY2UoKS5yZXZlcnNlKCk7XG4gIH1cblxuICB3aGlsZSAoKytpIDwgaikge1xuICAgIGRbaV0gPSBkZWludGVycG9sYXRlKGRvbWFpbltpXSwgZG9tYWluW2kgKyAxXSk7XG4gICAgcltpXSA9IHJlaW50ZXJwb2xhdGUocmFuZ2VbaV0sIHJhbmdlW2kgKyAxXSk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgIHZhciBpID0gYmlzZWN0KGRvbWFpbiwgeCwgMSwgaikgLSAxO1xuICAgIHJldHVybiByW2ldKGRbaV0oeCkpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weShzb3VyY2UsIHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0XG4gICAgICAuZG9tYWluKHNvdXJjZS5kb21haW4oKSlcbiAgICAgIC5yYW5nZShzb3VyY2UucmFuZ2UoKSlcbiAgICAgIC5pbnRlcnBvbGF0ZShzb3VyY2UuaW50ZXJwb2xhdGUoKSlcbiAgICAgIC5jbGFtcChzb3VyY2UuY2xhbXAoKSk7XG59XG5cbi8vIGRlaW50ZXJwb2xhdGUoYSwgYikoeCkgdGFrZXMgYSBkb21haW4gdmFsdWUgeCBpbiBbYSxiXSBhbmQgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBwYXJhbWV0ZXIgdCBpbiBbMCwxXS5cbi8vIHJlaW50ZXJwb2xhdGUoYSwgYikodCkgdGFrZXMgYSBwYXJhbWV0ZXIgdCBpbiBbMCwxXSBhbmQgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBkb21haW4gdmFsdWUgeCBpbiBbYSxiXS5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbnRpbnVvdXMoZGVpbnRlcnBvbGF0ZSwgcmVpbnRlcnBvbGF0ZSkge1xuICB2YXIgZG9tYWluID0gdW5pdCxcbiAgICAgIHJhbmdlID0gdW5pdCxcbiAgICAgIGludGVycG9sYXRlID0gaW50ZXJwb2xhdGVWYWx1ZSxcbiAgICAgIGNsYW1wID0gZmFsc2UsXG4gICAgICBwaWVjZXdpc2UsXG4gICAgICBvdXRwdXQsXG4gICAgICBpbnB1dDtcblxuICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgIHBpZWNld2lzZSA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlLmxlbmd0aCkgPiAyID8gcG9seW1hcCA6IGJpbWFwO1xuICAgIG91dHB1dCA9IGlucHV0ID0gbnVsbDtcbiAgICByZXR1cm4gc2NhbGU7XG4gIH1cblxuICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgcmV0dXJuIChvdXRwdXQgfHwgKG91dHB1dCA9IHBpZWNld2lzZShkb21haW4sIHJhbmdlLCBjbGFtcCA/IGRlaW50ZXJwb2xhdGVDbGFtcChkZWludGVycG9sYXRlKSA6IGRlaW50ZXJwb2xhdGUsIGludGVycG9sYXRlKSkpKCt4KTtcbiAgfVxuXG4gIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHkpIHtcbiAgICByZXR1cm4gKGlucHV0IHx8IChpbnB1dCA9IHBpZWNld2lzZShyYW5nZSwgZG9tYWluLCBkZWludGVycG9sYXRlTGluZWFyLCBjbGFtcCA/IHJlaW50ZXJwb2xhdGVDbGFtcChyZWludGVycG9sYXRlKSA6IHJlaW50ZXJwb2xhdGUpKSkoK3kpO1xuICB9O1xuXG4gIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkb21haW4gPSBtYXAuY2FsbChfLCBudW1iZXIpLCByZXNjYWxlKCkpIDogZG9tYWluLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZ2UgPSBzbGljZS5jYWxsKF8pLCByZXNjYWxlKCkpIDogcmFuZ2Uuc2xpY2UoKTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZVJvdW5kID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiByYW5nZSA9IHNsaWNlLmNhbGwoXyksIGludGVycG9sYXRlID0gaW50ZXJwb2xhdGVSb3VuZCwgcmVzY2FsZSgpO1xuICB9O1xuXG4gIHNjYWxlLmNsYW1wID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsYW1wID0gISFfLCByZXNjYWxlKCkpIDogY2xhbXA7XG4gIH07XG5cbiAgc2NhbGUuaW50ZXJwb2xhdGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaW50ZXJwb2xhdGUgPSBfLCByZXNjYWxlKCkpIDogaW50ZXJwb2xhdGU7XG4gIH07XG5cbiAgcmV0dXJuIHJlc2NhbGUoKTtcbn1cbiIsIi8vIENvbXB1dGVzIHRoZSBkZWNpbWFsIGNvZWZmaWNpZW50IGFuZCBleHBvbmVudCBvZiB0aGUgc3BlY2lmaWVkIG51bWJlciB4IHdpdGhcbi8vIHNpZ25pZmljYW50IGRpZ2l0cyBwLCB3aGVyZSB4IGlzIHBvc2l0aXZlIGFuZCBwIGlzIGluIFsxLCAyMV0gb3IgdW5kZWZpbmVkLlxuLy8gRm9yIGV4YW1wbGUsIGZvcm1hdERlY2ltYWwoMS4yMykgcmV0dXJucyBbXCIxMjNcIiwgMF0uXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4LCBwKSB7XG4gIGlmICgoaSA9ICh4ID0gcCA/IHgudG9FeHBvbmVudGlhbChwIC0gMSkgOiB4LnRvRXhwb25lbnRpYWwoKSkuaW5kZXhPZihcImVcIikpIDwgMCkgcmV0dXJuIG51bGw7IC8vIE5hTiwgwrFJbmZpbml0eVxuICB2YXIgaSwgY29lZmZpY2llbnQgPSB4LnNsaWNlKDAsIGkpO1xuXG4gIC8vIFRoZSBzdHJpbmcgcmV0dXJuZWQgYnkgdG9FeHBvbmVudGlhbCBlaXRoZXIgaGFzIHRoZSBmb3JtIFxcZFxcLlxcZCtlWy0rXVxcZCtcbiAgLy8gKGUuZy4sIDEuMmUrMykgb3IgdGhlIGZvcm0gXFxkZVstK11cXGQrIChlLmcuLCAxZSszKS5cbiAgcmV0dXJuIFtcbiAgICBjb2VmZmljaWVudC5sZW5ndGggPiAxID8gY29lZmZpY2llbnRbMF0gKyBjb2VmZmljaWVudC5zbGljZSgyKSA6IGNvZWZmaWNpZW50LFxuICAgICt4LnNsaWNlKGkgKyAxKVxuICBdO1xufVxuIiwiaW1wb3J0IGZvcm1hdERlY2ltYWwgZnJvbSBcIi4vZm9ybWF0RGVjaW1hbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ID0gZm9ybWF0RGVjaW1hbChNYXRoLmFicyh4KSksIHggPyB4WzFdIDogTmFOO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZ3JvdXBpbmcsIHRob3VzYW5kcykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIHdpZHRoKSB7XG4gICAgdmFyIGkgPSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgIHQgPSBbXSxcbiAgICAgICAgaiA9IDAsXG4gICAgICAgIGcgPSBncm91cGluZ1swXSxcbiAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgIHdoaWxlIChpID4gMCAmJiBnID4gMCkge1xuICAgICAgaWYgKGxlbmd0aCArIGcgKyAxID4gd2lkdGgpIGcgPSBNYXRoLm1heCgxLCB3aWR0aCAtIGxlbmd0aCk7XG4gICAgICB0LnB1c2godmFsdWUuc3Vic3RyaW5nKGkgLT0gZywgaSArIGcpKTtcbiAgICAgIGlmICgobGVuZ3RoICs9IGcgKyAxKSA+IHdpZHRoKSBicmVhaztcbiAgICAgIGcgPSBncm91cGluZ1tqID0gKGogKyAxKSAlIGdyb3VwaW5nLmxlbmd0aF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHQucmV2ZXJzZSgpLmpvaW4odGhvdXNhbmRzKTtcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgsIHApIHtcbiAgeCA9IHgudG9QcmVjaXNpb24ocCk7XG5cbiAgb3V0OiBmb3IgKHZhciBuID0geC5sZW5ndGgsIGkgPSAxLCBpMCA9IC0xLCBpMTsgaSA8IG47ICsraSkge1xuICAgIHN3aXRjaCAoeFtpXSkge1xuICAgICAgY2FzZSBcIi5cIjogaTAgPSBpMSA9IGk7IGJyZWFrO1xuICAgICAgY2FzZSBcIjBcIjogaWYgKGkwID09PSAwKSBpMCA9IGk7IGkxID0gaTsgYnJlYWs7XG4gICAgICBjYXNlIFwiZVwiOiBicmVhayBvdXQ7XG4gICAgICBkZWZhdWx0OiBpZiAoaTAgPiAwKSBpMCA9IDA7IGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpMCA+IDAgPyB4LnNsaWNlKDAsIGkwKSArIHguc2xpY2UoaTEgKyAxKSA6IHg7XG59XG4iLCJpbXBvcnQgZm9ybWF0RGVjaW1hbCBmcm9tIFwiLi9mb3JtYXREZWNpbWFsXCI7XG5cbmV4cG9ydCB2YXIgcHJlZml4RXhwb25lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgsIHApIHtcbiAgdmFyIGQgPSBmb3JtYXREZWNpbWFsKHgsIHApO1xuICBpZiAoIWQpIHJldHVybiB4ICsgXCJcIjtcbiAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgIGV4cG9uZW50ID0gZFsxXSxcbiAgICAgIGkgPSBleHBvbmVudCAtIChwcmVmaXhFeHBvbmVudCA9IE1hdGgubWF4KC04LCBNYXRoLm1pbig4LCBNYXRoLmZsb29yKGV4cG9uZW50IC8gMykpKSAqIDMpICsgMSxcbiAgICAgIG4gPSBjb2VmZmljaWVudC5sZW5ndGg7XG4gIHJldHVybiBpID09PSBuID8gY29lZmZpY2llbnRcbiAgICAgIDogaSA+IG4gPyBjb2VmZmljaWVudCArIG5ldyBBcnJheShpIC0gbiArIDEpLmpvaW4oXCIwXCIpXG4gICAgICA6IGkgPiAwID8gY29lZmZpY2llbnQuc2xpY2UoMCwgaSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGkpXG4gICAgICA6IFwiMC5cIiArIG5ldyBBcnJheSgxIC0gaSkuam9pbihcIjBcIikgKyBmb3JtYXREZWNpbWFsKHgsIE1hdGgubWF4KDAsIHAgKyBpIC0gMSkpWzBdOyAvLyBsZXNzIHRoYW4gMXkhXG59XG4iLCJpbXBvcnQgZm9ybWF0RGVjaW1hbCBmcm9tIFwiLi9mb3JtYXREZWNpbWFsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgsIHApIHtcbiAgdmFyIGQgPSBmb3JtYXREZWNpbWFsKHgsIHApO1xuICBpZiAoIWQpIHJldHVybiB4ICsgXCJcIjtcbiAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgIGV4cG9uZW50ID0gZFsxXTtcbiAgcmV0dXJuIGV4cG9uZW50IDwgMCA/IFwiMC5cIiArIG5ldyBBcnJheSgtZXhwb25lbnQpLmpvaW4oXCIwXCIpICsgY29lZmZpY2llbnRcbiAgICAgIDogY29lZmZpY2llbnQubGVuZ3RoID4gZXhwb25lbnQgKyAxID8gY29lZmZpY2llbnQuc2xpY2UoMCwgZXhwb25lbnQgKyAxKSArIFwiLlwiICsgY29lZmZpY2llbnQuc2xpY2UoZXhwb25lbnQgKyAxKVxuICAgICAgOiBjb2VmZmljaWVudCArIG5ldyBBcnJheShleHBvbmVudCAtIGNvZWZmaWNpZW50Lmxlbmd0aCArIDIpLmpvaW4oXCIwXCIpO1xufVxuIiwiaW1wb3J0IGZvcm1hdERlZmF1bHQgZnJvbSBcIi4vZm9ybWF0RGVmYXVsdFwiO1xuaW1wb3J0IGZvcm1hdFByZWZpeEF1dG8gZnJvbSBcIi4vZm9ybWF0UHJlZml4QXV0b1wiO1xuaW1wb3J0IGZvcm1hdFJvdW5kZWQgZnJvbSBcIi4vZm9ybWF0Um91bmRlZFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIFwiXCI6IGZvcm1hdERlZmF1bHQsXG4gIFwiJVwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiAoeCAqIDEwMCkudG9GaXhlZChwKTsgfSxcbiAgXCJiXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMik7IH0sXG4gIFwiY1wiOiBmdW5jdGlvbih4KSB7IHJldHVybiB4ICsgXCJcIjsgfSxcbiAgXCJkXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTApOyB9LFxuICBcImVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b0V4cG9uZW50aWFsKHApOyB9LFxuICBcImZcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b0ZpeGVkKHApOyB9LFxuICBcImdcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b1ByZWNpc2lvbihwKTsgfSxcbiAgXCJvXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoOCk7IH0sXG4gIFwicFwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiBmb3JtYXRSb3VuZGVkKHggKiAxMDAsIHApOyB9LFxuICBcInJcIjogZm9ybWF0Um91bmRlZCxcbiAgXCJzXCI6IGZvcm1hdFByZWZpeEF1dG8sXG4gIFwiWFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpOyB9LFxuICBcInhcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxNik7IH1cbn07XG4iLCJpbXBvcnQgZm9ybWF0VHlwZXMgZnJvbSBcIi4vZm9ybWF0VHlwZXNcIjtcblxuLy8gW1tmaWxsXWFsaWduXVtzaWduXVtzeW1ib2xdWzBdW3dpZHRoXVssXVsucHJlY2lzaW9uXVt0eXBlXVxudmFyIHJlID0gL14oPzooLik/KFs8Pj1eXSkpPyhbK1xcLVxcKCBdKT8oWyQjXSk/KDApPyhcXGQrKT8oLCk/KFxcLlxcZCspPyhbYS16JV0pPyQvaTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gIHJldHVybiBuZXcgRm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcik7XG59XG5cbmZ1bmN0aW9uIEZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpIHtcbiAgaWYgKCEobWF0Y2ggPSByZS5leGVjKHNwZWNpZmllcikpKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGZvcm1hdDogXCIgKyBzcGVjaWZpZXIpO1xuXG4gIHZhciBtYXRjaCxcbiAgICAgIGZpbGwgPSBtYXRjaFsxXSB8fCBcIiBcIixcbiAgICAgIGFsaWduID0gbWF0Y2hbMl0gfHwgXCI+XCIsXG4gICAgICBzaWduID0gbWF0Y2hbM10gfHwgXCItXCIsXG4gICAgICBzeW1ib2wgPSBtYXRjaFs0XSB8fCBcIlwiLFxuICAgICAgemVybyA9ICEhbWF0Y2hbNV0sXG4gICAgICB3aWR0aCA9IG1hdGNoWzZdICYmICttYXRjaFs2XSxcbiAgICAgIGNvbW1hID0gISFtYXRjaFs3XSxcbiAgICAgIHByZWNpc2lvbiA9IG1hdGNoWzhdICYmICttYXRjaFs4XS5zbGljZSgxKSxcbiAgICAgIHR5cGUgPSBtYXRjaFs5XSB8fCBcIlwiO1xuXG4gIC8vIFRoZSBcIm5cIiB0eXBlIGlzIGFuIGFsaWFzIGZvciBcIixnXCIuXG4gIGlmICh0eXBlID09PSBcIm5cIikgY29tbWEgPSB0cnVlLCB0eXBlID0gXCJnXCI7XG5cbiAgLy8gTWFwIGludmFsaWQgdHlwZXMgdG8gdGhlIGRlZmF1bHQgZm9ybWF0LlxuICBlbHNlIGlmICghZm9ybWF0VHlwZXNbdHlwZV0pIHR5cGUgPSBcIlwiO1xuXG4gIC8vIElmIHplcm8gZmlsbCBpcyBzcGVjaWZpZWQsIHBhZGRpbmcgZ29lcyBhZnRlciBzaWduIGFuZCBiZWZvcmUgZGlnaXRzLlxuICBpZiAoemVybyB8fCAoZmlsbCA9PT0gXCIwXCIgJiYgYWxpZ24gPT09IFwiPVwiKSkgemVybyA9IHRydWUsIGZpbGwgPSBcIjBcIiwgYWxpZ24gPSBcIj1cIjtcblxuICB0aGlzLmZpbGwgPSBmaWxsO1xuICB0aGlzLmFsaWduID0gYWxpZ247XG4gIHRoaXMuc2lnbiA9IHNpZ247XG4gIHRoaXMuc3ltYm9sID0gc3ltYm9sO1xuICB0aGlzLnplcm8gPSB6ZXJvO1xuICB0aGlzLndpZHRoID0gd2lkdGg7XG4gIHRoaXMuY29tbWEgPSBjb21tYTtcbiAgdGhpcy5wcmVjaXNpb24gPSBwcmVjaXNpb247XG4gIHRoaXMudHlwZSA9IHR5cGU7XG59XG5cbkZvcm1hdFNwZWNpZmllci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZmlsbFxuICAgICAgKyB0aGlzLmFsaWduXG4gICAgICArIHRoaXMuc2lnblxuICAgICAgKyB0aGlzLnN5bWJvbFxuICAgICAgKyAodGhpcy56ZXJvID8gXCIwXCIgOiBcIlwiKVxuICAgICAgKyAodGhpcy53aWR0aCA9PSBudWxsID8gXCJcIiA6IE1hdGgubWF4KDEsIHRoaXMud2lkdGggfCAwKSlcbiAgICAgICsgKHRoaXMuY29tbWEgPyBcIixcIiA6IFwiXCIpXG4gICAgICArICh0aGlzLnByZWNpc2lvbiA9PSBudWxsID8gXCJcIiA6IFwiLlwiICsgTWF0aC5tYXgoMCwgdGhpcy5wcmVjaXNpb24gfCAwKSlcbiAgICAgICsgdGhpcy50eXBlO1xufTtcbiIsImltcG9ydCBleHBvbmVudCBmcm9tIFwiLi9leHBvbmVudFwiO1xuaW1wb3J0IGZvcm1hdEdyb3VwIGZyb20gXCIuL2Zvcm1hdEdyb3VwXCI7XG5pbXBvcnQgZm9ybWF0U3BlY2lmaWVyIGZyb20gXCIuL2Zvcm1hdFNwZWNpZmllclwiO1xuaW1wb3J0IGZvcm1hdFR5cGVzIGZyb20gXCIuL2Zvcm1hdFR5cGVzXCI7XG5pbXBvcnQge3ByZWZpeEV4cG9uZW50fSBmcm9tIFwiLi9mb3JtYXRQcmVmaXhBdXRvXCI7XG5cbnZhciBwcmVmaXhlcyA9IFtcInlcIixcInpcIixcImFcIixcImZcIixcInBcIixcIm5cIixcIsK1XCIsXCJtXCIsXCJcIixcImtcIixcIk1cIixcIkdcIixcIlRcIixcIlBcIixcIkVcIixcIlpcIixcIllcIl07XG5cbmZ1bmN0aW9uIGlkZW50aXR5KHgpIHtcbiAgcmV0dXJuIHg7XG59XG5cbnZhciBkZWZhdWx0TG9jYWxlID0gZm9ybWF0TG9jYWxlKHtcbiAgZGVjaW1hbDogXCIuXCIsXG4gIHRob3VzYW5kczogXCIsXCIsXG4gIGdyb3VwaW5nOiBbM10sXG4gIGN1cnJlbmN5OiBbXCIkXCIsIFwiXCJdXG59KTtcblxuZXhwb3J0IHZhciBmb3JtYXQgPSBkZWZhdWx0TG9jYWxlLmZvcm1hdDtcbmV4cG9ydCB2YXIgZm9ybWF0UHJlZml4ID0gZGVmYXVsdExvY2FsZS5mb3JtYXRQcmVmaXg7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZvcm1hdExvY2FsZShsb2NhbGUpIHtcbiAgdmFyIGdyb3VwID0gbG9jYWxlLmdyb3VwaW5nICYmIGxvY2FsZS50aG91c2FuZHMgPyBmb3JtYXRHcm91cChsb2NhbGUuZ3JvdXBpbmcsIGxvY2FsZS50aG91c2FuZHMpIDogaWRlbnRpdHksXG4gICAgICBjdXJyZW5jeSA9IGxvY2FsZS5jdXJyZW5jeSxcbiAgICAgIGRlY2ltYWwgPSBsb2NhbGUuZGVjaW1hbDtcblxuICBmdW5jdGlvbiBuZXdGb3JtYXQoc3BlY2lmaWVyKSB7XG4gICAgc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcik7XG5cbiAgICB2YXIgZmlsbCA9IHNwZWNpZmllci5maWxsLFxuICAgICAgICBhbGlnbiA9IHNwZWNpZmllci5hbGlnbixcbiAgICAgICAgc2lnbiA9IHNwZWNpZmllci5zaWduLFxuICAgICAgICBzeW1ib2wgPSBzcGVjaWZpZXIuc3ltYm9sLFxuICAgICAgICB6ZXJvID0gc3BlY2lmaWVyLnplcm8sXG4gICAgICAgIHdpZHRoID0gc3BlY2lmaWVyLndpZHRoLFxuICAgICAgICBjb21tYSA9IHNwZWNpZmllci5jb21tYSxcbiAgICAgICAgcHJlY2lzaW9uID0gc3BlY2lmaWVyLnByZWNpc2lvbixcbiAgICAgICAgdHlwZSA9IHNwZWNpZmllci50eXBlO1xuXG4gICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgLy8gRm9yIFNJLXByZWZpeCwgdGhlIHN1ZmZpeCBpcyBsYXppbHkgY29tcHV0ZWQuXG4gICAgdmFyIHByZWZpeCA9IHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVswXSA6IHN5bWJvbCA9PT0gXCIjXCIgJiYgL1tib3hYXS8udGVzdCh0eXBlKSA/IFwiMFwiICsgdHlwZS50b0xvd2VyQ2FzZSgpIDogXCJcIixcbiAgICAgICAgc3VmZml4ID0gc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5WzFdIDogL1slcF0vLnRlc3QodHlwZSkgPyBcIiVcIiA6IFwiXCI7XG5cbiAgICAvLyBXaGF0IGZvcm1hdCBmdW5jdGlvbiBzaG91bGQgd2UgdXNlP1xuICAgIC8vIElzIHRoaXMgYW4gaW50ZWdlciB0eXBlP1xuICAgIC8vIENhbiB0aGlzIHR5cGUgZ2VuZXJhdGUgZXhwb25lbnRpYWwgbm90YXRpb24/XG4gICAgdmFyIGZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlc1t0eXBlXSxcbiAgICAgICAgbWF5YmVTdWZmaXggPSAhdHlwZSB8fCAvW2RlZmdwcnMlXS8udGVzdCh0eXBlKTtcblxuICAgIC8vIFNldCB0aGUgZGVmYXVsdCBwcmVjaXNpb24gaWYgbm90IHNwZWNpZmllZCxcbiAgICAvLyBvciBjbGFtcCB0aGUgc3BlY2lmaWVkIHByZWNpc2lvbiB0byB0aGUgc3VwcG9ydGVkIHJhbmdlLlxuICAgIC8vIEZvciBzaWduaWZpY2FudCBwcmVjaXNpb24sIGl0IG11c3QgYmUgaW4gWzEsIDIxXS5cbiAgICAvLyBGb3IgZml4ZWQgcHJlY2lzaW9uLCBpdCBtdXN0IGJlIGluIFswLCAyMF0uXG4gICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uID09IG51bGwgPyAodHlwZSA/IDYgOiAxMilcbiAgICAgICAgOiAvW2dwcnNdLy50ZXN0KHR5cGUpID8gTWF0aC5tYXgoMSwgTWF0aC5taW4oMjEsIHByZWNpc2lvbikpXG4gICAgICAgIDogTWF0aC5tYXgoMCwgTWF0aC5taW4oMjAsIHByZWNpc2lvbikpO1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0KHZhbHVlKSB7XG4gICAgICB2YXIgdmFsdWVQcmVmaXggPSBwcmVmaXgsXG4gICAgICAgICAgdmFsdWVTdWZmaXggPSBzdWZmaXgsXG4gICAgICAgICAgaSwgbiwgYztcblxuICAgICAgaWYgKHR5cGUgPT09IFwiY1wiKSB7XG4gICAgICAgIHZhbHVlU3VmZml4ID0gZm9ybWF0VHlwZSh2YWx1ZSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSArdmFsdWU7XG5cbiAgICAgICAgLy8gQ29udmVydCBuZWdhdGl2ZSB0byBwb3NpdGl2ZSwgYW5kIGNvbXB1dGUgdGhlIHByZWZpeC5cbiAgICAgICAgLy8gTm90ZSB0aGF0IC0wIGlzIG5vdCBsZXNzIHRoYW4gMCwgYnV0IDEgLyAtMCBpcyFcbiAgICAgICAgdmFyIHZhbHVlTmVnYXRpdmUgPSAodmFsdWUgPCAwIHx8IDEgLyB2YWx1ZSA8IDApICYmICh2YWx1ZSAqPSAtMSwgdHJ1ZSk7XG5cbiAgICAgICAgLy8gUGVyZm9ybSB0aGUgaW5pdGlhbCBmb3JtYXR0aW5nLlxuICAgICAgICB2YWx1ZSA9IGZvcm1hdFR5cGUodmFsdWUsIHByZWNpc2lvbik7XG5cbiAgICAgICAgLy8gSWYgdGhlIG9yaWdpbmFsIHZhbHVlIHdhcyBuZWdhdGl2ZSwgaXQgbWF5IGJlIHJvdW5kZWQgdG8gemVybyBkdXJpbmdcbiAgICAgICAgLy8gZm9ybWF0dGluZzsgdHJlYXQgdGhpcyBhcyAocG9zaXRpdmUpIHplcm8uXG4gICAgICAgIGlmICh2YWx1ZU5lZ2F0aXZlKSB7XG4gICAgICAgICAgaSA9IC0xLCBuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgIHZhbHVlTmVnYXRpdmUgPSBmYWxzZTtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKGMgPSB2YWx1ZS5jaGFyQ29kZUF0KGkpLCAoNDggPCBjICYmIGMgPCA1OClcbiAgICAgICAgICAgICAgICB8fCAodHlwZSA9PT0gXCJ4XCIgJiYgOTYgPCBjICYmIGMgPCAxMDMpXG4gICAgICAgICAgICAgICAgfHwgKHR5cGUgPT09IFwiWFwiICYmIDY0IDwgYyAmJiBjIDwgNzEpKSB7XG4gICAgICAgICAgICAgIHZhbHVlTmVnYXRpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb21wdXRlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgICAgICAgdmFsdWVQcmVmaXggPSAodmFsdWVOZWdhdGl2ZSA/IChzaWduID09PSBcIihcIiA/IHNpZ24gOiBcIi1cIikgOiBzaWduID09PSBcIi1cIiB8fCBzaWduID09PSBcIihcIiA/IFwiXCIgOiBzaWduKSArIHZhbHVlUHJlZml4O1xuICAgICAgICB2YWx1ZVN1ZmZpeCA9IHZhbHVlU3VmZml4ICsgKHR5cGUgPT09IFwic1wiID8gcHJlZml4ZXNbOCArIHByZWZpeEV4cG9uZW50IC8gM10gOiBcIlwiKSArICh2YWx1ZU5lZ2F0aXZlICYmIHNpZ24gPT09IFwiKFwiID8gXCIpXCIgOiBcIlwiKTtcblxuICAgICAgICAvLyBCcmVhayB0aGUgZm9ybWF0dGVkIHZhbHVlIGludG8gdGhlIGludGVnZXIg4oCcdmFsdWXigJ0gcGFydCB0aGF0IGNhbiBiZVxuICAgICAgICAvLyBncm91cGVkLCBhbmQgZnJhY3Rpb25hbCBvciBleHBvbmVudGlhbCDigJxzdWZmaXjigJ0gcGFydCB0aGF0IGlzIG5vdC5cbiAgICAgICAgaWYgKG1heWJlU3VmZml4KSB7XG4gICAgICAgICAgaSA9IC0xLCBuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAoYyA9IHZhbHVlLmNoYXJDb2RlQXQoaSksIDQ4ID4gYyB8fCBjID4gNTcpIHtcbiAgICAgICAgICAgICAgdmFsdWVTdWZmaXggPSAoYyA9PT0gNDYgPyBkZWNpbWFsICsgdmFsdWUuc2xpY2UoaSArIDEpIDogdmFsdWUuc2xpY2UoaSkpICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgZmlsbCBjaGFyYWN0ZXIgaXMgbm90IFwiMFwiLCBncm91cGluZyBpcyBhcHBsaWVkIGJlZm9yZSBwYWRkaW5nLlxuICAgICAgaWYgKGNvbW1hICYmICF6ZXJvKSB2YWx1ZSA9IGdyb3VwKHZhbHVlLCBJbmZpbml0eSk7XG5cbiAgICAgIC8vIENvbXB1dGUgdGhlIHBhZGRpbmcuXG4gICAgICB2YXIgbGVuZ3RoID0gdmFsdWVQcmVmaXgubGVuZ3RoICsgdmFsdWUubGVuZ3RoICsgdmFsdWVTdWZmaXgubGVuZ3RoLFxuICAgICAgICAgIHBhZGRpbmcgPSBsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgOiBcIlwiO1xuXG4gICAgICAvLyBJZiB0aGUgZmlsbCBjaGFyYWN0ZXIgaXMgXCIwXCIsIGdyb3VwaW5nIGlzIGFwcGxpZWQgYWZ0ZXIgcGFkZGluZy5cbiAgICAgIGlmIChjb21tYSAmJiB6ZXJvKSB2YWx1ZSA9IGdyb3VwKHBhZGRpbmcgKyB2YWx1ZSwgcGFkZGluZy5sZW5ndGggPyB3aWR0aCAtIHZhbHVlU3VmZml4Lmxlbmd0aCA6IEluZmluaXR5KSwgcGFkZGluZyA9IFwiXCI7XG5cbiAgICAgIC8vIFJlY29uc3RydWN0IHRoZSBmaW5hbCBvdXRwdXQgYmFzZWQgb24gdGhlIGRlc2lyZWQgYWxpZ25tZW50LlxuICAgICAgc3dpdGNoIChhbGlnbikge1xuICAgICAgICBjYXNlIFwiPFwiOiByZXR1cm4gdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4ICsgcGFkZGluZztcbiAgICAgICAgY2FzZSBcIj1cIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgcGFkZGluZyArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICAgIGNhc2UgXCJeXCI6IHJldHVybiBwYWRkaW5nLnNsaWNlKDAsIGxlbmd0aCA9IHBhZGRpbmcubGVuZ3RoID4+IDEpICsgdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4ICsgcGFkZGluZy5zbGljZShsZW5ndGgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhZGRpbmcgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgfVxuXG4gICAgZm9ybWF0LnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3BlY2lmaWVyICsgXCJcIjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZvcm1hdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFByZWZpeChzcGVjaWZpZXIsIHZhbHVlKSB7XG4gICAgdmFyIGYgPSBuZXdGb3JtYXQoKHNwZWNpZmllciA9IGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpLCBzcGVjaWZpZXIudHlwZSA9IFwiZlwiLCBzcGVjaWZpZXIpKSxcbiAgICAgICAgZSA9IE1hdGgubWF4KC04LCBNYXRoLm1pbig4LCBNYXRoLmZsb29yKGV4cG9uZW50KHZhbHVlKSAvIDMpKSkgKiAzLFxuICAgICAgICBrID0gTWF0aC5wb3coMTAsIC1lKSxcbiAgICAgICAgcHJlZml4ID0gcHJlZml4ZXNbOCArIGUgLyAzXTtcbiAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBmKGsgKiB2YWx1ZSkgKyBwcmVmaXg7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZm9ybWF0OiBuZXdGb3JtYXQsXG4gICAgZm9ybWF0UHJlZml4OiBmb3JtYXRQcmVmaXhcbiAgfTtcbn1cbiIsImltcG9ydCBleHBvbmVudCBmcm9tIFwiLi9leHBvbmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzdGVwKSB7XG4gIHJldHVybiBNYXRoLm1heCgwLCAtZXhwb25lbnQoTWF0aC5hYnMoc3RlcCkpKTtcbn1cbiIsImltcG9ydCBleHBvbmVudCBmcm9tIFwiLi9leHBvbmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzdGVwLCB2YWx1ZSkge1xuICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQodmFsdWUpIC8gMykpKSAqIDMgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xufVxuIiwiaW1wb3J0IGV4cG9uZW50IGZyb20gXCIuL2V4cG9uZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0ZXAsIG1heCkge1xuICBzdGVwID0gTWF0aC5hYnMoc3RlcCksIG1heCA9IE1hdGguYWJzKG1heCkgLSBzdGVwO1xuICByZXR1cm4gTWF0aC5tYXgoMCwgZXhwb25lbnQobWF4KSAtIGV4cG9uZW50KHN0ZXApKSArIDE7XG59XG4iLCJpbXBvcnQge3RpY2tTdGVwfSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCB7Zm9ybWF0LCBmb3JtYXRQcmVmaXgsIGZvcm1hdFNwZWNpZmllciwgcHJlY2lzaW9uRml4ZWQsIHByZWNpc2lvblByZWZpeCwgcHJlY2lzaW9uUm91bmR9IGZyb20gXCJkMy1mb3JtYXRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZG9tYWluLCBjb3VudCwgc3BlY2lmaWVyKSB7XG4gIHZhciBzdGFydCA9IGRvbWFpblswXSxcbiAgICAgIHN0b3AgPSBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLFxuICAgICAgc3RlcCA9IHRpY2tTdGVwKHN0YXJ0LCBzdG9wLCBjb3VudCA9PSBudWxsID8gMTAgOiBjb3VudCksXG4gICAgICBwcmVjaXNpb247XG4gIHNwZWNpZmllciA9IGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIgPT0gbnVsbCA/IFwiLGZcIiA6IHNwZWNpZmllcik7XG4gIHN3aXRjaCAoc3BlY2lmaWVyLnR5cGUpIHtcbiAgICBjYXNlIFwic1wiOiB7XG4gICAgICB2YXIgdmFsdWUgPSBNYXRoLm1heChNYXRoLmFicyhzdGFydCksIE1hdGguYWJzKHN0b3ApKTtcbiAgICAgIGlmIChzcGVjaWZpZXIucHJlY2lzaW9uID09IG51bGwgJiYgIWlzTmFOKHByZWNpc2lvbiA9IHByZWNpc2lvblByZWZpeChzdGVwLCB2YWx1ZSkpKSBzcGVjaWZpZXIucHJlY2lzaW9uID0gcHJlY2lzaW9uO1xuICAgICAgcmV0dXJuIGZvcm1hdFByZWZpeChzcGVjaWZpZXIsIHZhbHVlKTtcbiAgICB9XG4gICAgY2FzZSBcIlwiOlxuICAgIGNhc2UgXCJlXCI6XG4gICAgY2FzZSBcImdcIjpcbiAgICBjYXNlIFwicFwiOlxuICAgIGNhc2UgXCJyXCI6IHtcbiAgICAgIGlmIChzcGVjaWZpZXIucHJlY2lzaW9uID09IG51bGwgJiYgIWlzTmFOKHByZWNpc2lvbiA9IHByZWNpc2lvblJvdW5kKHN0ZXAsIE1hdGgubWF4KE1hdGguYWJzKHN0YXJ0KSwgTWF0aC5hYnMoc3RvcCkpKSkpIHNwZWNpZmllci5wcmVjaXNpb24gPSBwcmVjaXNpb24gLSAoc3BlY2lmaWVyLnR5cGUgPT09IFwiZVwiKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiZlwiOlxuICAgIGNhc2UgXCIlXCI6IHtcbiAgICAgIGlmIChzcGVjaWZpZXIucHJlY2lzaW9uID09IG51bGwgJiYgIWlzTmFOKHByZWNpc2lvbiA9IHByZWNpc2lvbkZpeGVkKHN0ZXApKSkgc3BlY2lmaWVyLnByZWNpc2lvbiA9IHByZWNpc2lvbiAtIChzcGVjaWZpZXIudHlwZSA9PT0gXCIlXCIpICogMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZm9ybWF0KHNwZWNpZmllcik7XG59XG4iLCJpbXBvcnQge3RpY2tzLCB0aWNrU3RlcH0gZnJvbSBcImQzLWFycmF5XCI7XG5pbXBvcnQge2ludGVycG9sYXRlTnVtYmVyIGFzIHJlaW50ZXJwb2xhdGV9IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuaW1wb3J0IHtkZWZhdWx0IGFzIGNvbnRpbnVvdXMsIGNvcHksIGRlaW50ZXJwb2xhdGVMaW5lYXIgYXMgZGVpbnRlcnBvbGF0ZX0gZnJvbSBcIi4vY29udGludW91c1wiO1xuaW1wb3J0IHRpY2tGb3JtYXQgZnJvbSBcIi4vdGlja0Zvcm1hdFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbGluZWFyaXNoKHNjYWxlKSB7XG4gIHZhciBkb21haW4gPSBzY2FsZS5kb21haW47XG5cbiAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHZhciBkID0gZG9tYWluKCk7XG4gICAgcmV0dXJuIHRpY2tzKGRbMF0sIGRbZC5sZW5ndGggLSAxXSwgY291bnQgPT0gbnVsbCA/IDEwIDogY291bnQpO1xuICB9O1xuXG4gIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgcmV0dXJuIHRpY2tGb3JtYXQoZG9tYWluKCksIGNvdW50LCBzcGVjaWZpZXIpO1xuICB9O1xuXG4gIHNjYWxlLm5pY2UgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHZhciBkID0gZG9tYWluKCksXG4gICAgICAgIGkgPSBkLmxlbmd0aCAtIDEsXG4gICAgICAgIG4gPSBjb3VudCA9PSBudWxsID8gMTAgOiBjb3VudCxcbiAgICAgICAgc3RhcnQgPSBkWzBdLFxuICAgICAgICBzdG9wID0gZFtpXSxcbiAgICAgICAgc3RlcCA9IHRpY2tTdGVwKHN0YXJ0LCBzdG9wLCBuKTtcblxuICAgIGlmIChzdGVwKSB7XG4gICAgICBzdGVwID0gdGlja1N0ZXAoTWF0aC5mbG9vcihzdGFydCAvIHN0ZXApICogc3RlcCwgTWF0aC5jZWlsKHN0b3AgLyBzdGVwKSAqIHN0ZXAsIG4pO1xuICAgICAgZFswXSA9IE1hdGguZmxvb3Ioc3RhcnQgLyBzdGVwKSAqIHN0ZXA7XG4gICAgICBkW2ldID0gTWF0aC5jZWlsKHN0b3AgLyBzdGVwKSAqIHN0ZXA7XG4gICAgICBkb21haW4oZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjYWxlO1xuICB9O1xuXG4gIHJldHVybiBzY2FsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGluZWFyKCkge1xuICB2YXIgc2NhbGUgPSBjb250aW51b3VzKGRlaW50ZXJwb2xhdGUsIHJlaW50ZXJwb2xhdGUpO1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29weShzY2FsZSwgbGluZWFyKCkpO1xuICB9O1xuXG4gIHJldHVybiBsaW5lYXJpc2goc2NhbGUpO1xufVxuIiwiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50XCI7XG5pbXBvcnQge2xpbmVhcmlzaH0gZnJvbSBcIi4vbGluZWFyXCI7XG5pbXBvcnQge2RlZmF1bHQgYXMgY29udGludW91cywgY29weX0gZnJvbSBcIi4vY29udGludW91c1wiO1xuXG5mdW5jdGlvbiByYWlzZSh4LCBleHBvbmVudCkge1xuICByZXR1cm4geCA8IDAgPyAtTWF0aC5wb3coLXgsIGV4cG9uZW50KSA6IE1hdGgucG93KHgsIGV4cG9uZW50KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcG93KCkge1xuICB2YXIgZXhwb25lbnQgPSAxLFxuICAgICAgc2NhbGUgPSBjb250aW51b3VzKGRlaW50ZXJwb2xhdGUsIHJlaW50ZXJwb2xhdGUpLFxuICAgICAgZG9tYWluID0gc2NhbGUuZG9tYWluO1xuXG4gIGZ1bmN0aW9uIGRlaW50ZXJwb2xhdGUoYSwgYikge1xuICAgIHJldHVybiAoYiA9IHJhaXNlKGIsIGV4cG9uZW50KSAtIChhID0gcmFpc2UoYSwgZXhwb25lbnQpKSlcbiAgICAgICAgPyBmdW5jdGlvbih4KSB7IHJldHVybiAocmFpc2UoeCwgZXhwb25lbnQpIC0gYSkgLyBiOyB9XG4gICAgICAgIDogY29uc3RhbnQoYik7XG4gIH1cblxuICBmdW5jdGlvbiByZWludGVycG9sYXRlKGEsIGIpIHtcbiAgICBiID0gcmFpc2UoYiwgZXhwb25lbnQpIC0gKGEgPSByYWlzZShhLCBleHBvbmVudCkpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHJldHVybiByYWlzZShhICsgYiAqIHQsIDEgLyBleHBvbmVudCk7IH07XG4gIH1cblxuICBzY2FsZS5leHBvbmVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleHBvbmVudCA9ICtfLCBkb21haW4oZG9tYWluKCkpKSA6IGV4cG9uZW50O1xuICB9O1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29weShzY2FsZSwgcG93KCkuZXhwb25lbnQoZXhwb25lbnQpKTtcbiAgfTtcblxuICByZXR1cm4gbGluZWFyaXNoKHNjYWxlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNxcnQoKSB7XG4gIHJldHVybiBwb3coKS5leHBvbmVudCgwLjUpO1xufVxuIiwidmFyIHQwID0gbmV3IERhdGUsXG4gICAgdDEgPSBuZXcgRGF0ZTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbmV3SW50ZXJ2YWwoZmxvb3JpLCBvZmZzZXRpLCBjb3VudCwgZmllbGQpIHtcblxuICBmdW5jdGlvbiBpbnRlcnZhbChkYXRlKSB7XG4gICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoK2RhdGUpKSwgZGF0ZTtcbiAgfVxuXG4gIGludGVydmFsLmZsb29yID0gaW50ZXJ2YWw7XG5cbiAgaW50ZXJ2YWwuY2VpbCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZShkYXRlIC0gMSkpLCBvZmZzZXRpKGRhdGUsIDEpLCBmbG9vcmkoZGF0ZSksIGRhdGU7XG4gIH07XG5cbiAgaW50ZXJ2YWwucm91bmQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGQwID0gaW50ZXJ2YWwoZGF0ZSksXG4gICAgICAgIGQxID0gaW50ZXJ2YWwuY2VpbChkYXRlKTtcbiAgICByZXR1cm4gZGF0ZSAtIGQwIDwgZDEgLSBkYXRlID8gZDAgOiBkMTtcbiAgfTtcblxuICBpbnRlcnZhbC5vZmZzZXQgPSBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgcmV0dXJuIG9mZnNldGkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSwgc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCkpLCBkYXRlO1xuICB9O1xuXG4gIGludGVydmFsLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICBzdGFydCA9IGludGVydmFsLmNlaWwoc3RhcnQpO1xuICAgIHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKTtcbiAgICBpZiAoIShzdGFydCA8IHN0b3ApIHx8ICEoc3RlcCA+IDApKSByZXR1cm4gcmFuZ2U7IC8vIGFsc28gaGFuZGxlcyBJbnZhbGlkIERhdGVcbiAgICBkbyByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpOyB3aGlsZSAob2Zmc2V0aShzdGFydCwgc3RlcCksIGZsb29yaShzdGFydCksIHN0YXJ0IDwgc3RvcClcbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgaW50ZXJ2YWwuZmlsdGVyID0gZnVuY3Rpb24odGVzdCkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICB3aGlsZSAoLS1zdGVwID49IDApIHdoaWxlIChvZmZzZXRpKGRhdGUsIDEpLCAhdGVzdChkYXRlKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgaWYgKGNvdW50KSB7XG4gICAgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICB0MC5zZXRUaW1lKCtzdGFydCksIHQxLnNldFRpbWUoK2VuZCk7XG4gICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgfTtcblxuICAgIGludGVydmFsLmV2ZXJ5ID0gZnVuY3Rpb24oc3RlcCkge1xuICAgICAgc3RlcCA9IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICByZXR1cm4gIWlzRmluaXRlKHN0ZXApIHx8ICEoc3RlcCA+IDApID8gbnVsbFxuICAgICAgICAgIDogIShzdGVwID4gMSkgPyBpbnRlcnZhbFxuICAgICAgICAgIDogaW50ZXJ2YWwuZmlsdGVyKGZpZWxkXG4gICAgICAgICAgICAgID8gZnVuY3Rpb24oZCkgeyByZXR1cm4gZmllbGQoZCkgJSBzdGVwID09PSAwOyB9XG4gICAgICAgICAgICAgIDogZnVuY3Rpb24oZCkgeyByZXR1cm4gaW50ZXJ2YWwuY291bnQoMCwgZCkgJSBzdGVwID09PSAwOyB9KTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGludGVydmFsO1xufVxuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5cbnZhciBtaWxsaXNlY29uZCA9IGludGVydmFsKGZ1bmN0aW9uKCkge1xuICAvLyBub29wXG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXApO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gZW5kIC0gc3RhcnQ7XG59KTtcblxuLy8gQW4gb3B0aW1pemVkIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIHNpbXBsZSBjYXNlLlxubWlsbGlzZWNvbmQuZXZlcnkgPSBmdW5jdGlvbihrKSB7XG4gIGsgPSBNYXRoLmZsb29yKGspO1xuICBpZiAoIWlzRmluaXRlKGspIHx8ICEoayA+IDApKSByZXR1cm4gbnVsbDtcbiAgaWYgKCEoayA+IDEpKSByZXR1cm4gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRUaW1lKE1hdGguZmxvb3IoZGF0ZSAvIGspICogayk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogayk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGs7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbWlsbGlzZWNvbmQ7XG5leHBvcnQgdmFyIG1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kLnJhbmdlO1xuIiwiZXhwb3J0IHZhciBkdXJhdGlvblNlY29uZCA9IDFlMztcbmV4cG9ydCB2YXIgZHVyYXRpb25NaW51dGUgPSA2ZTQ7XG5leHBvcnQgdmFyIGR1cmF0aW9uSG91ciA9IDM2ZTU7XG5leHBvcnQgdmFyIGR1cmF0aW9uRGF5ID0gODY0ZTU7XG5leHBvcnQgdmFyIGR1cmF0aW9uV2VlayA9IDYwNDhlNTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuaW1wb3J0IHtkdXJhdGlvblNlY29uZH0gZnJvbSBcIi4vZHVyYXRpb25cIjtcblxudmFyIHNlY29uZCA9IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRUaW1lKE1hdGguZmxvb3IoZGF0ZSAvIGR1cmF0aW9uU2Vjb25kKSAqIGR1cmF0aW9uU2Vjb25kKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIGR1cmF0aW9uU2Vjb25kKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBkdXJhdGlvblNlY29uZDtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0VVRDU2Vjb25kcygpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHNlY29uZDtcbmV4cG9ydCB2YXIgc2Vjb25kcyA9IHNlY29uZC5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuaW1wb3J0IHtkdXJhdGlvbk1pbnV0ZX0gZnJvbSBcIi4vZHVyYXRpb25cIjtcblxudmFyIG1pbnV0ZSA9IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRUaW1lKE1hdGguZmxvb3IoZGF0ZSAvIGR1cmF0aW9uTWludXRlKSAqIGR1cmF0aW9uTWludXRlKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIGR1cmF0aW9uTWludXRlKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBkdXJhdGlvbk1pbnV0ZTtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0TWludXRlcygpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1pbnV0ZTtcbmV4cG9ydCB2YXIgbWludXRlcyA9IG1pbnV0ZS5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuaW1wb3J0IHtkdXJhdGlvbkhvdXIsIGR1cmF0aW9uTWludXRlfSBmcm9tIFwiLi9kdXJhdGlvblwiO1xuXG52YXIgaG91ciA9IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgdmFyIG9mZnNldCA9IGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIGR1cmF0aW9uTWludXRlICUgZHVyYXRpb25Ib3VyO1xuICBpZiAob2Zmc2V0IDwgMCkgb2Zmc2V0ICs9IGR1cmF0aW9uSG91cjtcbiAgZGF0ZS5zZXRUaW1lKE1hdGguZmxvb3IoKCtkYXRlIC0gb2Zmc2V0KSAvIGR1cmF0aW9uSG91cikgKiBkdXJhdGlvbkhvdXIgKyBvZmZzZXQpO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogZHVyYXRpb25Ib3VyKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBkdXJhdGlvbkhvdXI7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldEhvdXJzKCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgaG91cjtcbmV4cG9ydCB2YXIgaG91cnMgPSBob3VyLnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5pbXBvcnQge2R1cmF0aW9uRGF5LCBkdXJhdGlvbk1pbnV0ZX0gZnJvbSBcIi4vZHVyYXRpb25cIjtcblxudmFyIGRheSA9IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIGR1cmF0aW9uTWludXRlKSAvIGR1cmF0aW9uRGF5O1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXREYXRlKCkgLSAxO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRheTtcbmV4cG9ydCB2YXIgZGF5cyA9IGRheS5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuaW1wb3J0IHtkdXJhdGlvbk1pbnV0ZSwgZHVyYXRpb25XZWVrfSBmcm9tIFwiLi9kdXJhdGlvblwiO1xuXG5mdW5jdGlvbiB3ZWVrZGF5KGkpIHtcbiAgcmV0dXJuIGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAoZGF0ZS5nZXREYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwICogNyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiBkdXJhdGlvbk1pbnV0ZSkgLyBkdXJhdGlvbldlZWs7XG4gIH0pO1xufVxuXG5leHBvcnQgdmFyIHN1bmRheSA9IHdlZWtkYXkoMCk7XG5leHBvcnQgdmFyIG1vbmRheSA9IHdlZWtkYXkoMSk7XG5leHBvcnQgdmFyIHR1ZXNkYXkgPSB3ZWVrZGF5KDIpO1xuZXhwb3J0IHZhciB3ZWRuZXNkYXkgPSB3ZWVrZGF5KDMpO1xuZXhwb3J0IHZhciB0aHVyc2RheSA9IHdlZWtkYXkoNCk7XG5leHBvcnQgdmFyIGZyaWRheSA9IHdlZWtkYXkoNSk7XG5leHBvcnQgdmFyIHNhdHVyZGF5ID0gd2Vla2RheSg2KTtcblxuZXhwb3J0IHZhciBzdW5kYXlzID0gc3VuZGF5LnJhbmdlO1xuZXhwb3J0IHZhciBtb25kYXlzID0gbW9uZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB0dWVzZGF5cyA9IHR1ZXNkYXkucmFuZ2U7XG5leHBvcnQgdmFyIHdlZG5lc2RheXMgPSB3ZWRuZXNkYXkucmFuZ2U7XG5leHBvcnQgdmFyIHRodXJzZGF5cyA9IHRodXJzZGF5LnJhbmdlO1xuZXhwb3J0IHZhciBmcmlkYXlzID0gZnJpZGF5LnJhbmdlO1xuZXhwb3J0IHZhciBzYXR1cmRheXMgPSBzYXR1cmRheS5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuXG52YXIgbW9udGggPSBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0RGF0ZSgxKTtcbiAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyBzdGVwKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIGVuZC5nZXRNb250aCgpIC0gc3RhcnQuZ2V0TW9udGgoKSArIChlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCkpICogMTI7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldE1vbnRoKCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbW9udGg7XG5leHBvcnQgdmFyIG1vbnRocyA9IG1vbnRoLnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5cbnZhciB5ZWFyID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHN0ZXApO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpO1xufSk7XG5cbi8vIEFuIG9wdGltaXplZCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhpcyBzaW1wbGUgY2FzZS5cbnllYXIuZXZlcnkgPSBmdW5jdGlvbihrKSB7XG4gIHJldHVybiAhaXNGaW5pdGUoayA9IE1hdGguZmxvb3IoaykpIHx8ICEoayA+IDApID8gbnVsbCA6IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKE1hdGguZmxvb3IoZGF0ZS5nZXRGdWxsWWVhcigpIC8gaykgKiBrKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHN0ZXAgKiBrKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB5ZWFyO1xuZXhwb3J0IHZhciB5ZWFycyA9IHllYXIucmFuZ2U7XG4iLCJpbXBvcnQgaW50ZXJ2YWwgZnJvbSBcIi4vaW50ZXJ2YWxcIjtcbmltcG9ydCB7ZHVyYXRpb25NaW51dGV9IGZyb20gXCIuL2R1cmF0aW9uXCI7XG5cbnZhciB1dGNNaW51dGUgPSBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0VVRDU2Vjb25kcygwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIGR1cmF0aW9uTWludXRlKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBkdXJhdGlvbk1pbnV0ZTtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0VVRDTWludXRlcygpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHV0Y01pbnV0ZTtcbmV4cG9ydCB2YXIgdXRjTWludXRlcyA9IHV0Y01pbnV0ZS5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuaW1wb3J0IHtkdXJhdGlvbkhvdXJ9IGZyb20gXCIuL2R1cmF0aW9uXCI7XG5cbnZhciB1dGNIb3VyID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldFVUQ01pbnV0ZXMoMCwgMCwgMCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiBkdXJhdGlvbkhvdXIpO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uSG91cjtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0VVRDSG91cnMoKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB1dGNIb3VyO1xuZXhwb3J0IHZhciB1dGNIb3VycyA9IHV0Y0hvdXIucmFuZ2U7XG4iLCJpbXBvcnQgaW50ZXJ2YWwgZnJvbSBcIi4vaW50ZXJ2YWxcIjtcbmltcG9ydCB7ZHVyYXRpb25EYXl9IGZyb20gXCIuL2R1cmF0aW9uXCI7XG5cbnZhciB1dGNEYXkgPSBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXApO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uRGF5O1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRVVENEYXRlKCkgLSAxO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHV0Y0RheTtcbmV4cG9ydCB2YXIgdXRjRGF5cyA9IHV0Y0RheS5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuaW1wb3J0IHtkdXJhdGlvbldlZWt9IGZyb20gXCIuL2R1cmF0aW9uXCI7XG5cbmZ1bmN0aW9uIHV0Y1dlZWtkYXkoaSkge1xuICByZXR1cm4gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIChkYXRlLmdldFVUQ0RheSgpICsgNyAtIGkpICUgNyk7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXAgKiA3KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gZHVyYXRpb25XZWVrO1xuICB9KTtcbn1cblxuZXhwb3J0IHZhciB1dGNTdW5kYXkgPSB1dGNXZWVrZGF5KDApO1xuZXhwb3J0IHZhciB1dGNNb25kYXkgPSB1dGNXZWVrZGF5KDEpO1xuZXhwb3J0IHZhciB1dGNUdWVzZGF5ID0gdXRjV2Vla2RheSgyKTtcbmV4cG9ydCB2YXIgdXRjV2VkbmVzZGF5ID0gdXRjV2Vla2RheSgzKTtcbmV4cG9ydCB2YXIgdXRjVGh1cnNkYXkgPSB1dGNXZWVrZGF5KDQpO1xuZXhwb3J0IHZhciB1dGNGcmlkYXkgPSB1dGNXZWVrZGF5KDUpO1xuZXhwb3J0IHZhciB1dGNTYXR1cmRheSA9IHV0Y1dlZWtkYXkoNik7XG5cbmV4cG9ydCB2YXIgdXRjU3VuZGF5cyA9IHV0Y1N1bmRheS5yYW5nZTtcbmV4cG9ydCB2YXIgdXRjTW9uZGF5cyA9IHV0Y01vbmRheS5yYW5nZTtcbmV4cG9ydCB2YXIgdXRjVHVlc2RheXMgPSB1dGNUdWVzZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB1dGNXZWRuZXNkYXlzID0gdXRjV2VkbmVzZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB1dGNUaHVyc2RheXMgPSB1dGNUaHVyc2RheS5yYW5nZTtcbmV4cG9ydCB2YXIgdXRjRnJpZGF5cyA9IHV0Y0ZyaWRheS5yYW5nZTtcbmV4cG9ydCB2YXIgdXRjU2F0dXJkYXlzID0gdXRjU2F0dXJkYXkucmFuZ2U7XG4iLCJpbXBvcnQgaW50ZXJ2YWwgZnJvbSBcIi4vaW50ZXJ2YWxcIjtcblxudmFyIHV0Y01vbnRoID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldFVUQ0RhdGUoMSk7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VVRDTW9udGgoZGF0ZS5nZXRVVENNb250aCgpICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiBlbmQuZ2V0VVRDTW9udGgoKSAtIHN0YXJ0LmdldFVUQ01vbnRoKCkgKyAoZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpKSAqIDEyO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRVVENNb250aCgpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHV0Y01vbnRoO1xuZXhwb3J0IHZhciB1dGNNb250aHMgPSB1dGNNb250aC5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuXG52YXIgdXRjWWVhciA9IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgKyBzdGVwKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKTtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbn0pO1xuXG4vLyBBbiBvcHRpbWl6ZWQgaW1wbGVtZW50YXRpb24gZm9yIHRoaXMgc2ltcGxlIGNhc2UuXG51dGNZZWFyLmV2ZXJ5ID0gZnVuY3Rpb24oaykge1xuICByZXR1cm4gIWlzRmluaXRlKGsgPSBNYXRoLmZsb29yKGspKSB8fCAhKGsgPiAwKSA/IG51bGwgOiBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihNYXRoLmZsb29yKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSAvIGspICogayk7XG4gICAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgKyBzdGVwICogayk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgdXRjWWVhcjtcbmV4cG9ydCB2YXIgdXRjWWVhcnMgPSB1dGNZZWFyLnJhbmdlO1xuIiwiaW1wb3J0IHt0aW1lRGF5LCB0aW1lU3VuZGF5LCB0aW1lTW9uZGF5LCB0aW1lWWVhciwgdXRjRGF5LCB1dGNTdW5kYXksIHV0Y01vbmRheSwgdXRjWWVhcn0gZnJvbSBcImQzLXRpbWVcIjtcblxudmFyIGRlZmF1bHRMb2NhbGUgPSBmb3JtYXRMb2NhbGUoe1xuICBkYXRlVGltZTogXCIlYSAlYiAlZSAlWCAlWVwiLFxuICBkYXRlOiBcIiVtLyVkLyVZXCIsXG4gIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgcGVyaW9kczogW1wiQU1cIiwgXCJQTVwiXSxcbiAgZGF5czogW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXG4gIHNob3J0RGF5czogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdLFxuICBtb250aHM6IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdLFxuICBzaG9ydE1vbnRoczogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdXG59KTtcblxuZXhwb3J0IHZhciB0aW1lRm9ybWF0ID0gZGVmYXVsdExvY2FsZS5mb3JtYXQ7XG5leHBvcnQgdmFyIHRpbWVQYXJzZSA9IGRlZmF1bHRMb2NhbGUucGFyc2U7XG5leHBvcnQgdmFyIHV0Y0Zvcm1hdCA9IGRlZmF1bHRMb2NhbGUudXRjRm9ybWF0O1xuZXhwb3J0IHZhciB1dGNQYXJzZSA9IGRlZmF1bHRMb2NhbGUudXRjUGFyc2U7XG5cbmZ1bmN0aW9uIGxvY2FsRGF0ZShkKSB7XG4gIGlmICgwIDw9IGQueSAmJiBkLnkgPCAxMDApIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKC0xLCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGQueSk7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKGQueSwgZC5tLCBkLmQsIGQuSCwgZC5NLCBkLlMsIGQuTCk7XG59XG5cbmZ1bmN0aW9uIHV0Y0RhdGUoZCkge1xuICBpZiAoMCA8PSBkLnkgJiYgZC55IDwgMTAwKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQygtMSwgZC5tLCBkLmQsIGQuSCwgZC5NLCBkLlMsIGQuTCkpO1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZC55KTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKSk7XG59XG5cbmZ1bmN0aW9uIG5ld1llYXIoeSkge1xuICByZXR1cm4ge3k6IHksIG06IDAsIGQ6IDEsIEg6IDAsIE06IDAsIFM6IDAsIEw6IDB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb3JtYXRMb2NhbGUobG9jYWxlKSB7XG4gIHZhciBsb2NhbGVfZGF0ZVRpbWUgPSBsb2NhbGUuZGF0ZVRpbWUsXG4gICAgICBsb2NhbGVfZGF0ZSA9IGxvY2FsZS5kYXRlLFxuICAgICAgbG9jYWxlX3RpbWUgPSBsb2NhbGUudGltZSxcbiAgICAgIGxvY2FsZV9wZXJpb2RzID0gbG9jYWxlLnBlcmlvZHMsXG4gICAgICBsb2NhbGVfd2Vla2RheXMgPSBsb2NhbGUuZGF5cyxcbiAgICAgIGxvY2FsZV9zaG9ydFdlZWtkYXlzID0gbG9jYWxlLnNob3J0RGF5cyxcbiAgICAgIGxvY2FsZV9tb250aHMgPSBsb2NhbGUubW9udGhzLFxuICAgICAgbG9jYWxlX3Nob3J0TW9udGhzID0gbG9jYWxlLnNob3J0TW9udGhzO1xuXG4gIHZhciBwZXJpb2RSZSA9IGZvcm1hdFJlKGxvY2FsZV9wZXJpb2RzKSxcbiAgICAgIHBlcmlvZExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfcGVyaW9kcyksXG4gICAgICB3ZWVrZGF5UmUgPSBmb3JtYXRSZShsb2NhbGVfd2Vla2RheXMpLFxuICAgICAgd2Vla2RheUxvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfd2Vla2RheXMpLFxuICAgICAgc2hvcnRXZWVrZGF5UmUgPSBmb3JtYXRSZShsb2NhbGVfc2hvcnRXZWVrZGF5cyksXG4gICAgICBzaG9ydFdlZWtkYXlMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX3Nob3J0V2Vla2RheXMpLFxuICAgICAgbW9udGhSZSA9IGZvcm1hdFJlKGxvY2FsZV9tb250aHMpLFxuICAgICAgbW9udGhMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX21vbnRocyksXG4gICAgICBzaG9ydE1vbnRoUmUgPSBmb3JtYXRSZShsb2NhbGVfc2hvcnRNb250aHMpLFxuICAgICAgc2hvcnRNb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfc2hvcnRNb250aHMpO1xuXG4gIHZhciBmb3JtYXRzID0ge1xuICAgIFwiYVwiOiBmb3JtYXRTaG9ydFdlZWtkYXksXG4gICAgXCJBXCI6IGZvcm1hdFdlZWtkYXksXG4gICAgXCJiXCI6IGZvcm1hdFNob3J0TW9udGgsXG4gICAgXCJCXCI6IGZvcm1hdE1vbnRoLFxuICAgIFwiY1wiOiBudWxsLFxuICAgIFwiZFwiOiBmb3JtYXREYXlPZk1vbnRoLFxuICAgIFwiZVwiOiBmb3JtYXREYXlPZk1vbnRoLFxuICAgIFwiSFwiOiBmb3JtYXRIb3VyMjQsXG4gICAgXCJJXCI6IGZvcm1hdEhvdXIxMixcbiAgICBcImpcIjogZm9ybWF0RGF5T2ZZZWFyLFxuICAgIFwiTFwiOiBmb3JtYXRNaWxsaXNlY29uZHMsXG4gICAgXCJtXCI6IGZvcm1hdE1vbnRoTnVtYmVyLFxuICAgIFwiTVwiOiBmb3JtYXRNaW51dGVzLFxuICAgIFwicFwiOiBmb3JtYXRQZXJpb2QsXG4gICAgXCJTXCI6IGZvcm1hdFNlY29uZHMsXG4gICAgXCJVXCI6IGZvcm1hdFdlZWtOdW1iZXJTdW5kYXksXG4gICAgXCJ3XCI6IGZvcm1hdFdlZWtkYXlOdW1iZXIsXG4gICAgXCJXXCI6IGZvcm1hdFdlZWtOdW1iZXJNb25kYXksXG4gICAgXCJ4XCI6IG51bGwsXG4gICAgXCJYXCI6IG51bGwsXG4gICAgXCJ5XCI6IGZvcm1hdFllYXIsXG4gICAgXCJZXCI6IGZvcm1hdEZ1bGxZZWFyLFxuICAgIFwiWlwiOiBmb3JtYXRab25lLFxuICAgIFwiJVwiOiBmb3JtYXRMaXRlcmFsUGVyY2VudFxuICB9O1xuXG4gIHZhciB1dGNGb3JtYXRzID0ge1xuICAgIFwiYVwiOiBmb3JtYXRVVENTaG9ydFdlZWtkYXksXG4gICAgXCJBXCI6IGZvcm1hdFVUQ1dlZWtkYXksXG4gICAgXCJiXCI6IGZvcm1hdFVUQ1Nob3J0TW9udGgsXG4gICAgXCJCXCI6IGZvcm1hdFVUQ01vbnRoLFxuICAgIFwiY1wiOiBudWxsLFxuICAgIFwiZFwiOiBmb3JtYXRVVENEYXlPZk1vbnRoLFxuICAgIFwiZVwiOiBmb3JtYXRVVENEYXlPZk1vbnRoLFxuICAgIFwiSFwiOiBmb3JtYXRVVENIb3VyMjQsXG4gICAgXCJJXCI6IGZvcm1hdFVUQ0hvdXIxMixcbiAgICBcImpcIjogZm9ybWF0VVRDRGF5T2ZZZWFyLFxuICAgIFwiTFwiOiBmb3JtYXRVVENNaWxsaXNlY29uZHMsXG4gICAgXCJtXCI6IGZvcm1hdFVUQ01vbnRoTnVtYmVyLFxuICAgIFwiTVwiOiBmb3JtYXRVVENNaW51dGVzLFxuICAgIFwicFwiOiBmb3JtYXRVVENQZXJpb2QsXG4gICAgXCJTXCI6IGZvcm1hdFVUQ1NlY29uZHMsXG4gICAgXCJVXCI6IGZvcm1hdFVUQ1dlZWtOdW1iZXJTdW5kYXksXG4gICAgXCJ3XCI6IGZvcm1hdFVUQ1dlZWtkYXlOdW1iZXIsXG4gICAgXCJXXCI6IGZvcm1hdFVUQ1dlZWtOdW1iZXJNb25kYXksXG4gICAgXCJ4XCI6IG51bGwsXG4gICAgXCJYXCI6IG51bGwsXG4gICAgXCJ5XCI6IGZvcm1hdFVUQ1llYXIsXG4gICAgXCJZXCI6IGZvcm1hdFVUQ0Z1bGxZZWFyLFxuICAgIFwiWlwiOiBmb3JtYXRVVENab25lLFxuICAgIFwiJVwiOiBmb3JtYXRMaXRlcmFsUGVyY2VudFxuICB9O1xuXG4gIHZhciBwYXJzZXMgPSB7XG4gICAgXCJhXCI6IHBhcnNlU2hvcnRXZWVrZGF5LFxuICAgIFwiQVwiOiBwYXJzZVdlZWtkYXksXG4gICAgXCJiXCI6IHBhcnNlU2hvcnRNb250aCxcbiAgICBcIkJcIjogcGFyc2VNb250aCxcbiAgICBcImNcIjogcGFyc2VMb2NhbGVEYXRlVGltZSxcbiAgICBcImRcIjogcGFyc2VEYXlPZk1vbnRoLFxuICAgIFwiZVwiOiBwYXJzZURheU9mTW9udGgsXG4gICAgXCJIXCI6IHBhcnNlSG91cjI0LFxuICAgIFwiSVwiOiBwYXJzZUhvdXIyNCxcbiAgICBcImpcIjogcGFyc2VEYXlPZlllYXIsXG4gICAgXCJMXCI6IHBhcnNlTWlsbGlzZWNvbmRzLFxuICAgIFwibVwiOiBwYXJzZU1vbnRoTnVtYmVyLFxuICAgIFwiTVwiOiBwYXJzZU1pbnV0ZXMsXG4gICAgXCJwXCI6IHBhcnNlUGVyaW9kLFxuICAgIFwiU1wiOiBwYXJzZVNlY29uZHMsXG4gICAgXCJVXCI6IHBhcnNlV2Vla051bWJlclN1bmRheSxcbiAgICBcIndcIjogcGFyc2VXZWVrZGF5TnVtYmVyLFxuICAgIFwiV1wiOiBwYXJzZVdlZWtOdW1iZXJNb25kYXksXG4gICAgXCJ4XCI6IHBhcnNlTG9jYWxlRGF0ZSxcbiAgICBcIlhcIjogcGFyc2VMb2NhbGVUaW1lLFxuICAgIFwieVwiOiBwYXJzZVllYXIsXG4gICAgXCJZXCI6IHBhcnNlRnVsbFllYXIsXG4gICAgXCJaXCI6IHBhcnNlWm9uZSxcbiAgICBcIiVcIjogcGFyc2VMaXRlcmFsUGVyY2VudFxuICB9O1xuXG4gIC8vIFRoZXNlIHJlY3Vyc2l2ZSBkaXJlY3RpdmUgZGVmaW5pdGlvbnMgbXVzdCBiZSBkZWZlcnJlZC5cbiAgZm9ybWF0cy54ID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlLCBmb3JtYXRzKTtcbiAgZm9ybWF0cy5YID0gbmV3Rm9ybWF0KGxvY2FsZV90aW1lLCBmb3JtYXRzKTtcbiAgZm9ybWF0cy5jID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlVGltZSwgZm9ybWF0cyk7XG4gIHV0Y0Zvcm1hdHMueCA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZSwgdXRjRm9ybWF0cyk7XG4gIHV0Y0Zvcm1hdHMuWCA9IG5ld0Zvcm1hdChsb2NhbGVfdGltZSwgdXRjRm9ybWF0cyk7XG4gIHV0Y0Zvcm1hdHMuYyA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZVRpbWUsIHV0Y0Zvcm1hdHMpO1xuXG4gIGZ1bmN0aW9uIG5ld0Zvcm1hdChzcGVjaWZpZXIsIGZvcm1hdHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgdmFyIHN0cmluZyA9IFtdLFxuICAgICAgICAgIGkgPSAtMSxcbiAgICAgICAgICBqID0gMCxcbiAgICAgICAgICBuID0gc3BlY2lmaWVyLmxlbmd0aCxcbiAgICAgICAgICBjLFxuICAgICAgICAgIHBhZCxcbiAgICAgICAgICBmb3JtYXQ7XG5cbiAgICAgIGlmICghKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkgZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKTtcblxuICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgaWYgKHNwZWNpZmllci5jaGFyQ29kZUF0KGkpID09PSAzNykge1xuICAgICAgICAgIHN0cmluZy5wdXNoKHNwZWNpZmllci5zbGljZShqLCBpKSk7XG4gICAgICAgICAgaWYgKChwYWQgPSBwYWRzW2MgPSBzcGVjaWZpZXIuY2hhckF0KCsraSldKSAhPSBudWxsKSBjID0gc3BlY2lmaWVyLmNoYXJBdCgrK2kpO1xuICAgICAgICAgIGVsc2UgcGFkID0gYyA9PT0gXCJlXCIgPyBcIiBcIiA6IFwiMFwiO1xuICAgICAgICAgIGlmIChmb3JtYXQgPSBmb3JtYXRzW2NdKSBjID0gZm9ybWF0KGRhdGUsIHBhZCk7XG4gICAgICAgICAgc3RyaW5nLnB1c2goYyk7XG4gICAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0cmluZy5wdXNoKHNwZWNpZmllci5zbGljZShqLCBpKSk7XG4gICAgICByZXR1cm4gc3RyaW5nLmpvaW4oXCJcIik7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1BhcnNlKHNwZWNpZmllciwgbmV3RGF0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHZhciBkID0gbmV3WWVhcigxOTAwKSxcbiAgICAgICAgICBpID0gcGFyc2VTcGVjaWZpZXIoZCwgc3BlY2lmaWVyLCBzdHJpbmcgKz0gXCJcIiwgMCk7XG4gICAgICBpZiAoaSAhPSBzdHJpbmcubGVuZ3RoKSByZXR1cm4gbnVsbDtcblxuICAgICAgLy8gVGhlIGFtLXBtIGZsYWcgaXMgMCBmb3IgQU0sIGFuZCAxIGZvciBQTS5cbiAgICAgIGlmIChcInBcIiBpbiBkKSBkLkggPSBkLkggJSAxMiArIGQucCAqIDEyO1xuXG4gICAgICAvLyBDb252ZXJ0IGRheS1vZi13ZWVrIGFuZCB3ZWVrLW9mLXllYXIgdG8gZGF5LW9mLXllYXIuXG4gICAgICBpZiAoXCJXXCIgaW4gZCB8fCBcIlVcIiBpbiBkKSB7XG4gICAgICAgIGlmICghKFwid1wiIGluIGQpKSBkLncgPSBcIldcIiBpbiBkID8gMSA6IDA7XG4gICAgICAgIHZhciBkYXkgPSBcIlpcIiBpbiBkID8gdXRjRGF0ZShuZXdZZWFyKGQueSkpLmdldFVUQ0RheSgpIDogbmV3RGF0ZShuZXdZZWFyKGQueSkpLmdldERheSgpO1xuICAgICAgICBkLm0gPSAwO1xuICAgICAgICBkLmQgPSBcIldcIiBpbiBkID8gKGQudyArIDYpICUgNyArIGQuVyAqIDcgLSAoZGF5ICsgNSkgJSA3IDogZC53ICsgZC5VICogNyAtIChkYXkgKyA2KSAlIDc7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGEgdGltZSB6b25lIGlzIHNwZWNpZmllZCwgYWxsIGZpZWxkcyBhcmUgaW50ZXJwcmV0ZWQgYXMgVVRDIGFuZCB0aGVuXG4gICAgICAvLyBvZmZzZXQgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgdGltZSB6b25lLlxuICAgICAgaWYgKFwiWlwiIGluIGQpIHtcbiAgICAgICAgZC5IICs9IGQuWiAvIDEwMCB8IDA7XG4gICAgICAgIGQuTSArPSBkLlogJSAxMDA7XG4gICAgICAgIHJldHVybiB1dGNEYXRlKGQpO1xuICAgICAgfVxuXG4gICAgICAvLyBPdGhlcndpc2UsIGFsbCBmaWVsZHMgYXJlIGluIGxvY2FsIHRpbWUuXG4gICAgICByZXR1cm4gbmV3RGF0ZShkKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTcGVjaWZpZXIoZCwgc3BlY2lmaWVyLCBzdHJpbmcsIGopIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIG4gPSBzcGVjaWZpZXIubGVuZ3RoLFxuICAgICAgICBtID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgYyxcbiAgICAgICAgcGFyc2U7XG5cbiAgICB3aGlsZSAoaSA8IG4pIHtcbiAgICAgIGlmIChqID49IG0pIHJldHVybiAtMTtcbiAgICAgIGMgPSBzcGVjaWZpZXIuY2hhckNvZGVBdChpKyspO1xuICAgICAgaWYgKGMgPT09IDM3KSB7XG4gICAgICAgIGMgPSBzcGVjaWZpZXIuY2hhckF0KGkrKyk7XG4gICAgICAgIHBhcnNlID0gcGFyc2VzW2MgaW4gcGFkcyA/IHNwZWNpZmllci5jaGFyQXQoaSsrKSA6IGNdO1xuICAgICAgICBpZiAoIXBhcnNlIHx8ICgoaiA9IHBhcnNlKGQsIHN0cmluZywgaikpIDwgMCkpIHJldHVybiAtMTtcbiAgICAgIH0gZWxzZSBpZiAoYyAhPSBzdHJpbmcuY2hhckNvZGVBdChqKyspKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gajtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUGVyaW9kKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gcGVyaW9kUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQucCA9IHBlcmlvZExvb2t1cFtuWzBdLnRvTG93ZXJDYXNlKCldLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVNob3J0V2Vla2RheShkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IHNob3J0V2Vla2RheVJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLncgPSBzaG9ydFdlZWtkYXlMb29rdXBbblswXS50b0xvd2VyQ2FzZSgpXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gd2Vla2RheVJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLncgPSB3ZWVrZGF5TG9va3VwW25bMF0udG9Mb3dlckNhc2UoKV0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlU2hvcnRNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IHNob3J0TW9udGhSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5tID0gc2hvcnRNb250aExvb2t1cFtuWzBdLnRvTG93ZXJDYXNlKCldLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1vbnRoKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbW9udGhSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5tID0gbW9udGhMb29rdXBbblswXS50b0xvd2VyQ2FzZSgpXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VMb2NhbGVEYXRlVGltZShkLCBzdHJpbmcsIGkpIHtcbiAgICByZXR1cm4gcGFyc2VTcGVjaWZpZXIoZCwgbG9jYWxlX2RhdGVUaW1lLCBzdHJpbmcsIGkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VMb2NhbGVEYXRlKGQsIHN0cmluZywgaSkge1xuICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfZGF0ZSwgc3RyaW5nLCBpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTG9jYWxlVGltZShkLCBzdHJpbmcsIGkpIHtcbiAgICByZXR1cm4gcGFyc2VTcGVjaWZpZXIoZCwgbG9jYWxlX3RpbWUsIHN0cmluZywgaSk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRTaG9ydFdlZWtkYXkoZCkge1xuICAgIHJldHVybiBsb2NhbGVfc2hvcnRXZWVrZGF5c1tkLmdldERheSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFdlZWtkYXkoZCkge1xuICAgIHJldHVybiBsb2NhbGVfd2Vla2RheXNbZC5nZXREYXkoKV07XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRTaG9ydE1vbnRoKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX3Nob3J0TW9udGhzW2QuZ2V0TW9udGgoKV07XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRNb250aChkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9tb250aHNbZC5nZXRNb250aCgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFBlcmlvZChkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9wZXJpb2RzWysoZC5nZXRIb3VycygpID49IDEyKV07XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENTaG9ydFdlZWtkYXkoZCkge1xuICAgIHJldHVybiBsb2NhbGVfc2hvcnRXZWVrZGF5c1tkLmdldFVUQ0RheSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1dlZWtkYXkoZCkge1xuICAgIHJldHVybiBsb2NhbGVfd2Vla2RheXNbZC5nZXRVVENEYXkoKV07XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENTaG9ydE1vbnRoKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX3Nob3J0TW9udGhzW2QuZ2V0VVRDTW9udGgoKV07XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENNb250aChkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9tb250aHNbZC5nZXRVVENNb250aCgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1BlcmlvZChkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9wZXJpb2RzWysoZC5nZXRVVENIb3VycygpID49IDEyKV07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZvcm1hdDogZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gICAgICB2YXIgZiA9IG5ld0Zvcm1hdChzcGVjaWZpZXIgKz0gXCJcIiwgZm9ybWF0cyk7XG4gICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiBzcGVjaWZpZXI7IH07XG4gICAgICByZXR1cm4gZjtcbiAgICB9LFxuICAgIHBhcnNlOiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgIHZhciBwID0gbmV3UGFyc2Uoc3BlY2lmaWVyICs9IFwiXCIsIGxvY2FsRGF0ZSk7XG4gICAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiBzcGVjaWZpZXI7IH07XG4gICAgICByZXR1cm4gcDtcbiAgICB9LFxuICAgIHV0Y0Zvcm1hdDogZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gICAgICB2YXIgZiA9IG5ld0Zvcm1hdChzcGVjaWZpZXIgKz0gXCJcIiwgdXRjRm9ybWF0cyk7XG4gICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiBzcGVjaWZpZXI7IH07XG4gICAgICByZXR1cm4gZjtcbiAgICB9LFxuICAgIHV0Y1BhcnNlOiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgIHZhciBwID0gbmV3UGFyc2Uoc3BlY2lmaWVyLCB1dGNEYXRlKTtcbiAgICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIHBhZHMgPSB7XCItXCI6IFwiXCIsIFwiX1wiOiBcIiBcIiwgXCIwXCI6IFwiMFwifSxcbiAgICBudW1iZXJSZSA9IC9eXFxzKlxcZCsvLCAvLyBub3RlOiBpZ25vcmVzIG5leHQgZGlyZWN0aXZlXG4gICAgcGVyY2VudFJlID0gL14lLyxcbiAgICByZXF1b3RlUmUgPSAvW1xcXFxcXF5cXCRcXCpcXCtcXD9cXHxcXFtcXF1cXChcXClcXC5cXHtcXH1dL2c7XG5cbmZ1bmN0aW9uIHBhZCh2YWx1ZSwgZmlsbCwgd2lkdGgpIHtcbiAgdmFyIHNpZ24gPSB2YWx1ZSA8IDAgPyBcIi1cIiA6IFwiXCIsXG4gICAgICBzdHJpbmcgPSAoc2lnbiA/IC12YWx1ZSA6IHZhbHVlKSArIFwiXCIsXG4gICAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICByZXR1cm4gc2lnbiArIChsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgKyBzdHJpbmcgOiBzdHJpbmcpO1xufVxuXG5mdW5jdGlvbiByZXF1b3RlKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZShyZXF1b3RlUmUsIFwiXFxcXCQmXCIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRSZShuYW1lcykge1xuICByZXR1cm4gbmV3IFJlZ0V4cChcIl4oPzpcIiArIG5hbWVzLm1hcChyZXF1b3RlKS5qb2luKFwifFwiKSArIFwiKVwiLCBcImlcIik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdExvb2t1cChuYW1lcykge1xuICB2YXIgbWFwID0ge30sIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIG1hcFtuYW1lc1tpXS50b0xvd2VyQ2FzZSgpXSA9IGk7XG4gIHJldHVybiBtYXA7XG59XG5cbmZ1bmN0aW9uIHBhcnNlV2Vla2RheU51bWJlcihkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMSkpO1xuICByZXR1cm4gbiA/IChkLncgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZVdlZWtOdW1iZXJTdW5kYXkoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICByZXR1cm4gbiA/IChkLlUgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZVdlZWtOdW1iZXJNb25kYXkoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICByZXR1cm4gbiA/IChkLlcgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZUZ1bGxZZWFyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyA0KSk7XG4gIHJldHVybiBuID8gKGQueSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLnkgPSArblswXSArICgrblswXSA+IDY4ID8gMTkwMCA6IDIwMDApLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlWm9uZShkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSAvXihaKXwoWystXVxcZFxcZCkoPzpcXDo/KFxcZFxcZCkpPy8uZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDYpKTtcbiAgcmV0dXJuIG4gPyAoZC5aID0gblsxXSA/IDAgOiAtKG5bMl0gKyAoblszXSB8fCBcIjAwXCIpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1vbnRoTnVtYmVyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQubSA9IG5bMF0gLSAxLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF5T2ZNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZURheU9mWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMykpO1xuICByZXR1cm4gbiA/IChkLm0gPSAwLCBkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZUhvdXIyNChkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLkggPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1pbnV0ZXMoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgcmV0dXJuIG4gPyAoZC5NID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VTZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQuUyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTWlsbGlzZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAzKSk7XG4gIHJldHVybiBuID8gKGQuTCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTGl0ZXJhbFBlcmNlbnQoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gcGVyY2VudFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gIHJldHVybiBuID8gaSArIG5bMF0ubGVuZ3RoIDogLTE7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdERheU9mTW9udGgoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0RGF0ZSgpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0SG91cjI0KGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldEhvdXJzKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRIb3VyMTIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0SG91cnMoKSAlIDEyIHx8IDEyLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF5T2ZZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZCgxICsgdGltZURheS5jb3VudCh0aW1lWWVhcihkKSwgZCksIHAsIDMpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRNaWxsaXNlY29uZHMoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0TWlsbGlzZWNvbmRzKCksIHAsIDMpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRNb250aE51bWJlcihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRNb250aCgpICsgMSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1pbnV0ZXMoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0TWludXRlcygpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0U2Vjb25kcyhkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRTZWNvbmRzKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRXZWVrTnVtYmVyU3VuZGF5KGQsIHApIHtcbiAgcmV0dXJuIHBhZCh0aW1lU3VuZGF5LmNvdW50KHRpbWVZZWFyKGQpLCBkKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdlZWtkYXlOdW1iZXIoZCkge1xuICByZXR1cm4gZC5nZXREYXkoKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0V2Vla051bWJlck1vbmRheShkLCBwKSB7XG4gIHJldHVybiBwYWQodGltZU1vbmRheS5jb3VudCh0aW1lWWVhcihkKSwgZCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldEZ1bGxZZWFyKCkgJSAxMDAsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRGdWxsWWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwMDAsIHAsIDQpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRab25lKGQpIHtcbiAgdmFyIHogPSBkLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gIHJldHVybiAoeiA+IDAgPyBcIi1cIiA6ICh6ICo9IC0xLCBcIitcIikpXG4gICAgICArIHBhZCh6IC8gNjAgfCAwLCBcIjBcIiwgMilcbiAgICAgICsgcGFkKHogJSA2MCwgXCIwXCIsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENEYXlPZk1vbnRoKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ0RhdGUoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ0hvdXIyNChkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENIb3VycygpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDSG91cjEyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ0hvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mWWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoMSArIHV0Y0RheS5jb3VudCh1dGNZZWFyKGQpLCBkKSwgcCwgMyk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ01pbGxpc2Vjb25kcyhkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENNaWxsaXNlY29uZHMoKSwgcCwgMyk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ01vbnRoTnVtYmVyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ01vbnRoKCkgKyAxLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDTWludXRlcyhkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENNaW51dGVzKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENTZWNvbmRzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ1NlY29uZHMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ1dlZWtOdW1iZXJTdW5kYXkoZCwgcCkge1xuICByZXR1cm4gcGFkKHV0Y1N1bmRheS5jb3VudCh1dGNZZWFyKGQpLCBkKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ1dlZWtkYXlOdW1iZXIoZCkge1xuICByZXR1cm4gZC5nZXRVVENEYXkoKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDV2Vla051bWJlck1vbmRheShkLCBwKSB7XG4gIHJldHVybiBwYWQodXRjTW9uZGF5LmNvdW50KHV0Y1llYXIoZCksIGQpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDWWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDRnVsbFllYXIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDWm9uZSgpIHtcbiAgcmV0dXJuIFwiKzAwMDBcIjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TGl0ZXJhbFBlcmNlbnQoKSB7XG4gIHJldHVybiBcIiVcIjtcbn1cbiIsImltcG9ydCB7dXRjRm9ybWF0fSBmcm9tIFwiLi9sb2NhbGVcIjtcblxuZXhwb3J0IHZhciBpc29TcGVjaWZpZXIgPSBcIiVZLSVtLSVkVCVIOiVNOiVTLiVMWlwiO1xuXG5mdW5jdGlvbiBmb3JtYXRJc29OYXRpdmUoZGF0ZSkge1xuICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpO1xufVxuXG52YXIgZm9ybWF0SXNvID0gRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmdcbiAgICA/IGZvcm1hdElzb05hdGl2ZVxuICAgIDogdXRjRm9ybWF0KGlzb1NwZWNpZmllcik7XG5cbmV4cG9ydCBkZWZhdWx0IGZvcm1hdElzbztcbiIsImltcG9ydCB7aXNvU3BlY2lmaWVyfSBmcm9tIFwiLi9pc29Gb3JtYXRcIjtcbmltcG9ydCB7dXRjUGFyc2V9IGZyb20gXCIuL2xvY2FsZVwiO1xuXG5mdW5jdGlvbiBwYXJzZUlzb05hdGl2ZShzdHJpbmcpIHtcbiAgdmFyIGRhdGUgPSBuZXcgRGF0ZShzdHJpbmcpO1xuICByZXR1cm4gaXNOYU4oZGF0ZSkgPyBudWxsIDogZGF0ZTtcbn1cblxudmFyIHBhcnNlSXNvID0gK25ldyBEYXRlKFwiMjAwMC0wMS0wMVQwMDowMDowMC4wMDBaXCIpXG4gICAgPyBwYXJzZUlzb05hdGl2ZVxuICAgIDogdXRjUGFyc2UoaXNvU3BlY2lmaWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgcGFyc2VJc287XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzLm1hdGNoKC8uezZ9L2cpLm1hcChmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIFwiI1wiICsgeDtcbiAgfSk7XG59XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuL2NvbG9yc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCIxZjc3YjRmZjdmMGUyY2EwMmNkNjI3Mjg5NDY3YmQ4YzU2NGJlMzc3YzI3ZjdmN2ZiY2JkMjIxN2JlY2ZcIik7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuL2NvbG9yc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCIzOTNiNzk1MjU0YTM2YjZlY2Y5YzllZGU2Mzc5Mzk4Y2EyNTJiNWNmNmJjZWRiOWM4YzZkMzFiZDllMzllN2JhNTJlN2NiOTQ4NDNjMzlhZDQ5NGFkNjYxNmJlNzk2OWM3YjQxNzNhNTUxOTRjZTZkYmRkZTllZDZcIik7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuL2NvbG9yc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCIzMTgyYmQ2YmFlZDY5ZWNhZTFjNmRiZWZlNjU1MGRmZDhkM2NmZGFlNmJmZGQwYTIzMWEzNTQ3NGM0NzZhMWQ5OWJjN2U5YzA3NTZiYjE5ZTlhYzhiY2JkZGNkYWRhZWI2MzYzNjM5Njk2OTZiZGJkYmRkOWQ5ZDlcIik7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuL2NvbG9yc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCIxZjc3YjRhZWM3ZThmZjdmMGVmZmJiNzgyY2EwMmM5OGRmOGFkNjI3MjhmZjk4OTY5NDY3YmRjNWIwZDU4YzU2NGJjNDljOTRlMzc3YzJmN2I2ZDI3ZjdmN2ZjN2M3YzdiY2JkMjJkYmRiOGQxN2JlY2Y5ZWRhZTVcIik7XG4iLCJpbXBvcnQge2N1YmVoZWxpeH0gZnJvbSBcImQzLWNvbG9yXCI7XG5pbXBvcnQge2ludGVycG9sYXRlQ3ViZWhlbGl4TG9uZ30gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGludGVycG9sYXRlQ3ViZWhlbGl4TG9uZyhjdWJlaGVsaXgoMzAwLCAwLjUsIDAuMCksIGN1YmVoZWxpeCgtMjQwLCAwLjUsIDEuMCkpO1xuIiwiaW1wb3J0IHtjdWJlaGVsaXh9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IHtpbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmd9IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuXG5leHBvcnQgdmFyIHdhcm0gPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmcoY3ViZWhlbGl4KC0xMDAsIDAuNzUsIDAuMzUpLCBjdWJlaGVsaXgoODAsIDEuNTAsIDAuOCkpO1xuXG5leHBvcnQgdmFyIGNvb2wgPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmcoY3ViZWhlbGl4KDI2MCwgMC43NSwgMC4zNSksIGN1YmVoZWxpeCg4MCwgMS41MCwgMC44KSk7XG5cbnZhciByYWluYm93ID0gY3ViZWhlbGl4KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHQpIHtcbiAgaWYgKHQgPCAwIHx8IHQgPiAxKSB0IC09IE1hdGguZmxvb3IodCk7XG4gIHZhciB0cyA9IE1hdGguYWJzKHQgLSAwLjUpO1xuICByYWluYm93LmggPSAzNjAgKiB0IC0gMTAwO1xuICByYWluYm93LnMgPSAxLjUgLSAxLjUgKiB0cztcbiAgcmFpbmJvdy5sID0gMC44IC0gMC45ICogdHM7XG4gIHJldHVybiByYWluYm93ICsgXCJcIjtcbn1cbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4vY29sb3JzXCI7XG5cbmZ1bmN0aW9uIHJhbXAocmFuZ2UpIHtcbiAgdmFyIG4gPSByYW5nZS5sZW5ndGg7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIHJhbmdlW01hdGgubWF4KDAsIE1hdGgubWluKG4gLSAxLCBNYXRoLmZsb29yKHQgKiBuKSkpXTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmFtcChjb2xvcnMoXCI0NDAxNTQ0NDAyNTY0NTA0NTc0NTA1NTk0NjA3NWE0NjA4NWM0NjBhNWQ0NjBiNWU0NzBkNjA0NzBlNjE0NzEwNjM0NzExNjQ0NzEzNjU0ODE0Njc0ODE2Njg0ODE3Njk0ODE4NmE0ODFhNmM0ODFiNmQ0ODFjNmU0ODFkNmY0ODFmNzA0ODIwNzE0ODIxNzM0ODIzNzQ0ODI0NzU0ODI1NzY0ODI2Nzc0ODI4Nzg0ODI5Nzk0NzJhN2E0NzJjN2E0NzJkN2I0NzJlN2M0NzJmN2Q0NjMwN2U0NjMyN2U0NjMzN2Y0NjM0ODA0NTM1ODE0NTM3ODE0NTM4ODI0NDM5ODM0NDNhODM0NDNiODQ0MzNkODQ0MzNlODU0MjNmODU0MjQwODY0MjQxODY0MTQyODc0MTQ0ODc0MDQ1ODg0MDQ2ODgzZjQ3ODgzZjQ4ODkzZTQ5ODkzZTRhODkzZTRjOGEzZDRkOGEzZDRlOGEzYzRmOGEzYzUwOGIzYjUxOGIzYjUyOGIzYTUzOGIzYTU0OGMzOTU1OGMzOTU2OGMzODU4OGMzODU5OGMzNzVhOGMzNzViOGQzNjVjOGQzNjVkOGQzNTVlOGQzNTVmOGQzNDYwOGQzNDYxOGQzMzYyOGQzMzYzOGQzMjY0OGUzMjY1OGUzMTY2OGUzMTY3OGUzMTY4OGUzMDY5OGUzMDZhOGUyZjZiOGUyZjZjOGUyZTZkOGUyZTZlOGUyZTZmOGUyZDcwOGUyZDcxOGUyYzcxOGUyYzcyOGUyYzczOGUyYjc0OGUyYjc1OGUyYTc2OGUyYTc3OGUyYTc4OGUyOTc5OGUyOTdhOGUyOTdiOGUyODdjOGUyODdkOGUyNzdlOGUyNzdmOGUyNzgwOGUyNjgxOGUyNjgyOGUyNjgyOGUyNTgzOGUyNTg0OGUyNTg1OGUyNDg2OGUyNDg3OGUyMzg4OGUyMzg5OGUyMzhhOGQyMjhiOGQyMjhjOGQyMjhkOGQyMThlOGQyMThmOGQyMTkwOGQyMTkxOGMyMDkyOGMyMDkyOGMyMDkzOGMxZjk0OGMxZjk1OGIxZjk2OGIxZjk3OGIxZjk4OGIxZjk5OGExZjlhOGExZTliOGExZTljODkxZTlkODkxZjllODkxZjlmODgxZmEwODgxZmExODgxZmExODcxZmEyODcyMGEzODYyMGE0ODYyMWE1ODUyMWE2ODUyMmE3ODUyMmE4ODQyM2E5ODMyNGFhODMyNWFiODIyNWFjODIyNmFkODEyN2FkODEyOGFlODAyOWFmN2YyYWIwN2YyY2IxN2UyZGIyN2QyZWIzN2MyZmI0N2MzMWI1N2IzMmI2N2EzNGI2NzkzNWI3NzkzN2I4NzgzOGI5NzczYWJhNzYzYmJiNzUzZGJjNzQzZmJjNzM0MGJkNzI0MmJlNzE0NGJmNzA0NmMwNmY0OGMxNmU0YWMxNmQ0Y2MyNmM0ZWMzNmI1MGM0NmE1MmM1Njk1NGM1Njg1NmM2Njc1OGM3NjU1YWM4NjQ1Y2M4NjM1ZWM5NjI2MGNhNjA2M2NiNWY2NWNiNWU2N2NjNWM2OWNkNWI2Y2NkNWE2ZWNlNTg3MGNmNTc3M2QwNTY3NWQwNTQ3N2QxNTM3YWQxNTE3Y2QyNTA3ZmQzNGU4MWQzNGQ4NGQ0NGI4NmQ1NDk4OWQ1NDg4YmQ2NDY4ZWQ2NDU5MGQ3NDM5M2Q3NDE5NWQ4NDA5OGQ4M2U5YmQ5M2M5ZGQ5M2JhMGRhMzlhMmRhMzdhNWRiMzZhOGRiMzRhYWRjMzJhZGRjMzBiMGRkMmZiMmRkMmRiNWRlMmJiOGRlMjliYWRlMjhiZGRmMjZjMGRmMjVjMmRmMjNjNWUwMjFjOGUwMjBjYWUxMWZjZGUxMWRkMGUxMWNkMmUyMWJkNWUyMWFkOGUyMTlkYWUzMTlkZGUzMThkZmUzMThlMmU0MThlNWU0MTllN2U0MTllYWU1MWFlY2U1MWJlZmU1MWNmMWU1MWRmNGU2MWVmNmU2MjBmOGU2MjFmYmU3MjNmZGU3MjVcIikpO1xuXG5leHBvcnQgdmFyIG1hZ21hID0gcmFtcChjb2xvcnMoXCIwMDAwMDQwMTAwMDUwMTAxMDYwMTAxMDgwMjAxMDkwMjAyMGIwMjAyMGQwMzAzMGYwMzAzMTIwNDA0MTQwNTA0MTYwNjA1MTgwNjA1MWEwNzA2MWMwODA3MWUwOTA3MjAwYTA4MjIwYjA5MjQwYzA5MjYwZDBhMjkwZTBiMmIxMDBiMmQxMTBjMmYxMjBkMzExMzBkMzQxNDBlMzYxNTBlMzgxNjBmM2IxODBmM2QxOTEwM2YxYTEwNDIxYzEwNDQxZDExNDcxZTExNDkyMDExNGIyMTExNGUyMjExNTAyNDEyNTMyNTEyNTUyNzEyNTgyOTExNWEyYTExNWMyYzExNWYyZDExNjEyZjExNjMzMTExNjUzMzEwNjczNDEwNjkzNjEwNmIzODEwNmMzOTBmNmUzYjBmNzAzZDBmNzEzZjBmNzI0MDBmNzQ0MjBmNzU0NDBmNzY0NTEwNzc0NzEwNzg0OTEwNzg0YTEwNzk0YzExN2E0ZTExN2I0ZjEyN2I1MTEyN2M1MjEzN2M1NDEzN2Q1NjE0N2Q1NzE1N2U1OTE1N2U1YTE2N2U1YzE2N2Y1ZDE3N2Y1ZjE4N2Y2MDE4ODA2MjE5ODA2NDFhODA2NTFhODA2NzFiODA2ODFjODE2YTFjODE2YjFkODE2ZDFkODE2ZTFlODE3MDFmODE3MjFmODE3MzIwODE3NTIxODE3NjIxODE3ODIyODE3OTIyODI3YjIzODI3YzIzODI3ZTI0ODI4MDI1ODI4MTI1ODE4MzI2ODE4NDI2ODE4NjI3ODE4ODI3ODE4OTI4ODE4YjI5ODE4YzI5ODE4ZTJhODE5MDJhODE5MTJiODE5MzJiODA5NDJjODA5NjJjODA5ODJkODA5OTJkODA5YjJlN2Y5YzJlN2Y5ZTJmN2ZhMDJmN2ZhMTMwN2VhMzMwN2VhNTMxN2VhNjMxN2RhODMyN2RhYTMzN2RhYjMzN2NhZDM0N2NhZTM0N2JiMDM1N2JiMjM1N2JiMzM2N2FiNTM2N2FiNzM3NzliODM3NzliYTM4NzhiYzM5NzhiZDM5NzdiZjNhNzdjMDNhNzZjMjNiNzVjNDNjNzVjNTNjNzRjNzNkNzNjODNlNzNjYTNlNzJjYzNmNzFjZDQwNzFjZjQwNzBkMDQxNmZkMjQyNmZkMzQzNmVkNTQ0NmRkNjQ1NmNkODQ1NmNkOTQ2NmJkYjQ3NmFkYzQ4NjlkZTQ5NjhkZjRhNjhlMDRjNjdlMjRkNjZlMzRlNjVlNDRmNjRlNTUwNjRlNzUyNjNlODUzNjJlOTU0NjJlYTU2NjFlYjU3NjBlYzU4NjBlZDVhNWZlZTViNWVlZjVkNWVmMDVmNWVmMTYwNWRmMjYyNWRmMjY0NWNmMzY1NWNmNDY3NWNmNDY5NWNmNTZiNWNmNjZjNWNmNjZlNWNmNzcwNWNmNzcyNWNmODc0NWNmODc2NWNmOTc4NWRmOTc5NWRmOTdiNWRmYTdkNWVmYTdmNWVmYTgxNWZmYjgzNWZmYjg1NjBmYjg3NjFmYzg5NjFmYzhhNjJmYzhjNjNmYzhlNjRmYzkwNjVmZDkyNjZmZDk0NjdmZDk2NjhmZDk4NjlmZDlhNmFmZDliNmJmZTlkNmNmZTlmNmRmZWExNmVmZWEzNmZmZWE1NzFmZWE3NzJmZWE5NzNmZWFhNzRmZWFjNzZmZWFlNzdmZWIwNzhmZWIyN2FmZWI0N2JmZWI2N2NmZWI3N2VmZWI5N2ZmZWJiODFmZWJkODJmZWJmODRmZWMxODVmZWMyODdmZWM0ODhmZWM2OGFmZWM4OGNmZWNhOGRmZWNjOGZmZWNkOTBmZWNmOTJmZWQxOTRmZWQzOTVmZWQ1OTdmZWQ3OTlmZWQ4OWFmZGRhOWNmZGRjOWVmZGRlYTBmZGUwYTFmZGUyYTNmZGUzYTVmZGU1YTdmZGU3YTlmZGU5YWFmZGViYWNmY2VjYWVmY2VlYjBmY2YwYjJmY2YyYjRmY2Y0YjZmY2Y2YjhmY2Y3YjlmY2Y5YmJmY2ZiYmRmY2ZkYmZcIikpO1xuXG5leHBvcnQgdmFyIGluZmVybm8gPSByYW1wKGNvbG9ycyhcIjAwMDAwNDAxMDAwNTAxMDEwNjAxMDEwODAyMDEwYTAyMDIwYzAyMDIwZTAzMDIxMDA0MDMxMjA0MDMxNDA1MDQxNzA2MDQxOTA3MDUxYjA4MDUxZDA5MDYxZjBhMDcyMjBiMDcyNDBjMDgyNjBkMDgyOTBlMDkyYjEwMDkyZDExMGEzMDEyMGEzMjE0MGIzNDE1MGIzNzE2MGIzOTE4MGMzYzE5MGMzZTFiMGM0MTFjMGM0MzFlMGM0NTFmMGM0ODIxMGM0YTIzMGM0YzI0MGM0ZjI2MGM1MTI4MGI1MzI5MGI1NTJiMGI1NzJkMGI1OTJmMGE1YjMxMGE1YzMyMGE1ZTM0MGE1ZjM2MDk2MTM4MDk2MjM5MDk2MzNiMDk2NDNkMDk2NTNlMDk2NjQwMGE2NzQyMGE2ODQ0MGE2ODQ1MGE2OTQ3MGI2YTQ5MGI2YTRhMGM2YjRjMGM2YjRkMGQ2YzRmMGQ2YzUxMGU2YzUyMGU2ZDU0MGY2ZDU1MGY2ZDU3MTA2ZTU5MTA2ZTVhMTE2ZTVjMTI2ZTVkMTI2ZTVmMTM2ZTYxMTM2ZTYyMTQ2ZTY0MTU2ZTY1MTU2ZTY3MTY2ZTY5MTY2ZTZhMTc2ZTZjMTg2ZTZkMTg2ZTZmMTk2ZTcxMTk2ZTcyMWE2ZTc0MWE2ZTc1MWI2ZTc3MWM2ZDc4MWM2ZDdhMWQ2ZDdjMWQ2ZDdkMWU2ZDdmMWU2YzgwMWY2YzgyMjA2Yzg0MjA2Yjg1MjE2Yjg3MjE2Yjg4MjI2YThhMjI2YThjMjM2OThkMjM2OThmMjQ2OTkwMjU2ODkyMjU2ODkzMjY2Nzk1MjY2Nzk3Mjc2Njk4Mjc2NjlhMjg2NTliMjk2NDlkMjk2NDlmMmE2M2EwMmE2M2EyMmI2MmEzMmM2MWE1MmM2MGE2MmQ2MGE4MmU1ZmE5MmU1ZWFiMmY1ZWFkMzA1ZGFlMzA1Y2IwMzE1YmIxMzI1YWIzMzI1YWI0MzM1OWI2MzQ1OGI3MzU1N2I5MzU1NmJhMzY1NWJjMzc1NGJkMzg1M2JmMzk1MmMwM2E1MWMxM2E1MGMzM2I0ZmM0M2M0ZWM2M2Q0ZGM3M2U0Y2M4M2Y0YmNhNDA0YWNiNDE0OWNjNDI0OGNlNDM0N2NmNDQ0NmQwNDU0NWQyNDY0NGQzNDc0M2Q0NDg0MmQ1NGE0MWQ3NGIzZmQ4NGMzZWQ5NGQzZGRhNGUzY2RiNTAzYmRkNTEzYWRlNTIzOGRmNTMzN2UwNTUzNmUxNTYzNWUyNTczNGUzNTkzM2U0NWEzMWU1NWMzMGU2NWQyZmU3NWUyZWU4NjAyZGU5NjEyYmVhNjMyYWViNjQyOWViNjYyOGVjNjcyNmVkNjkyNWVlNmEyNGVmNmMyM2VmNmUyMWYwNmYyMGYxNzExZmYxNzMxZGYyNzQxY2YzNzYxYmYzNzgxOWY0NzkxOGY1N2IxN2Y1N2QxNWY2N2UxNGY2ODAxM2Y3ODIxMmY3ODQxMGY4ODUwZmY4ODcwZWY4ODkwY2Y5OGIwYmY5OGMwYWY5OGUwOWZhOTAwOGZhOTIwN2ZhOTQwN2ZiOTYwNmZiOTcwNmZiOTkwNmZiOWIwNmZiOWQwN2ZjOWYwN2ZjYTEwOGZjYTMwOWZjYTUwYWZjYTYwY2ZjYTgwZGZjYWEwZmZjYWMxMWZjYWUxMmZjYjAxNGZjYjIxNmZjYjQxOGZiYjYxYWZiYjgxZGZiYmExZmZiYmMyMWZiYmUyM2ZhYzAyNmZhYzIyOGZhYzQyYWZhYzYyZGY5YzcyZmY5YzkzMmY5Y2IzNWY4Y2QzN2Y4Y2YzYWY3ZDEzZGY3ZDM0MGY2ZDU0M2Y2ZDc0NmY1ZDk0OWY1ZGI0Y2Y0ZGQ0ZmY0ZGY1M2Y0ZTE1NmYzZTM1YWYzZTU1ZGYyZTY2MWYyZTg2NWYyZWE2OWYxZWM2ZGYxZWQ3MWYxZWY3NWYxZjE3OWYyZjI3ZGYyZjQ4MmYzZjU4NmYzZjY4YWY0Zjg4ZWY1Zjk5MmY2ZmE5NmY4ZmI5YWY5ZmM5ZGZhZmRhMWZjZmZhNFwiKSk7XG5cbmV4cG9ydCB2YXIgcGxhc21hID0gcmFtcChjb2xvcnMoXCIwZDA4ODcxMDA3ODgxMzA3ODkxNjA3OGExOTA2OGMxYjA2OGQxZDA2OGUyMDA2OGYyMjA2OTAyNDA2OTEyNjA1OTEyODA1OTIyYTA1OTMyYzA1OTQyZTA1OTUyZjA1OTYzMTA1OTczMzA1OTczNTA0OTgzNzA0OTkzODA0OWEzYTA0OWEzYzA0OWIzZTA0OWMzZjA0OWM0MTA0OWQ0MzAzOWU0NDAzOWU0NjAzOWY0ODAzOWY0OTAzYTA0YjAzYTE0YzAyYTE0ZTAyYTI1MDAyYTI1MTAyYTM1MzAyYTM1NTAyYTQ1NjAxYTQ1ODAxYTQ1OTAxYTU1YjAxYTU1YzAxYTY1ZTAxYTY2MDAxYTY2MTAwYTc2MzAwYTc2NDAwYTc2NjAwYTc2NzAwYTg2OTAwYTg2YTAwYTg2YzAwYTg2ZTAwYTg2ZjAwYTg3MTAwYTg3MjAxYTg3NDAxYTg3NTAxYTg3NzAxYTg3ODAxYTg3YTAyYTg3YjAyYTg3ZDAzYTg3ZTAzYTg4MDA0YTg4MTA0YTc4MzA1YTc4NDA1YTc4NjA2YTY4NzA3YTY4ODA4YTY4YTA5YTU4YjBhYTU4ZDBiYTU4ZTBjYTQ4ZjBkYTQ5MTBlYTM5MjBmYTM5NDEwYTI5NTExYTE5NjEzYTE5ODE0YTA5OTE1OWY5YTE2OWY5YzE3OWU5ZDE4OWQ5ZTE5OWRhMDFhOWNhMTFiOWJhMjFkOWFhMzFlOWFhNTFmOTlhNjIwOThhNzIxOTdhODIyOTZhYTIzOTVhYjI0OTRhYzI2OTRhZDI3OTNhZTI4OTJiMDI5OTFiMTJhOTBiMjJiOGZiMzJjOGViNDJlOGRiNTJmOGNiNjMwOGJiNzMxOGFiODMyODliYTMzODhiYjM0ODhiYzM1ODdiZDM3ODZiZTM4ODViZjM5ODRjMDNhODNjMTNiODJjMjNjODFjMzNkODBjNDNlN2ZjNTQwN2VjNjQxN2RjNzQyN2NjODQzN2JjOTQ0N2FjYTQ1N2FjYjQ2NzljYzQ3NzhjYzQ5NzdjZDRhNzZjZTRiNzVjZjRjNzRkMDRkNzNkMTRlNzJkMjRmNzFkMzUxNzFkNDUyNzBkNTUzNmZkNTU0NmVkNjU1NmRkNzU2NmNkODU3NmJkOTU4NmFkYTVhNmFkYTViNjlkYjVjNjhkYzVkNjdkZDVlNjZkZTVmNjVkZTYxNjRkZjYyNjNlMDYzNjNlMTY0NjJlMjY1NjFlMjY2NjBlMzY4NWZlNDY5NWVlNTZhNWRlNTZiNWRlNjZjNWNlNzZlNWJlNzZmNWFlODcwNTllOTcxNThlOTcyNTdlYTc0NTdlYjc1NTZlYjc2NTVlYzc3NTRlZDc5NTNlZDdhNTJlZTdiNTFlZjdjNTFlZjdlNTBmMDdmNGZmMDgwNGVmMTgxNGRmMTgzNGNmMjg0NGJmMzg1NGJmMzg3NGFmNDg4NDlmNDg5NDhmNThiNDdmNThjNDZmNjhkNDVmNjhmNDRmNzkwNDRmNzkxNDNmNzkzNDJmODk0NDFmODk1NDBmOTk3M2ZmOTk4M2VmOTlhM2VmYTliM2RmYTljM2NmYTllM2JmYjlmM2FmYmExMzlmYmEyMzhmY2EzMzhmY2E1MzdmY2E2MzZmY2E4MzVmY2E5MzRmZGFiMzNmZGFjMzNmZGFlMzJmZGFmMzFmZGIxMzBmZGIyMmZmZGI0MmZmZGI1MmVmZWI3MmRmZWI4MmNmZWJhMmNmZWJiMmJmZWJkMmFmZWJlMmFmZWMwMjlmZGMyMjlmZGMzMjhmZGM1MjdmZGM2MjdmZGM4MjdmZGNhMjZmZGNiMjZmY2NkMjVmY2NlMjVmY2QwMjVmY2QyMjVmYmQzMjRmYmQ1MjRmYmQ3MjRmYWQ4MjRmYWRhMjRmOWRjMjRmOWRkMjVmOGRmMjVmOGUxMjVmN2UyMjVmN2U0MjVmNmU2MjZmNmU4MjZmNWU5MjZmNWViMjdmNGVkMjdmM2VlMjdmM2YwMjdmMmYyMjdmMWY0MjZmMWY1MjVmMGY3MjRmMGY5MjFcIikpO1xuIiwiaW1wb3J0IFJlYWN0aXZlTW9kZWwgZnJvbSBcInJlYWN0aXZlLW1vZGVsXCI7XG5pbXBvcnQgU1ZHIGZyb20gXCIuLi9taXhpbnMvc3ZnXCI7XG5pbXBvcnQgRGF0YSBmcm9tIFwiLi4vbWl4aW5zL2RhdGFcIjtcbmltcG9ydCBNYXJnaW4gZnJvbSBcIi4uL21peGlucy9tYXJnaW5cIjtcbmltcG9ydCBDb2x1bW4gZnJvbSBcIi4uL21peGlucy9jb2x1bW5cIjtcbmltcG9ydCBTY2FsZSBmcm9tIFwiLi4vbWl4aW5zL3NjYWxlXCI7XG5cbmltcG9ydCB7IGV4dGVudCwgbWF4IH0gZnJvbSBcImQzLWFycmF5XCI7XG5pbXBvcnQgeyBzY2FsZUxpbmVhciwgc2NhbGVTcXJ0IH0gZnJvbSBcImQzLXNjYWxlXCI7XG5cbmltcG9ydCB7IGxvY2FsIH0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDaXJjbGUoKXtcbiAgcmV0dXJuIFJlYWN0aXZlTW9kZWwoKVxuICAgIC5jYWxsKFNWRylcbiAgICAuY2FsbChNYXJnaW4pXG4gICAgLmNhbGwoRGF0YSlcblxuICAgIC5jYWxsKENvbHVtbiwgXCJ4XCIpXG4gICAgLmNhbGwoQ29sdW1uLCBcInlcIilcbiAgICAuY2FsbChDb2x1bW4sIFwic2l6ZVwiKVxuXG4gICAgLy8gVGhlIHggc2NhbGUuXG4gICAgKFwieERvbWFpblwiLCBmdW5jdGlvbiAoZGF0YSwgYWNjZXNzb3Ipe1xuICAgICAgcmV0dXJuIGV4dGVudChkYXRhLCBhY2Nlc3Nvcik7XG4gICAgfSwgXCJkYXRhLCB4QWNjZXNzb3JcIilcbiAgICAoXCJ4UmFuZ2VcIiwgZnVuY3Rpb24gKGlubmVyV2lkdGgpe1xuICAgICAgcmV0dXJuIFswLCBpbm5lcldpZHRoXTtcbiAgICB9LCBcImlubmVyV2lkdGhcIilcbiAgICAuY2FsbChTY2FsZSwgXCJ4XCIsIHNjYWxlTGluZWFyKVxuXG4gICAgLy8gVGhlIHkgc2NhbGUuXG4gICAgKFwieURvbWFpblwiLCBmdW5jdGlvbiAoZGF0YSwgYWNjZXNzb3Ipe1xuICAgICAgcmV0dXJuIGV4dGVudChkYXRhLCBhY2Nlc3Nvcik7XG4gICAgfSwgXCJkYXRhLCB5QWNjZXNzb3JcIilcbiAgICAoXCJ5UmFuZ2VcIiwgZnVuY3Rpb24gKGlubmVySGVpZ2h0KXtcbiAgICAgIHJldHVybiBbaW5uZXJIZWlnaHQsIDBdO1xuICAgIH0sIFwiaW5uZXJIZWlnaHRcIilcbiAgICAuY2FsbChTY2FsZSwgXCJ5XCIsIHNjYWxlTGluZWFyKVxuXG4gICAgLy8gVGhlIHNpemUgc2NhbGUuXG4gICAgKFwic2l6ZU1heFwiLCAyMClcbiAgICAoXCJzaXplRG9tYWluXCIsIGZ1bmN0aW9uIChkYXRhLCBhY2Nlc3Nvcil7XG4gICAgICByZXR1cm4gWzAsIG1heChkYXRhLCBhY2Nlc3NvcildO1xuICAgIH0sIFwiZGF0YSwgc2l6ZUFjY2Vzc29yXCIpXG4gICAgKFwic2l6ZVJhbmdlXCIsIGZ1bmN0aW9uIChzaXplTWF4KXtcbiAgICAgIHJldHVybiBbMCwgc2l6ZU1heF07XG4gICAgfSwgXCJzaXplTWF4XCIpXG4gICAgLmNhbGwoU2NhbGUsIFwic2l6ZVwiLCBzY2FsZVNxcnQpXG5cbiAgICAvLyBUaGlzIGlzIHRoZSBzaW5nbGUgU1ZHIGdyb3VwIGZvciB0aGUgc2NhdHRlciBsYXllci5cbiAgICAoXCJzY2F0dGVyTGF5ZXJcIiwgZnVuY3Rpb24gKGcpe1xuXG4gICAgICB2YXIgc2NhdHRlckxheWVyID0gZy5zZWxlY3RBbGwoXCIucmVhY3RpdmUtdmlzLXNjYXR0ZXItbGF5ZXJcIilcbiAgICAgICAgLmRhdGEoWzFdKTtcblxuICAgICAgcmV0dXJuIHNjYXR0ZXJMYXllci5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwicmVhY3RpdmUtdmlzLXNjYXR0ZXItbGF5ZXJcIilcbiAgICAgICAgLm1lcmdlKHNjYXR0ZXJMYXllcik7XG5cbiAgICB9LCBcImdcIilcblxuICAgIC8vIFRoaXMgaXMgdGhlIHNlbGVjdGlvbiBvZiBtYW55IGcgZWxlbWVudHMsIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRhdGEuXG4gICAgKFwibWFya3NcIiwgZnVuY3Rpb24gKHNjYXR0ZXJMYXllciwgZGF0YSwgeFNjYWxlZCwgeVNjYWxlZCwgc2l6ZVNjYWxlZCl7XG5cbiAgICAgIHZhciBzY2F0dGVyID0gc2NhdHRlckxheWVyLnNlbGVjdEFsbChcIi5yZWFjdGl2ZS12aXMtc2NhdHRlci1tYXJrXCIpXG4gICAgICAgIC5kYXRhKGRhdGEpO1xuXG4gICAgICBzY2F0dGVyLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgICAgdmFyIHNpemVMb2NhbCA9IGxvY2FsKCk7XG5cbiAgICAgIHZhciBtYXJrcyA9IHNjYXR0ZXIuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInJlYWN0aXZlLXZpcy1zY2F0dGVyLW1hcmtcIilcbiAgICAgICAgLm1lcmdlKHNjYXR0ZXIpXG4gICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpe1xuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeFNjYWxlZChkKSArIFwiLFwiICsgeVNjYWxlZChkKSArIFwiKVwiO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgc2l6ZUxvY2FsLnNldCh0aGlzLCBzaXplU2NhbGVkKGQpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgbWFya3Muc2l6ZUxvY2FsID0gc2l6ZUxvY2FsO1xuXG4gICAgICByZXR1cm4gbWFya3M7XG4gICAgfSwgXCJzY2F0dGVyTGF5ZXIsIGRhdGEsIHhTY2FsZWQsIHlTY2FsZWQsIHNpemVTY2FsZWRcIik7XG59XG4iLCJpbXBvcnQgUmVhY3RpdmVNb2RlbCBmcm9tIFwicmVhY3RpdmUtbW9kZWxcIjtcblxuaW1wb3J0IFwiZDMtdHJhbnNpdGlvblwiO1xuXG4vLyBNaXhpbnNcbmltcG9ydCBTVkcgICAgZnJvbSBcIi4vbWl4aW5zL3N2Z1wiO1xuaW1wb3J0IE1hcmdpbiBmcm9tIFwiLi9taXhpbnMvbWFyZ2luXCI7XG5pbXBvcnQgRGF0YSAgIGZyb20gXCIuL21peGlucy9kYXRhXCI7XG5pbXBvcnQgQ29sdW1uIGZyb20gXCIuL21peGlucy9jb2x1bW5cIjtcbmltcG9ydCBTY2FsZSAgZnJvbSBcIi4vbWl4aW5zL3NjYWxlXCI7XG5pbXBvcnQgUmVzaXplIGZyb20gXCIuL21peGlucy9yZXNpemVcIjtcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IENpcmNsZSAgZnJvbSBcIi4vY29tcG9uZW50cy9jaXJjbGVcIjtcbmltcG9ydCBTY2F0dGVyIGZyb20gXCIuL2NvbXBvbmVudHMvc2NhdHRlclwiO1xuXG4vLyBUaGlzIG5lZWRzIHRvIGJlIHVzZWQgdG8gY29uc3RydWN0IFJlYWN0aXZlTW9kZWwgaW5zdGFuY2VzLFxuLy8gYmVjYXVzZSBpdCBpcyB0aGUgdmVyc2lvbiB0aGF0J3MgYnVuZGxlZCB3aXRoaW4gUmVhY3RpdmVWaXMuXG4vLyBJZiBhbiBleHRlcm5hbGx5IGxvYWRlZCBpbnN0YW5jZSBvZiB0aGUgUmVhY3RpdmVNb2RlbCBtb2R1bGVcbi8vIChmcm9tIE5QTSkgaXMgdXNlZCwgdGhlIFwiZGlnZXN0XCIgZnVuY3Rpb24gd29uJ3Qgd29yayBjb3JyZWN0bHksXG4vLyBiZWNhdXNlIHRoZSB0d28gbW9kdWxlcyBoYXZlIGRpZmZlcmVudCBkYXRhIGZsb3cgZ3JhcGhzLlxuZXhwb3J0IHZhciBNb2RlbCA9IFJlYWN0aXZlTW9kZWw7XG5cbi8vIEV4cG9zZSBkaWdlc3QgYXQgdGhpcyBsZXZlbCBmb3IgY29udmVuaWVuY2UuXG5leHBvcnQgdmFyIGRpZ2VzdCA9IFJlYWN0aXZlTW9kZWwuZGlnZXN0O1xuXG5leHBvcnQge1xuICBTVkcsXG4gIE1hcmdpbixcbiAgRGF0YSxcbiAgQ29sdW1uLFxuICBTY2FsZSxcbiAgUmVzaXplLFxuXG4gIENpcmNsZSxcbiAgU2NhdHRlclxufTtcbiJdLCJuYW1lcyI6WyJ0aGlzIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDAiLCJwYXJzZVR5cGVuYW1lcyIsImdldCIsInNldCIsImRlZmluZSIsInJnYiIsImhzbCIsImhjbCIsImNvbnN0YW50IiwiY3ViZWhlbGl4IiwiY29sb3JDdWJlaGVsaXgiLCJjb2xvciIsInhodG1sIiwibmFtZXNwYWNlcyIsImNyZWF0b3JJbmhlcml0IiwiY3JlYXRvckZpeGVkIiwibmFtZXNwYWNlIiwibmV4dElkIiwibG9jYWwiLCJMb2NhbCIsIm1hdGNoZXIiLCJlbGVtZW50IiwidmVuZG9yTWF0Y2hlcyIsImZpbHRlckV2ZW50cyIsImV2ZW50IiwiZmlsdGVyQ29udGV4dExpc3RlbmVyIiwiY29udGV4dExpc3RlbmVyIiwib25SZW1vdmUiLCJvbkFkZCIsInNlbGVjdG9yIiwiU2VsZWN0aW9uIiwic2VsZWN0b3JBbGwiLCJrZXlQcmVmaXgiLCJiaW5kSW5kZXgiLCJFbnRlck5vZGUiLCJiaW5kS2V5Iiwic3BhcnNlIiwiYXNjZW5kaW5nIiwiYXR0clJlbW92ZSIsImF0dHJSZW1vdmVOUyIsImF0dHJDb25zdGFudCIsImF0dHJDb25zdGFudE5TIiwiYXR0ckZ1bmN0aW9uIiwiYXR0ckZ1bmN0aW9uTlMiLCJzdHlsZVJlbW92ZSIsInN0eWxlQ29uc3RhbnQiLCJzdHlsZUZ1bmN0aW9uIiwicHJvcGVydHlSZW1vdmUiLCJwcm9wZXJ0eUNvbnN0YW50IiwicHJvcGVydHlGdW5jdGlvbiIsImNsYXNzQXJyYXkiLCJjbGFzc0xpc3QiLCJDbGFzc0xpc3QiLCJjbGFzc2VkQWRkIiwiY2xhc3NlZFJlbW92ZSIsImNsYXNzZWRUcnVlIiwiY2xhc3NlZEZhbHNlIiwiY2xhc3NlZEZ1bmN0aW9uIiwidGV4dFJlbW92ZSIsInRleHRDb25zdGFudCIsInRleHRGdW5jdGlvbiIsImh0bWxSZW1vdmUiLCJodG1sQ29uc3RhbnQiLCJodG1sRnVuY3Rpb24iLCJyYWlzZSIsImxvd2VyIiwiY3JlYXRvciIsImNvbnN0YW50TnVsbCIsInJlbW92ZSIsImRpc3BhdGNoRXZlbnQiLCJkaXNwYXRjaENvbnN0YW50IiwiZGlzcGF0Y2hGdW5jdGlvbiIsInJvb3QiLCJzZWxlY3Rpb24iLCJzZWxlY3Rpb25fc2VsZWN0Iiwic2VsZWN0aW9uX3NlbGVjdEFsbCIsInNlbGVjdGlvbl9maWx0ZXIiLCJzZWxlY3Rpb25fZGF0YSIsInNlbGVjdGlvbl9lbnRlciIsInNlbGVjdGlvbl9leGl0Iiwic2VsZWN0aW9uX21lcmdlIiwic2VsZWN0aW9uX29yZGVyIiwic2VsZWN0aW9uX3NvcnQiLCJzZWxlY3Rpb25fY2FsbCIsInNlbGVjdGlvbl9ub2RlcyIsInNlbGVjdGlvbl9ub2RlIiwic2VsZWN0aW9uX3NpemUiLCJzZWxlY3Rpb25fZW1wdHkiLCJzZWxlY3Rpb25fZWFjaCIsInNlbGVjdGlvbl9hdHRyIiwic2VsZWN0aW9uX3N0eWxlIiwic2VsZWN0aW9uX3Byb3BlcnR5Iiwic2VsZWN0aW9uX2NsYXNzZWQiLCJzZWxlY3Rpb25fdGV4dCIsInNlbGVjdGlvbl9odG1sIiwic2VsZWN0aW9uX3JhaXNlIiwic2VsZWN0aW9uX2xvd2VyIiwic2VsZWN0aW9uX2FwcGVuZCIsInNlbGVjdGlvbl9pbnNlcnQiLCJzZWxlY3Rpb25fcmVtb3ZlIiwic2VsZWN0aW9uX2RhdHVtIiwic2VsZWN0aW9uX29uIiwic2VsZWN0aW9uX2Rpc3BhdGNoIiwic2VsZWN0IiwiYXNjZW5kaW5nQ29tcGFyYXRvciIsImFzY2VuZGluZ0Jpc2VjdCIsImJpc2VjdG9yIiwiYmlzZWN0UmlnaHQiLCJlMTAiLCJlNSIsImUyIiwidGlja1N0ZXAiLCJyYW5nZSIsImFycmF5IiwibWFwIiwic2xpY2UiLCJleHRlbmQiLCJDb2xvciIsImRhcmtlciIsImJyaWdodGVyIiwicmVIZXgzIiwicmVIZXg2IiwicmVSZ2JJbnRlZ2VyIiwicmVSZ2JQZXJjZW50IiwicmVSZ2JhSW50ZWdlciIsInJlUmdiYVBlcmNlbnQiLCJyZUhzbFBlcmNlbnQiLCJyZUhzbGFQZXJjZW50IiwibmFtZWQiLCJSZ2IiLCJyZ2JuIiwicmdiYSIsImhzbGEiLCJyZ2JDb252ZXJ0IiwiSHNsIiwiaHNsQ29udmVydCIsImhzbDJyZ2IiLCJkZWcycmFkIiwicmFkMmRlZyIsIktuIiwiWG4iLCJZbiIsIlpuIiwidDAiLCJ0MSIsInQyIiwidDMiLCJsYWJDb252ZXJ0IiwiTGFiIiwiSGNsIiwicmdiMnh5eiIsInh5ejJsYWIiLCJsYWIiLCJsYWIyeHl6IiwieHl6MnJnYiIsImhjbENvbnZlcnQiLCJBIiwiQiIsIkMiLCJEIiwiRSIsIkVEIiwiRUIiLCJCQ19EQSIsImN1YmVoZWxpeENvbnZlcnQiLCJDdWJlaGVsaXgiLCJsaW5lYXIiLCJleHBvbmVudGlhbCIsImh1ZSIsImdhbW1hIiwibm9nYW1tYSIsImNvbG9yUmdiIiwidmFsdWUiLCJyZUEiLCJyZUIiLCJ6ZXJvIiwib25lIiwibnVtYmVyIiwib2JqZWN0IiwiY3ViZWhlbGl4TG9uZyIsImRlaW50ZXJwb2xhdGVMaW5lYXIiLCJiaXNlY3QiLCJkZWludGVycG9sYXRlIiwiaWRlbnRpdHkiLCJleHBvbmVudCIsInRpY2tzIiwiaW50ZXJ2YWwiLCJkdXJhdGlvblNlY29uZCIsImR1cmF0aW9uTWludXRlIiwiZHVyYXRpb25Ib3VyIiwiZHVyYXRpb25EYXkiLCJkdXJhdGlvbldlZWsiLCJzdW5kYXkiLCJtb25kYXkiLCJ1dGNTdW5kYXkiLCJkZWZhdWx0TG9jYWxlIiwiZm9ybWF0TG9jYWxlIiwidGltZURheSIsInRpbWVZZWFyIiwiQ2lyY2xlIiwic2NhbGVMaW5lYXIiLCJzY2FsZVNxcnQiXSwibWFwcGluZ3MiOiI7Ozs7OztDQUNPLElBQUksY0FBYyxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsR0FBRyxNQUFNLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLElBQUksS0FBSyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUU7O0FBRXJKLEFBQU8sQ0FBQSxTQUFTLG9CQUFvQixDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDakQsQ0FBQSxDQUFDLE9BQU8sTUFBTSxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDN0UsQ0FBQTs7O0FDTEEsQ0FBQTtBQUNBLENBQUEsQ0FBQyxVQUFVLE1BQU0sRUFBRSxPQUFPLEVBQUU7R0FDMUIsT0FBTyxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sRUFBRTtHQUN6RixPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7RUFDdEcsQ0FBQ0EsY0FBSSxFQUFFLFlBQVksRUFBRSxZQUFZ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QUUsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkssQ0FBQSxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM1RCxDQUFBLFFBQVEsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0RSxDQUFBLFFBQVEsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMxRyxDQUFBLFFBQVEsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkUsQ0FBQSxRQUFRLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNHLENBQUEsUUFBUSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQy9FLENBQUEsUUFBUSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25GLENBQUEsUUFBUSxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUQsQ0FBQSxRQUFRLE1BQU0sS0FBSyxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVELENBQUEsUUFBUSxJQUFJLENBQUM7QUFDYixDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDakIsQ0FBQSxFQUFFLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDOUIsQ0FBQSxFQUFFLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDOUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxHQUFHLENBQUM7QUFDekIsQ0FBQSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZCxDQUFBLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0MsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTQyxRQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO0FBQ3RDLENBQUEsRUFBRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNsRyxDQUFBLENBQUM7O0FBRUQsQUFBTyxDQUFBLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtBQUN0QyxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNkLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2QsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZCxDQUFBLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUMxQixDQUFBLENBQUM7O0FBRURELFNBQU0sQ0FBQyxHQUFHLEVBQUVDLFFBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQy9CLENBQUEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUU7QUFDeEIsQ0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFBLElBQUksT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckUsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRTtBQUN0QixDQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUEsSUFBSSxPQUFPLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRSxDQUFBLEdBQUc7QUFDSCxDQUFBLEVBQUUsR0FBRyxFQUFFLFdBQVc7QUFDbEIsQ0FBQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUEsR0FBRztBQUNILENBQUEsRUFBRSxXQUFXLEVBQUUsV0FBVztBQUMxQixDQUFBLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3pDLENBQUEsV0FBVyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3pDLENBQUEsV0FBVyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3pDLENBQUEsV0FBVyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEQsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxFQUFFLFFBQVEsRUFBRSxXQUFXO0FBQ3ZCLENBQUEsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RSxDQUFBLElBQUksT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUN2QyxDQUFBLFVBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJO0FBQ3BFLENBQUEsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7QUFDcEUsQ0FBQSxVQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUEsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDM0MsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVKLENBQUEsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzFCLENBQUEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzlCLENBQUEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN6QyxDQUFBLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDM0IsQ0FBQSxFQUFFLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDOUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQztBQUN6QixDQUFBLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2QsQ0FBQSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRztBQUNuQixDQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRztBQUNuQixDQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRztBQUNuQixDQUFBLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsQ0FBQSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLENBQUEsTUFBTSxDQUFDLEdBQUcsR0FBRztBQUNiLENBQUEsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFDbkIsQ0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ1QsQ0FBQSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRCxDQUFBLFNBQVMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLENBQUEsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUM3QyxDQUFBLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLENBQUEsR0FBRyxNQUFNO0FBQ1QsQ0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixDQUFBLEdBQUc7QUFDSCxDQUFBLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTQyxRQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO0FBQ3RDLENBQUEsRUFBRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNsRyxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUU7QUFDL0IsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZCxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNkLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2QsQ0FBQSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDMUIsQ0FBQSxDQUFDOztBQUVERixTQUFNLENBQUMsR0FBRyxFQUFFRSxRQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUMvQixDQUFBLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFO0FBQ3hCLENBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckQsQ0FBQSxJQUFJLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3RCxDQUFBLEdBQUc7QUFDSCxDQUFBLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFO0FBQ3RCLENBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxNQUFN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LENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixDQUFBLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUEsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsQ0FBQSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN2RSxDQUFBLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZFLENBQUEsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4RSxDQUFBLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RSxDQUFBLENBQUM7O0FBRUQsQUFBZSxDQUFBLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtBQUM5QyxDQUFBLEVBQUUsT0FBTyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDbEcsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUU7QUFDdEMsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZCxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNkLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2QsQ0FBQSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDMUIsQ0FBQSxDQUFDOztBQUVERixTQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQy9CLENBQUEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUU7QUFDeEIsQ0FBQSxJQUFJLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BGLENBQUEsR0FBRztBQUNILENBQUEsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLEVBQUU7QUFDdEIsQ0FBQSxJQUFJLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFD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QUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsQ0FBQSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3pDLENBQUEsRUFBRSxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEYsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTRyxRQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO0FBQ3RDLENBQUEsRUFBRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNsRyxDQUFBLENBQUM7O0FBRUQsQUFBTyxDQUFBLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtBQUN0QyxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNkLENB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QyxFQUFFLENBQUMsRUFBRTtBQUM5QyxDQUFBLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDOztBQUUzRCxDQUFBLEVBQUUsU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBQ3hCLENBQUEsSUFBSSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUEsR0FBRzs7QUFFSCxDQUFBLEVBQUUsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ25FLENBQUEsRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUFFMUQsQ0FBQSxFQUFFLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUV0QixBQUFPLENBQUEsSUFBSSxVQUFVLEdBQUcsQ0FBQyxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQy9DLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcs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T0FBTztBQUNQLENBQUEsS0FBSztBQUNMLENBQUEsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDNUQsQ0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdkcsQ0FBQSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLENBQUEsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLENBQUEsR0FBRyxDQUFDO0FBQ0osQ0FBQSxDQUFDOztBQUVELHdCQUF1QixDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ2xELENBQUEsRUFBRSxJQUFJLFNBQVMsR0FBR3pCLGdCQUFjLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7O0FBRTVFLENBQUEsRUFBRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzVCLENBQUEsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQzlCLENBQUEsSUFBSSxJQUFJLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUMxRCxDQUFBLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENB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QUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUMzSyxDQUFBLElBQUksS0FBSyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDckksQ0FBQSxNQUFNLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDekMsQ0FBQSxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDeEIsQ0FBQSxPQUFPO0FBQ1AsQ0FBQSxLQUFLO0FBQ0wsQ0FBQSxHQUFHOztBQUVILENBQUEsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDdEIsQ0FBQSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsQ0FBQSxHQUFHOztBQUVILENBQUEsRUFBRSxPQUFPLElBQUlOLFdBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLENBQUEsQ0FBQzs7QUNqQkQsMkJBQXVCLEdBQUc7O0FBRTFCLENBQUEsRUFBRSxLQUFLLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRztBQUN2RSxDQUFBLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRztBQUN4RixDQUFBLE1BQU0sSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzNCLENBQUEsUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEYsQ0FBQSxRQUFRLElBQUksR0FBRyxJQUFJLENBQUM7QUFDcEIsQ0FBQSxPQUFPO0FBQ1AsQ0FBQSxLQUFLO0FBQ0wsQ0FBQSxHQUFHOztBQUVILENBQUEsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUEsQ0FBQzs7QUNWRCwwQkFBdUIsQ0FBQyxPQUFPLEVBQUU7QUFDakMsQ0FBQSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxHQUFHTyxXQUFTLENBQUM7O0FBRXBDLENBQUEsRUFBRSxTQUFTLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzdCLENBQUEsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUEsR0FBRzs7QUFFSCxDQUFBLEVBQUUsS0FBSyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDbkcsQ0FBQSxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNySCxDQUFBLE1BQU0sSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzNCLENBQUEsUUFBUSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzVCLENBQUEsT0FBTztBQUNQLENBQUEsS0FBSztBQUNMLENBQUEsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2hDLENBQUEsR0FBRzs7QUFFSCxDQUFBLEVBQUUsT0FBTyxJQUFJUCxXQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMxRCxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTTyxXQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN6QixDQUFBLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNuRCxDQUFBLENBQUM7O0FDdkJELDBCQUF1QixHQUFHO0FBQzFCLENBQUEsRUFBRSxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDdEIsQ0FBQSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2xDLENBQUEsRUFBRSxPQUFP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Q0FBQzs7QUFFUixDQUFBLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO0FBQ2pCLENBQUEsSUFBSSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDL0UsQ0FBQSxJQUFJLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO0FBQ2hELENBQUEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixDQUFBLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQSxLQUFLO0FBQ0wsQ0FBQSxHQUFHOztBQUVILENBQUEsT0FBTztBQUNQLENBQUEsSUFBSSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUM1RixDQUFBLElBQUksT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUM3RCxDQUFBLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxD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QUUsT0FBTyxDQUFDLENBQUMsR0FBRzZHLFFBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUlTLEtBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZLLENBQUEsUUFBUSxDQUFDLENBQUMsR0FBR1IsUUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHUyxNQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM1RCxDQUFBLFFBQVEsQ0FBQyxDQUFDLEdBQUdSLGNBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJTyxLQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RFLENBQUEsUUFBUSxDQUFDLENBQUMsR0FBR04sY0FBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUlNLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcs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V0FBVztBQUN2QixDQUFBLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekUsQ0FBQSxJQUFJLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDdkMsQ0FBQSxVQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSTtBQUNwRSxDQUFBLFVBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJO0FBQ3BFLENBQUEsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFBLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLENBQUEsR0FBRztBQUNILENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFSixDQUFBLFNBQVNHLE1BQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDOUIsQ0FBQSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3pDLENBQUEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUMzQixDQUFBLEVBQUUsT0FBTyxJQUFJRSxLQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTQyxZQUFVLENBQUMsQ0FBQyxFQUFFO0FBQzlCLENBQUEsRUFBRSxJQUFJLENBQUMsWUFBWUQsS0FBRyxFQUFFLE9BQU8sSUFBSUEsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZakIsT0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHMUcsT0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSTJILEtBQUcsQ0FBQztBQUN6QixDQUFBLEVBQUUsSUFBSSxDQUFDLFlBQVlBLEtBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFBLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNkLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7QUFDbkIsQ0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7QUFDbkIsQ0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7QUFDbkIsQ0FBQSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLENBQUEsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QixDQUFBLE1BQU0sQ0FBQyxHQUFHLEdBQUc7QUFDYixDQUFBLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQ25CLENBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLENBQUEsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUNULENBQUEsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakQsQ0FBQSxTQUFTLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QyxDQUFBLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDN0MsQ0FBQSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixDQUFBLEdBQUcsTUFBTTtBQUNULENBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsQ0FBQSxHQUFHO0FB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RSxDQUFDOztBQUV6QixDQUFBO0FBQ0EsQ0FBQSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEdBQUdELEtBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsQ0FBQSxTQUFTLENBQUMsRUFBRSxHQUFHQyxLQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDN0IsQ0FBQSxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRTtBQUM5QixDQUFBLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLENBQUEsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNCLENBQUEsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkIsQ0FBQSxLQUFLO0FBQ0wsQ0FBQSxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdkMsQ0FBQSxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDM0IsQ0FBQSxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN2QixDQUFBLEtBQUssTUFBTTtBQUNYLENBQUEsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDcEIsQ0FBQSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRUcsYUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsQ0FBQSxLQUFLO0FBQ0wsQ0FBQSxJQUFJLEVBQUUsR0FBR0gsS0FBRyxDQUFDLFNBQVMsQ0FBQztBQUN2QixDQUFBLEdBQUc7O0FBRUgsQ0FBQTtBQUNBLENBQUEsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3JCLENBQUEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQixDQUFBLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6QixDQUFBLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLENBQUEsR0FBRzs7QUFFSCxDQUFBO0FBQ0EsQ0FBQTtBQUNBLENBQUEsRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixDQUFBLFFBQVFFLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUEsUUFBUUQsTUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLENBQUEsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFO0FBQ25DLENBQUEsVUFBVSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRSxDQUFBLFVBQVUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLENBQUEsU0FBUyxDQUFDLENBQUM7QUFDWCxD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Q2QsQ0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQSxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLENBQUEsUUFBUSxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixDQUFBLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDM0IsQ0FBQSxNQUFNLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDbEUsQ0FBQSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLENBQUEsTUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsTUFBTTtBQUMzQyxDQUFBLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELENBQUEsS0FBSzs7QUFFTCxDQUFBLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUEsR0FBRyxDQUFDO0FBQ0osQ0FBQSxDQUFDOztBQ2pCRCx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzlCLENBQUEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdkIsQ0FBQSxFQUFFLEdBQUcsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcs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SSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7O0FBRTlCLENBQUE7QUFDQSxDQUFBO0FBQ0EsQ0FBQSxJQUFJLElBQUksTUFBTSxHQUFHLE1BQU0sS0FBSyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7QUFDckgsQ0FBQSxRQUFRLE1BQU0sR0FBRyxNQUFNLEtBQUssR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7O0FBRTdFLENBQUE7QUFDQSxDQUFBO0FBQ0EsQ0FBQTtBQUNBLENBQUEsSUFBSSxJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDO0FBQ3RDLENBQUEsUUFBUSxXQUFXLEdBQUcsQ0FBQyxJQUFJLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdkQsQ0FBQTtBQUNBLENBQUE7QUFDQSxDQUFBO0FBQ0EsQ0FBQTtBQUNBLENBQUEsSUFBSSxTQUFTLEdBQUcsU0FBUyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25ELENBQUEsVUFBVSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3BFLENBQUEsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDOztBQUUvQyxDQUFBLElBQUksU0FBUyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQzNCLENBQUEs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SSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxDQUFBLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDckQsQ0FBQSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQzlGLENBQUEsSUFBSSxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFBLEdBQUcsQ0FBQzs7QUFFSixDQUFBLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxTQUFTLElBQUksRUFBRTtBQUNuQyxDQUFBLElBQUksT0FBTyxXQUFXLENBQUMsU0FBUyxJQUFJLEVBQUU7QUFDdEMsQ0FBQSxNQUFNLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUEsS0FBSyxFQUFFLFNBQVMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUM1QixDQUFBLE1BQU0sT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsT0FBTyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBQSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUEsR0FBRyxDQUFDOztBQUVKLENBQUEsRUFBRSxJQUFJLEtBQUssRUFBRTtBQUNiLENBQUEsSUFBSSxRQUFRLENBQUMsS0FBSyxHQUFHLFNBQVMsS0FBSyxFQUFFLEdBQUcsRUFBRTtBQUMxQyxDQUFBLE1BQU1ELElBQUUs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QyxFQUFFO0FBQ3RCLENBQUEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFO0FBQzdCLENBQUEsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUEsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixDQUFBLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELENBQUEsQ0FBQzs7QUFFRCxDQUFBLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRTtBQUNwQixDQUFBLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRTtBQUM3QixDQUFBLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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QUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUEsQ0FBQzs7QUFFRCxDQUFBLFNBQVMsYUFBYSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQ3JDLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUNqQyxDQUFBLEVBQUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxDQUFBLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlFLENBQUEsQ0FBQzs7QUFFRCxD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