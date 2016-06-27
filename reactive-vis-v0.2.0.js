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

	var xhtml = "http://www.w3.org/1999/xhtml";

	var namespaces = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	function namespace(name) {
	  var prefix = name += "", i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
	}

	function creatorInherit(name) {
	  return function() {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml && document.documentElement.namespaceURI === xhtml
	        ? document.createElement(name)
	        : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed(fullname) {
	  return function() {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	function creator(name) {
	  var fullname = namespace(name);
	  return (fullname.local
	      ? creatorFixed
	      : creatorInherit)(fullname);
	}

	var nextId = 0;

	function local() {
	  return new Local;
	}

	function Local() {
	  this._ = "@" + (++nextId).toString(36);
	}

	Local.prototype = local.prototype = {
	  constructor: Local,
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

	var matcher = function(selector) {
	  return function() {
	    return this.matches(selector);
	  };
	};

	if (typeof document !== "undefined") {
	  var element = document.documentElement;
	  if (!element.matches) {
	    var vendorMatches = element.webkitMatchesSelector
	        || element.msMatchesSelector
	        || element.mozMatchesSelector
	        || element.oMatchesSelector;
	    matcher = function(selector) {
	      return function() {
	        return vendorMatches.call(this, selector);
	      };
	    };
	  }
	}

	var matcher$1 = matcher;

	var filterEvents = {};

	var event = null;

	if (typeof document !== "undefined") {
	  var element$1 = document.documentElement;
	  if (!("onmouseenter" in element$1)) {
	    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
	  }
	}

	function filterContextListener(listener, index, group) {
	  listener = contextListener(listener, index, group);
	  return function(event) {
	    var related = event.relatedTarget;
	    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
	      listener.call(this, event);
	    }
	  };
	}

	function contextListener(listener, index, group) {
	  return function(event1) {
	    var event0 = event; // Events can be reentrant (e.g., focus).
	    event = event1;
	    try {
	      listener.call(this, this.__data__, index, group);
	    } finally {
	      event = event0;
	    }
	  };
	}

	function parseTypenames(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return {type: t, name: name};
	  });
	}

	function onRemove(typename) {
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

	function onAdd(typename, value, capture) {
	  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
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

	function selection_on(typename, value, capture) {
	  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

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

	  on = value ? onAdd : onRemove;
	  if (capture == null) capture = false;
	  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
	  return this;
	}

	function selector(selector) {
	  return function() {
	    return this.querySelector(selector);
	  };
	}

	function selection_select(select) {
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function selectorAll(selector) {
	  return function() {
	    return this.querySelectorAll(selector);
	  };
	}

	function selection_selectAll(select) {
	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, parents);
	}

	function selection_filter(match) {
	  if (typeof match !== "function") match = matcher$1(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function constant(x) {
	  return function() {
	    return x;
	  };
	}

	var keyPrefix = "$"; // Protect against keys like “__proto__”.

	function bindIndex(parent, group, enter, update, exit, data) {
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
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Put any non-null nodes that don’t fit into exit.
	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey(parent, group, enter, update, exit, data, key) {
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
	      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
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
	    keyValue = keyPrefix + key.call(parent, data[i], i, data);
	    if (node = nodeByKeyValue[keyValue]) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue[keyValue] = null;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Add any remaining nodes that were not bound to data to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
	      exit[i] = node;
	    }
	  }
	}

	function selection_data(value, key) {
	  if (!value) {
	    data = new Array(this.size()), j = -1;
	    this.each(function(d) { data[++j] = d; });
	    return data;
	  }

	  var bind = key ? bindKey : bindIndex,
	      parents = this._parents,
	      groups = this._groups;

	  if (typeof value !== "function") value = constant(value);

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

	  update = new Selection(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	}

	function EnterNode(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}

	EnterNode.prototype = {
	  constructor: EnterNode,
	  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	  querySelector: function(selector) { return this._parent.querySelector(selector); },
	  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	};

	function sparse(update) {
	  return new Array(update.length);
	}

	function selection_enter() {
	  return new Selection(this._enter || this._groups.map(sparse), this._parents);
	}

	function selection_exit() {
	  return new Selection(this._exit || this._groups.map(sparse), this._parents);
	}

	function selection_merge(selection) {

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

	  return new Selection(merges, this._parents);
	}

	function selection_order() {

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

	function selection_sort(compare) {
	  if (!compare) compare = ascending;

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

	  return new Selection(sortgroups, this._parents).order();
	}

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function selection_call() {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	}

	function selection_nodes() {
	  var nodes = new Array(this.size()), i = -1;
	  this.each(function() { nodes[++i] = this; });
	  return nodes;
	}

	function selection_node() {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	}

	function selection_size() {
	  var size = 0;
	  this.each(function() { ++size; });
	  return size;
	}

	function selection_empty() {
	  return !this.node();
	}

	function selection_each(callback) {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	}

	function attrRemove(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant(name, value) {
	  return function() {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS(fullname, value) {
	  return function() {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);
	    else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS(fullname, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	    else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	function selection_attr(name, value) {
	  var fullname = namespace(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local
	        ? node.getAttributeNS(fullname.space, fullname.local)
	        : node.getAttribute(fullname);
	  }

	  return this.each((value == null
	      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
	      ? (fullname.local ? attrFunctionNS : attrFunction)
	      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
	}

	function defaultView(node) {
	  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	      || (node.document && node) // node is a Window
	      || node.defaultView; // node is a Document
	}

	function styleRemove(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant(name, value, priority) {
	  return function() {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction(name, value, priority) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);
	    else this.style.setProperty(name, v, priority);
	  };
	}

	function selection_style(name, value, priority) {
	  var node;
	  return arguments.length > 1
	      ? this.each((value == null
	            ? styleRemove : typeof value === "function"
	            ? styleFunction
	            : styleConstant)(name, value, priority == null ? "" : priority))
	      : defaultView(node = this.node())
	          .getComputedStyle(node, null)
	          .getPropertyValue(name);
	}

	function propertyRemove(name) {
	  return function() {
	    delete this[name];
	  };
	}

	function propertyConstant(name, value) {
	  return function() {
	    this[name] = value;
	  };
	}

	function propertyFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];
	    else this[name] = v;
	  };
	}

	function selection_property(name, value) {
	  return arguments.length > 1
	      ? this.each((value == null
	          ? propertyRemove : typeof value === "function"
	          ? propertyFunction
	          : propertyConstant)(name, value))
	      : this.node()[name];
	}

	function classArray(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList(node) {
	  return node.classList || new ClassList(node);
	}

	function ClassList(node) {
	  this._node = node;
	  this._names = classArray(node.getAttribute("class") || "");
	}

	ClassList.prototype = {
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

	function classedAdd(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.add(names[i]);
	}

	function classedRemove(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.remove(names[i]);
	}

	function classedTrue(names) {
	  return function() {
	    classedAdd(this, names);
	  };
	}

	function classedFalse(names) {
	  return function() {
	    classedRemove(this, names);
	  };
	}

	function classedFunction(names, value) {
	  return function() {
	    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	  };
	}

	function selection_classed(name, value) {
	  var names = classArray(name + "");

	  if (arguments.length < 2) {
	    var list = classList(this.node()), i = -1, n = names.length;
	    while (++i < n) if (!list.contains(names[i])) return false;
	    return true;
	  }

	  return this.each((typeof value === "function"
	      ? classedFunction : value
	      ? classedTrue
	      : classedFalse)(names, value));
	}

	function textRemove() {
	  this.textContent = "";
	}

	function textConstant(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	function selection_text(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? textRemove : (typeof value === "function"
	          ? textFunction
	          : textConstant)(value))
	      : this.node().textContent;
	}

	function htmlRemove() {
	  this.innerHTML = "";
	}

	function htmlConstant(value) {
	  return function() {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	function selection_html(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? htmlRemove : (typeof value === "function"
	          ? htmlFunction
	          : htmlConstant)(value))
	      : this.node().innerHTML;
	}

	function raise() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	function selection_raise() {
	  return this.each(raise);
	}

	function lower() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	function selection_lower() {
	  return this.each(lower);
	}

	function selection_append(name) {
	  var create = typeof name === "function" ? name : creator(name);
	  return this.select(function() {
	    return this.appendChild(create.apply(this, arguments));
	  });
	}

	function constantNull() {
	  return null;
	}

	function selection_insert(name, before) {
	  var create = typeof name === "function" ? name : creator(name),
	      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	  return this.select(function() {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	}

	function remove() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	function selection_remove() {
	  return this.each(remove);
	}

	function selection_datum(value) {
	  return arguments.length
	      ? this.property("__data__", value)
	      : this.node().__data__;
	}

	function dispatchEvent(node, type, params) {
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

	function dispatchConstant(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params);
	  };
	}

	function dispatchFunction(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params.apply(this, arguments));
	  };
	}

	function selection_dispatch(type, params) {
	  return this.each((typeof params === "function"
	      ? dispatchFunction
	      : dispatchConstant)(type, params));
	}

	var root = [null];

	function Selection(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection([[document.documentElement]], root);
	}

	Selection.prototype = selection.prototype = {
	  constructor: Selection,
	  select: selection_select,
	  selectAll: selection_selectAll,
	  filter: selection_filter,
	  data: selection_data,
	  enter: selection_enter,
	  exit: selection_exit,
	  merge: selection_merge,
	  order: selection_order,
	  sort: selection_sort,
	  call: selection_call,
	  nodes: selection_nodes,
	  node: selection_node,
	  size: selection_size,
	  empty: selection_empty,
	  each: selection_each,
	  attr: selection_attr,
	  style: selection_style,
	  property: selection_property,
	  classed: selection_classed,
	  text: selection_text,
	  html: selection_html,
	  raise: selection_raise,
	  lower: selection_lower,
	  append: selection_append,
	  insert: selection_insert,
	  remove: selection_remove,
	  datum: selection_datum,
	  on: selection_on,
	  dispatch: selection_dispatch
	};

	function select(selector) {
	  return typeof selector === "string"
	      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
	      : new Selection([[selector]], root);
	}

	// Resizes the SVG container.
	function SVG (my){
	  my("svg")
	    ("width", 960)
	    ("height", 500)

	    ("svgSelection", select, "svg")

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

	function ascending$1(a, b) {
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
	    return ascending$1(f(d), x);
	  };
	}

	var ascendingBisect = bisector(ascending$1);

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

	function ascending$2(a, b) {
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
	    return ascending$2(f(d), x);
	  };
	}

	var ascendingBisect$1 = bisector$1(ascending$2);
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

	var array$2 = Array.prototype;

	var map$3 = array$2.map;
	var slice$2 = array$2.slice;

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

	function constant$3(x) {
	  return function() {
	    return x;
	  };
	}

	function linear$1(a, d) {
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
	  return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
	}

	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function(a, b) {
	    return b - a ? exponential(a, b, y) : constant$3(isNaN(a) ? b : a);
	  };
	}

	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear$1(a, d) : constant$3(isNaN(a) ? b : a);
	}

	var rgb = (function rgbGamma(y) {
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

	function array$3(a, b) {
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

	function object(a, b) {
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

	var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
	var reB = new RegExp(reA.source, "g");
	function zero(b) {
	  return function() {
	    return b;
	  };
	}

	function one(b) {
	  return function(t) {
	    return b(t) + "";
	  };
	}

	function string(a, b) {
	  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
	      am, // current match in a
	      bm, // current match in b
	      bs, // string preceding current number in b, if any
	      i = -1, // index in s
	      s = [], // string constants and placeholders
	      q = []; // number interpolators

	  // Coerce inputs to strings.
	  a = a + "", b = b + "";

	  // Interpolate pairs of numbers in a & b.
	  while ((am = reA.exec(a))
	      && (bm = reB.exec(b))) {
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
	    bi = reB.lastIndex;
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
	      ? one(q[0].x)
	      : zero(b))
	      : (b = q.length, function(t) {
	          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	          return s.join("");
	        });
	}

	function interpolateValue(a, b) {
	  var t = typeof b, c;
	  return b == null || t === "boolean" ? constant$3(b)
	      : (t === "number" ? reinterpolate
	      : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
	      : b instanceof color ? rgb
	      : Array.isArray(b) ? array$3
	      : object)(a, b);
	}

	function interpolateRound(a, b) {
	  return a = +a, b -= a, function(t) {
	    return Math.round(a + b * t);
	  };
	}

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
	var interpolateCubehelixLong = cubehelix$1(nogamma);

	function constant$4(x) {
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
	      : constant$4(b);
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

	function exponent(x) {
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

	function identity$4(x) {
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
	  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$4,
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
	        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
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
	  return Math.max(0, -exponent(Math.abs(step)));
	}

	function precisionPrefix(step, value) {
	  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
	}

	function precisionRound(step, max) {
	  step = Math.abs(step), max = Math.abs(max) - step;
	  return Math.max(0, exponent(max) - exponent(step)) + 1;
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

	function linear() {
	  var scale = continuous(deinterpolate, reinterpolate);

	  scale.copy = function() {
	    return copy(scale, linear());
	  };

	  return linearish(scale);
	}

	function raise$1(x, exponent) {
	  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
	}

	function pow() {
	  var exponent = 1,
	      scale = continuous(deinterpolate, reinterpolate),
	      domain = scale.domain;

	  function deinterpolate(a, b) {
	    return (b = raise$1(b, exponent) - (a = raise$1(a, exponent)))
	        ? function(x) { return (raise$1(x, exponent) - a) / b; }
	        : constant$4(b);
	  }

	  function reinterpolate(a, b) {
	    b = raise$1(b, exponent) - (a = raise$1(a, exponent));
	    return function(t) { return raise$1(a + b * t, 1 / exponent); };
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

var 	t0$1 = new Date;
var 	t1$1 = new Date;
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
	      t0$1.setTime(+start), t1$1.setTime(+end);
	      floori(t0$1), floori(t1$1);
	      return Math.floor(count(t0$1, t1$1));
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

	interpolateCubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

	var warm = interpolateCubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

	var cool = interpolateCubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

	var rainbow = cubehelix();

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
	    .call(Scale, "x", linear)

	    // The y scale.
	    ("yDomain", function (data, accessor){
	      return extent(data, accessor);
	    }, "data, yAccessor")
	    ("yRange", function (innerHeight){
	      return [innerHeight, 0];
	    }, "innerHeight")
	    .call(Scale, "y", linear)

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

	      var sizeLocal = local();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1x1MDAwMGNvbW1vbmpzSGVscGVycyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdGl2ZS1wcm9wZXJ0eS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9ncmFwaC1kYXRhLXN0cnVjdHVyZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdGl2ZS1mdW5jdGlvbi9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdGl2ZS1tb2RlbC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL25hbWVzcGFjZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2UuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jcmVhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbG9jYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9tYXRjaGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29uLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3JBbGwuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0QWxsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2ZpbHRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2NvbnN0YW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2RhdGEuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3BhcnNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VudGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2V4aXQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbWVyZ2UuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb3JkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc29ydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jYWxsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2l6ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbXB0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lYWNoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2F0dHIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy93aW5kb3cuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3R5bGUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcHJvcGVydHkuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xhc3NlZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi90ZXh0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2h0bWwuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmFpc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbG93ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXBwZW5kLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luc2VydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9yZW1vdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0dW0uanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGlzcGF0Y2guanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3QuanMiLCIuLi9zcmMvbWl4aW5zL3N2Zy5qcyIsIi4uL3NyYy9taXhpbnMvbWFyZ2luLmpzIiwiLi4vc3JjL21peGlucy9kYXRhLmpzIiwiLi4vc3JjL21peGlucy9jb2x1bW4uanMiLCIuLi9zcmMvbWl4aW5zL3NjYWxlLmpzIiwiLi4vc3JjL21peGlucy9yZXNpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9jaXJjbGUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL2FzY2VuZGluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvYmlzZWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL2Jpc2VjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvZXh0ZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9tYXguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9hc2NlbmRpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9iaXNlY3Rvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL2Jpc2VjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL3JhbmdlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvdGlja3MuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9kZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtY29sb3Ivc3JjL2NvbG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9tYXRoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9sYWIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtY29sb3Ivc3JjL2N1YmVoZWxpeC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvY29uc3RhbnQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2NvbG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9yZ2IuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9udW1iZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL29iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvc3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy92YWx1ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvcm91bmQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2N1YmVoZWxpeC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvY29uc3RhbnQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL251bWJlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvY29udGludW91cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdERlY2ltYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9leHBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdEdyb3VwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZm9ybWF0RGVmYXVsdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdFByZWZpeEF1dG8uanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRSb3VuZGVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZm9ybWF0VHlwZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRTcGVjaWZpZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9sb2NhbGUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9wcmVjaXNpb25GaXhlZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL3ByZWNpc2lvblByZWZpeC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL3ByZWNpc2lvblJvdW5kLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy90aWNrRm9ybWF0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9saW5lYXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL3Bvdy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy9pbnRlcnZhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy9taWxsaXNlY29uZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy9kdXJhdGlvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy9zZWNvbmQuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvbWludXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL2hvdXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvZGF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL3dlZWsuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvbW9udGguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMveWVhci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy91dGNNaW51dGUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvdXRjSG91ci5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy91dGNEYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvdXRjV2Vlay5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy91dGNNb250aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy91dGNZZWFyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUtZm9ybWF0L3NyYy9sb2NhbGUuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtdGltZS1mb3JtYXQvc3JjL2lzb0Zvcm1hdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy10aW1lLWZvcm1hdC9zcmMvaXNvUGFyc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2NvbG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvY2F0ZWdvcnkxMC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvY2F0ZWdvcnkyMGIuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2NhdGVnb3J5MjBjLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9jYXRlZ29yeTIwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9jdWJlaGVsaXguanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL3JhaW5ib3cuanMiLCIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL3ZpcmlkaXMuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zY2F0dGVyLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IHZhciBjb21tb25qc0dsb2JhbCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDoge31cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbW1vbmpzTW9kdWxlKGZuLCBtb2R1bGUpIHtcblx0cmV0dXJuIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSwgZm4obW9kdWxlLCBtb2R1bGUuZXhwb3J0cyksIG1vZHVsZS5leHBvcnRzO1xufSIsIi8vIFVNRCBib2lsZXJwbGF0ZSAoZnJvbSBSb2xsdXApXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6IChnbG9iYWwuUmVhY3RpdmVQcm9wZXJ0eSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gRXJyb3IgbWVzc2FnZXMgZm9yIGV4Y2VwdGlvbnMgdGhyb3duLlxuICB2YXIgZXJyb3JzID0ge1xuICAgIHRvb01hbnlBcmdzQ29uc3RydWN0b3I6IFwiUmVhY3RpdmVQcm9wZXJ0eSh2YWx1ZSkgYWNjZXB0cyBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGUgaW5pdGlhbCB2YWx1ZS5cIixcbiAgICB0b29NYW55QXJnc1NldHRlcjogXCJyZWFjdGl2ZVByb3BlcnR5KG5ld1ZhbHVlKSBhY2NlcHRzIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoZSBuZXcgdmFsdWUuXCIsXG4gICAgb25Ob25GdW5jdGlvbjogXCJSZWFjdGl2ZVByb3BlcnR5Lm9uKGxpc3RlbmVyKSBvbmx5IGFjY2VwdHMgZnVuY3Rpb25zLCBub3QgdmFsdWVzLlwiLFxuICAgIG9uQXJnczogXCJSZWFjdGl2ZVByb3BlcnR5Lm9uKGxpc3RlbmVyKSBhY2NlcHRzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCB0aGUgbGlzdGVuZXIgZnVuY3Rpb24uXCJcbiAgfTtcblxuICAvLyBUaGlzIGZ1bmN0aW9uIGdlbmVyYXRlcyBhIGdldHRlci1zZXR0ZXIgd2l0aCBjaGFuZ2UgbGlzdGVuZXJzLlxuICByZXR1cm4gZnVuY3Rpb24gUmVhY3RpdmVQcm9wZXJ0eSh2YWx1ZSl7XG5cbiAgICAvLyBBbiBhcnJheSBvZiByZWdpc3RlcmVkIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICB2YXIgbGlzdGVuZXJzO1xuICAgIFxuICAgIC8vIENoZWNrIGZvciB0b28gbWFueSBhcmd1bWVudHMuXG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHRocm93IEVycm9yKGVycm9ycy50b29NYW55QXJnc0NvbnN0cnVjdG9yKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIHRoZSByZWFjdGl2ZSBwcm9wZXJ0eSBmdW5jdGlvbiB0aGF0IGdldHMgcmV0dXJuZWQuXG4gICAgZnVuY3Rpb24gcmVhY3RpdmVQcm9wZXJ0eShuZXdWYWx1ZSl7XG4gICAgXG4gICAgICAvLyBDaGVjayBmb3IgdG9vIG1hbnkgYXJndW1lbnRzLlxuICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3JzLnRvb01hbnlBcmdzU2V0dGVyKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gVGhpcyBpbXBsZW1lbnRzIHRoZSBzZXR0ZXIgcGFydCBvZiB0aGUgc2V0dGVyLWdldHRlci5cbiAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpe1xuXG4gICAgICAgIC8vIEdyYWIgdGhlIG9sZCB2YWx1ZSBmb3IgcGFzc2luZyBpbnRvIHRoZSBsaXN0ZW5lci5cbiAgICAgICAgdmFyIG9sZFZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgLy8gVHJhY2sgdGhlIG5ldyB2YWx1ZSBpbnRlcm5hbGx5LlxuICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgIC8vIE5vdGlmeSByZWdpc3RlcmVkIGxpc3RlbmVycy5cbiAgICAgICAgaWYobGlzdGVuZXJzKXtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGxpc3RlbmVyc1tpXShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1cHBvcnQgbWV0aG9kIGNoYWluaW5nIGJ5IHJldHVybmluZyAndGhpcycuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGltcGxlbWVudHMgdGhlIGdldHRlciBwYXJ0IG9mIHRoZSBzZXR0ZXItZ2V0dGVyLlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8vIFJlZ2lzdGVycyBhIG5ldyBsaXN0ZW5lciB0byByZWNlaXZlIHVwZGF0ZXMuXG4gICAgcmVhY3RpdmVQcm9wZXJ0eS5vbiA9IGZ1bmN0aW9uIChsaXN0ZW5lcil7XG5cbiAgICAgIC8vIENoZWNrIGZvciBpbnZhbGlkIHR5cGVzLlxuICAgICAgaWYodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICB0aHJvdyBFcnJvcihlcnJvcnMub25Ob25GdW5jdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGZvciB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+IDEgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIHRocm93IEVycm9yKGVycm9ycy5vbkFyZ3MpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBubyBsaXN0ZW5lcnMgaGF2ZSBiZWVuIGFkZGVkIHlldCwgaW5pdGlhbGl6ZSB0aGUgYXJyYXkuXG4gICAgICBpZighbGlzdGVuZXJzKXtcbiAgICAgICAgbGlzdGVuZXJzID0gW107XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZ2lzdGVyIHRoZSBsaXN0ZW5lci5cbiAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gaW5pdGlhbCB2YWx1ZSwgaW52b2tlIHRoZSBsaXN0ZW5lciBpbW1lZGlhdGVseS5cbiAgICAgIC8vIG51bGwgaXMgY29uc2lkZXJlZCBhcyBhIGRlZmluZWQgdmFsdWUuXG4gICAgICBpZih2YWx1ZSAhPT0gdm9pZCAwKXtcbiAgICAgICAgbGlzdGVuZXIodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgY29udmVuaWVuY2UsIHRoZSBsaXN0ZW5lciBpcyByZXR1cm5lZC5cbiAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICB9O1xuXG4gICAgLy8gVW5yZWdpc3RlcnMgdGhlIGdpdmVuIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICAgIHJlYWN0aXZlUHJvcGVydHkub2ZmID0gZnVuY3Rpb24gKGxpc3RlbmVyVG9SZW1vdmUpe1xuICAgICAgaWYobGlzdGVuZXJzKXtcbiAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmZpbHRlcihmdW5jdGlvbiAobGlzdGVuZXIpe1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lciAhPT0gbGlzdGVuZXJUb1JlbW92ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFVucmVnaXN0ZXJzIGFsbCBsaXN0ZW5lcnMuXG4gICAgcmVhY3RpdmVQcm9wZXJ0eS5kZXN0cm95ID0gZnVuY3Rpb24gKCl7XG4gICAgICBsaXN0ZW5lcnMgPSBbXTtcbiAgICB9O1xuXG4gICAgLy8gRXhwb3NlIHRoZSBkZWZhdWx0IHZhbHVlXG4gICAgaWYodmFsdWUpe1xuICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgcmVhY3RpdmVQcm9wZXJ0eS5kZWZhdWx0ID0gZnVuY3Rpb24gKCl7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiByZWFjdGl2ZVByb3BlcnR5O1xuICB9O1xufSkpO1xuIiwiLy8gQSBncmFwaCBkYXRhIHN0cnVjdHVyZSB3aXRoIGRlcHRoLWZpcnN0IHNlYXJjaCBhbmQgdG9wb2xvZ2ljYWwgc29ydC5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gR3JhcGgoc2VyaWFsaXplZCl7XG5cbiAgLy8gVGhlIHJldHVybmVkIGdyYXBoIGluc3RhbmNlLlxuICB2YXIgZ3JhcGggPSB7XG4gICAgYWRkTm9kZTogYWRkTm9kZSxcbiAgICByZW1vdmVOb2RlOiByZW1vdmVOb2RlLFxuICAgIG5vZGVzOiBub2RlcyxcbiAgICBhZGphY2VudDogYWRqYWNlbnQsXG4gICAgYWRkRWRnZTogYWRkRWRnZSxcbiAgICByZW1vdmVFZGdlOiByZW1vdmVFZGdlLFxuICAgIGluZGVncmVlOiBpbmRlZ3JlZSxcbiAgICBvdXRkZWdyZWU6IG91dGRlZ3JlZSxcbiAgICBkZXB0aEZpcnN0U2VhcmNoOiBkZXB0aEZpcnN0U2VhcmNoLFxuICAgIHRvcG9sb2dpY2FsU29ydDogdG9wb2xvZ2ljYWxTb3J0LFxuICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplLFxuICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVxuICB9O1xuXG4gIC8vIFRoZSBhZGphY2VuY3kgbGlzdCBvZiB0aGUgZ3JhcGguXG4gIC8vIEtleXMgYXJlIG5vZGUgaWRzLlxuICAvLyBWYWx1ZXMgYXJlIGFkamFjZW50IG5vZGUgaWQgYXJyYXlzLlxuICB2YXIgZWRnZXMgPSB7fTtcblxuICAvLyBJZiBhIHNlcmlhbGl6ZWQgZ3JhcGggd2FzIHBhc3NlZCBpbnRvIHRoZSBjb25zdHJ1Y3RvciwgZGVzZXJpYWxpemUgaXQuXG4gIGlmKHNlcmlhbGl6ZWQpe1xuICAgIGRlc2VyaWFsaXplKHNlcmlhbGl6ZWQpO1xuICB9XG5cbiAgLy8gQWRkcyBhIG5vZGUgdG8gdGhlIGdyYXBoLlxuICAvLyBJZiBub2RlIHdhcyBhbHJlYWR5IGFkZGVkLCB0aGlzIGZ1bmN0aW9uIGRvZXMgbm90aGluZy5cbiAgLy8gSWYgbm9kZSB3YXMgbm90IGFscmVhZHkgYWRkZWQsIHRoaXMgZnVuY3Rpb24gc2V0cyB1cCBhbiBlbXB0eSBhZGphY2VuY3kgbGlzdC5cbiAgZnVuY3Rpb24gYWRkTm9kZShub2RlKXtcbiAgICBlZGdlc1tub2RlXSA9IGFkamFjZW50KG5vZGUpO1xuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIC8vIFJlbW92ZXMgYSBub2RlIGZyb20gdGhlIGdyYXBoLlxuICAvLyBBbHNvIHJlbW92ZXMgaW5jb21pbmcgYW5kIG91dGdvaW5nIGVkZ2VzLlxuICBmdW5jdGlvbiByZW1vdmVOb2RlKG5vZGUpe1xuICAgIFxuICAgIC8vIFJlbW92ZSBpbmNvbWluZyBlZGdlcy5cbiAgICBPYmplY3Qua2V5cyhlZGdlcykuZm9yRWFjaChmdW5jdGlvbiAodSl7XG4gICAgICBlZGdlc1t1XS5mb3JFYWNoKGZ1bmN0aW9uICh2KXtcbiAgICAgICAgaWYodiA9PT0gbm9kZSl7XG4gICAgICAgICAgcmVtb3ZlRWRnZSh1LCB2KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgb3V0Z29pbmcgZWRnZXMgKGFuZCBzaWduYWwgdGhhdCB0aGUgbm9kZSBubyBsb25nZXIgZXhpc3RzKS5cbiAgICBkZWxldGUgZWRnZXNbbm9kZV07XG5cbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICAvLyBHZXRzIHRoZSBsaXN0IG9mIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBncmFwaC5cbiAgZnVuY3Rpb24gbm9kZXMoKXtcbiAgICB2YXIgbm9kZVNldCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGVkZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uICh1KXtcbiAgICAgIG5vZGVTZXRbdV0gPSB0cnVlO1xuICAgICAgZWRnZXNbdV0uZm9yRWFjaChmdW5jdGlvbiAodil7XG4gICAgICAgIG5vZGVTZXRbdl0gPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG5vZGVTZXQpO1xuICB9XG5cbiAgLy8gR2V0cyB0aGUgYWRqYWNlbnQgbm9kZSBsaXN0IGZvciB0aGUgZ2l2ZW4gbm9kZS5cbiAgLy8gUmV0dXJucyBhbiBlbXB0eSBhcnJheSBmb3IgdW5rbm93biBub2Rlcy5cbiAgZnVuY3Rpb24gYWRqYWNlbnQobm9kZSl7XG4gICAgcmV0dXJuIGVkZ2VzW25vZGVdIHx8IFtdO1xuICB9XG5cbiAgLy8gQWRkcyBhbiBlZGdlIGZyb20gbm9kZSB1IHRvIG5vZGUgdi5cbiAgLy8gSW1wbGljaXRseSBhZGRzIHRoZSBub2RlcyBpZiB0aGV5IHdlcmUgbm90IGFscmVhZHkgYWRkZWQuXG4gIGZ1bmN0aW9uIGFkZEVkZ2UodSwgdil7XG4gICAgYWRkTm9kZSh1KTtcbiAgICBhZGROb2RlKHYpO1xuICAgIGFkamFjZW50KHUpLnB1c2godik7XG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgLy8gUmVtb3ZlcyB0aGUgZWRnZSBmcm9tIG5vZGUgdSB0byBub2RlIHYuXG4gIC8vIERvZXMgbm90IHJlbW92ZSB0aGUgbm9kZXMuXG4gIC8vIERvZXMgbm90aGluZyBpZiB0aGUgZWRnZSBkb2VzIG5vdCBleGlzdC5cbiAgZnVuY3Rpb24gcmVtb3ZlRWRnZSh1LCB2KXtcbiAgICBpZihlZGdlc1t1XSl7XG4gICAgICBlZGdlc1t1XSA9IGFkamFjZW50KHUpLmZpbHRlcihmdW5jdGlvbiAoX3Ype1xuICAgICAgICByZXR1cm4gX3YgIT09IHY7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgLy8gQ29tcHV0ZXMgdGhlIGluZGVncmVlIGZvciB0aGUgZ2l2ZW4gbm9kZS5cbiAgLy8gTm90IHZlcnkgZWZmaWNpZW50LCBjb3N0cyBPKEUpIHdoZXJlIEUgPSBudW1iZXIgb2YgZWRnZXMuXG4gIGZ1bmN0aW9uIGluZGVncmVlKG5vZGUpe1xuICAgIHZhciBkZWdyZWUgPSAwO1xuICAgIGZ1bmN0aW9uIGNoZWNrKHYpe1xuICAgICAgaWYodiA9PT0gbm9kZSl7XG4gICAgICAgIGRlZ3JlZSsrO1xuICAgICAgfVxuICAgIH1cbiAgICBPYmplY3Qua2V5cyhlZGdlcykuZm9yRWFjaChmdW5jdGlvbiAodSl7XG4gICAgICBlZGdlc1t1XS5mb3JFYWNoKGNoZWNrKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGVncmVlO1xuICB9XG5cbiAgLy8gQ29tcHV0ZXMgdGhlIG91dGRlZ3JlZSBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gIGZ1bmN0aW9uIG91dGRlZ3JlZShub2RlKXtcbiAgICByZXR1cm4gbm9kZSBpbiBlZGdlcyA/IGVkZ2VzW25vZGVdLmxlbmd0aCA6IDA7XG4gIH1cblxuICAvLyBEZXB0aCBGaXJzdCBTZWFyY2ggYWxnb3JpdGhtLCBpbnNwaXJlZCBieVxuICAvLyBDb3JtZW4gZXQgYWwuIFwiSW50cm9kdWN0aW9uIHRvIEFsZ29yaXRobXNcIiAzcmQgRWQuIHAuIDYwNFxuICAvLyBUaGlzIHZhcmlhbnQgaW5jbHVkZXMgYW4gYWRkaXRpb25hbCBvcHRpb24gXG4gIC8vIGBpbmNsdWRlU291cmNlTm9kZXNgIHRvIHNwZWNpZnkgd2hldGhlciB0byBpbmNsdWRlIG9yXG4gIC8vIGV4Y2x1ZGUgdGhlIHNvdXJjZSBub2RlcyBmcm9tIHRoZSByZXN1bHQgKHRydWUgYnkgZGVmYXVsdCkuXG4gIC8vIElmIGBzb3VyY2VOb2Rlc2AgaXMgbm90IHNwZWNpZmllZCwgYWxsIG5vZGVzIGluIHRoZSBncmFwaFxuICAvLyBhcmUgdXNlZCBhcyBzb3VyY2Ugbm9kZXMuXG4gIGZ1bmN0aW9uIGRlcHRoRmlyc3RTZWFyY2goc291cmNlTm9kZXMsIGluY2x1ZGVTb3VyY2VOb2Rlcyl7XG5cbiAgICBpZighc291cmNlTm9kZXMpe1xuICAgICAgc291cmNlTm9kZXMgPSBub2RlcygpO1xuICAgIH1cblxuICAgIGlmKHR5cGVvZiBpbmNsdWRlU291cmNlTm9kZXMgIT09IFwiYm9vbGVhblwiKXtcbiAgICAgIGluY2x1ZGVTb3VyY2VOb2RlcyA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFyIHZpc2l0ZWQgPSB7fTtcbiAgICB2YXIgbm9kZUxpc3QgPSBbXTtcblxuICAgIGZ1bmN0aW9uIERGU1Zpc2l0KG5vZGUpe1xuICAgICAgaWYoIXZpc2l0ZWRbbm9kZV0pe1xuICAgICAgICB2aXNpdGVkW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgYWRqYWNlbnQobm9kZSkuZm9yRWFjaChERlNWaXNpdCk7XG4gICAgICAgIG5vZGVMaXN0LnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaW5jbHVkZVNvdXJjZU5vZGVzKXtcbiAgICAgIHNvdXJjZU5vZGVzLmZvckVhY2goREZTVmlzaXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3VyY2VOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKXtcbiAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICB9KTtcbiAgICAgIHNvdXJjZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpe1xuICAgICAgICBhZGphY2VudChub2RlKS5mb3JFYWNoKERGU1Zpc2l0KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlTGlzdDtcbiAgfVxuXG4gIC8vIFRoZSB0b3BvbG9naWNhbCBzb3J0IGFsZ29yaXRobSB5aWVsZHMgYSBsaXN0IG9mIHZpc2l0ZWQgbm9kZXNcbiAgLy8gc3VjaCB0aGF0IGZvciBlYWNoIHZpc2l0ZWQgZWRnZSAodSwgdiksIHUgY29tZXMgYmVmb3JlIHYgaW4gdGhlIGxpc3QuXG4gIC8vIEFtYXppbmdseSwgdGhpcyBjb21lcyBmcm9tIGp1c3QgcmV2ZXJzaW5nIHRoZSByZXN1bHQgZnJvbSBkZXB0aCBmaXJzdCBzZWFyY2guXG4gIC8vIENvcm1lbiBldCBhbC4gXCJJbnRyb2R1Y3Rpb24gdG8gQWxnb3JpdGhtc1wiIDNyZCBFZC4gcC4gNjEzXG4gIGZ1bmN0aW9uIHRvcG9sb2dpY2FsU29ydChzb3VyY2VOb2RlcywgaW5jbHVkZVNvdXJjZU5vZGVzKXtcbiAgICByZXR1cm4gZGVwdGhGaXJzdFNlYXJjaChzb3VyY2VOb2RlcywgaW5jbHVkZVNvdXJjZU5vZGVzKS5yZXZlcnNlKCk7XG4gIH1cblxuICAvLyBTZXJpYWxpemVzIHRoZSBncmFwaC5cbiAgZnVuY3Rpb24gc2VyaWFsaXplKCl7XG4gICAgdmFyIHNlcmlhbGl6ZWQgPSB7XG4gICAgICBub2Rlczogbm9kZXMoKS5tYXAoZnVuY3Rpb24gKGlkKXtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IGlkIH07XG4gICAgICB9KSxcbiAgICAgIGxpbmtzOiBbXVxuICAgIH07XG5cbiAgICBzZXJpYWxpemVkLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpe1xuICAgICAgdmFyIHNvdXJjZSA9IG5vZGUuaWQ7XG4gICAgICBhZGphY2VudChzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldCl7XG4gICAgICAgIHNlcmlhbGl6ZWQubGlua3MucHVzaCh7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZXJpYWxpemVkO1xuICB9XG5cbiAgLy8gRGVzZXJpYWxpemVzIHRoZSBnaXZlbiBzZXJpYWxpemVkIGdyYXBoLlxuICBmdW5jdGlvbiBkZXNlcmlhbGl6ZShzZXJpYWxpemVkKXtcbiAgICBzZXJpYWxpemVkLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpeyBhZGROb2RlKG5vZGUuaWQpOyB9KTtcbiAgICBzZXJpYWxpemVkLmxpbmtzLmZvckVhY2goZnVuY3Rpb24gKGxpbmspeyBhZGRFZGdlKGxpbmsuc291cmNlLCBsaW5rLnRhcmdldCk7IH0pO1xuICAgIHJldHVybiBncmFwaDtcbiAgfVxuICBcbiAgcmV0dXJuIGdyYXBoO1xufVxuIiwidmFyIFJlYWN0aXZlUHJvcGVydHkgPSByZXF1aXJlKFwicmVhY3RpdmUtcHJvcGVydHlcIik7XG52YXIgR3JhcGggPSByZXF1aXJlKFwiZ3JhcGgtZGF0YS1zdHJ1Y3R1cmVcIik7XG5cbi8vIFVzZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgaWYgaXQgaXMgYXZhaWxhYmxlLlxuLy8gT3RoZXJ3aXNlIGZhbGwgYmFjayB0byBzZXRUaW1lb3V0LlxudmFyIG5leHRGcmFtZSA9IHNldFRpbWVvdXQ7XG5pZih0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJykge1xuICBuZXh0RnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG59XG5cbi8vIFRoZSBzaW5nbGV0b24gZGF0YSBkZXBlbmRlbmN5IGdyYXBoLlxuLy8gTm9kZXMgYXJlIHJlYWN0aXZlIHByb3BlcnRpZXMuXG4vLyBFZGdlcyBhcmUgZGVwZW5kZW5jaWVzIGJldHdlZW4gcmVhY3RpdmUgZnVuY3Rpb24gaW5wdXRzIGFuZCBvdXRwdXRzLlxudmFyIGdyYXBoID0gR3JhcGgoKTtcblxuLy8gQSBtYXAgZm9yIGxvb2tpbmcgdXAgcHJvcGVydGllcyBiYXNlZCBvbiB0aGVpciBhc3NpZ25lZCBpZC5cbi8vIEtleXMgYXJlIHByb3BlcnR5IGlkcywgdmFsdWVzIGFyZSByZWFjdGl2ZSBwcm9wZXJ0aWVzLlxudmFyIHByb3BlcnRpZXMgPSB7fTtcblxuLy8gVGhpcyBvYmplY3QgYWNjdW11bGF0ZXMgcHJvcGVydGllcyB0aGF0IGhhdmUgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCBkaWdlc3QuXG4vLyBLZXlzIGFyZSBwcm9wZXJ0eSBpZHMsIHZhbHVlcyBhcmUgdHJ1dGh5ICh0aGUgb2JqZWN0IGFjdHMgbGlrZSBhIFNldCkuXG52YXIgY2hhbmdlZCA9IHt9O1xuXG4vLyBBc3NpZ25zIGFuIGlkIHRvIGEgcmVhY3RpdmUgcHJvcGVydHkgc28gaXQgY2FuIGJlIGEgbm9kZSBpbiB0aGUgZ3JhcGguXG4vLyBBbHNvIHN0b3JlcyBhIHJlZmVyZW5jZSB0byB0aGUgcHJvcGVydHkgYnkgaWQgaW4gYHByb3BlcnRpZXNgLlxuLy8gSWYgdGhlIGdpdmVuIHByb3BlcnR5IGFscmVhZHkgaGFzIGFuIGlkLCBkb2VzIG5vdGhpbmcuXG52YXIgYXNzaWduSWQgPSAoZnVuY3Rpb24oKXtcbiAgdmFyIGNvdW50ZXIgPSAxO1xuICByZXR1cm4gZnVuY3Rpb24gKHByb3BlcnR5KXtcbiAgICBpZighcHJvcGVydHkuaWQpe1xuICAgICAgcHJvcGVydHkuaWQgPSBTdHJpbmcoY291bnRlcisrKTtcbiAgICAgIHByb3BlcnRpZXNbcHJvcGVydHkuaWRdID0gcHJvcGVydHk7XG4gICAgfVxuICB9O1xufSgpKTtcblxuLy8gVGhlIHJlYWN0aXZlIGZ1bmN0aW9uIGNvbnN0cnVjdG9yLlxuLy8gQWNjZXB0cyBhbiBvcHRpb25zIG9iamVjdCB3aXRoXG4vLyAgKiBpbnB1dHMgLSBBbiBhcnJheSBvZiByZWFjdGl2ZSBwcm9wZXJ0aWVzLlxuLy8gICogY2FsbGJhY2sgLSBBIGZ1bmN0aW9uIHdpdGggYXJndW1lbnRzIGNvcnJlc3BvbmRpbmcgdG8gdmFsdWVzIG9mIGlucHV0cy5cbi8vICAqIG91dHB1dCAtIEEgcmVhY3RpdmUgcHJvcGVydHkgKG9wdGlvbmFsKS5cbmZ1bmN0aW9uIFJlYWN0aXZlRnVuY3Rpb24ob3B0aW9ucyl7XG5cbiAgdmFyIGlucHV0cyA9IG9wdGlvbnMuaW5wdXRzO1xuICB2YXIgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrO1xuICB2YXIgb3V0cHV0ID0gb3B0aW9ucy5vdXRwdXQ7XG4gIFxuICBpZighb3V0cHV0KXtcbiAgICBvdXRwdXQgPSBmdW5jdGlvbiAoKXt9O1xuICAgIG91dHB1dC5wcm9wZXJ0eU5hbWUgPSBcIlwiO1xuICB9XG5cbiAgLy8gVGhpcyBnZXRzIGludm9rZWQgZHVyaW5nIGEgZGlnZXN0LCBhZnRlciBpbnB1dHMgaGF2ZSBiZWVuIGV2YWx1YXRlZC5cbiAgb3V0cHV0LmV2YWx1YXRlID0gZnVuY3Rpb24gKCl7XG5cbiAgICAvLyBHZXQgdGhlIHZhbHVlcyBmb3IgZWFjaCBvZiB0aGUgaW5wdXQgcmVhY3RpdmUgcHJvcGVydGllcy5cbiAgICB2YXIgdmFsdWVzID0gaW5wdXRzLm1hcChmdW5jdGlvbiAoaW5wdXQpe1xuICAgICAgcmV0dXJuIGlucHV0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBJZiBhbGwgaW5wdXQgdmFsdWVzIGFyZSBkZWZpbmVkLFxuICAgIGlmKGRlZmluZWQodmFsdWVzKSl7XG5cbiAgICAgIC8vIGludm9rZSB0aGUgY2FsbGJhY2sgYW5kIGFzc2lnbiB0aGUgb3V0cHV0IHZhbHVlLlxuICAgICAgb3V0cHV0KGNhbGxiYWNrLmFwcGx5KG51bGwsIHZhbHVlcykpO1xuICAgIH1cblxuICB9O1xuXG4gIC8vIEFzc2lnbiBub2RlIGlkcyB0byBpbnB1dHMgYW5kIG91dHB1dC5cbiAgYXNzaWduSWQob3V0cHV0KTtcbiAgaW5wdXRzLmZvckVhY2goYXNzaWduSWQpO1xuXG4gIC8vIFNldCB1cCBlZGdlcyBpbiB0aGUgZ3JhcGggZnJvbSBlYWNoIGlucHV0LlxuICBpbnB1dHMuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpe1xuICAgIGdyYXBoLmFkZEVkZ2UoaW5wdXQuaWQsIG91dHB1dC5pZCk7XG4gIH0pO1xuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJzIHRvIGVhY2ggaW5wdXQgcHJvcGVydHkuXG4gIC8vIFRoZXNlIG1hcmsgdGhlIHByb3BlcnRpZXMgYXMgY2hhbmdlZCBhbmQgcXVldWUgdGhlIG5leHQgZGlnZXN0LlxuICB2YXIgbGlzdGVuZXJzID0gaW5wdXRzLm1hcChmdW5jdGlvbiAocHJvcGVydHkpe1xuICAgIHJldHVybiBwcm9wZXJ0eS5vbihmdW5jdGlvbiAoKXtcbiAgICAgIGNoYW5nZWRbcHJvcGVydHkuaWRdID0gdHJ1ZTtcbiAgICAgIHF1ZXVlRGlnZXN0KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFJldHVybiBhbiBvYmplY3QgdGhhdCBjYW4gZGVzdHJveSB0aGUgbGlzdGVuZXJzIGFuZCBlZGdlcyBzZXQgdXAuXG4gIHJldHVybiB7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIHRvIGV4cGxpY2l0bHkgZGVzdHJveSBhIHJlYWN0aXZlIGZ1bmN0aW9uLlxuICAgIC8vIEdhcmJhZ2UgY29sbGVjdGlvbiBpcyBub3QgZW5vdWdoLCBhcyB3ZSBoYXZlIGFkZGVkIGxpc3RlbmVycyBhbmQgZWRnZXMuXG4gICAgZGVzdHJveTogZnVuY3Rpb24gKCl7XG5cbiAgICAgIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJzIGZyb20gaW5wdXRzLlxuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyLCBpKXtcbiAgICAgICAgaW5wdXRzW2ldLm9mZihsaXN0ZW5lcik7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBlZGdlcyB0aGF0IHdlcmUgYWRkZWQgdG8gdGhlIGRlcGVuZGVuY3kgZ3JhcGguXG4gICAgICBpbnB1dHMuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpe1xuICAgICAgICBncmFwaC5yZW1vdmVFZGdlKGlucHV0LmlkLCBvdXRwdXQuaWQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlbW92ZSBwcm9wZXJ0eSBub2RlcyB3aXRoIG5vIGVkZ2VzIGNvbm5lY3RlZC5cbiAgICAgIGlucHV0cy5jb25jYXQoW291dHB1dF0pLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KXtcbiAgICAgICAgdmFyIG5vZGUgPSBwcm9wZXJ0eS5pZDtcbiAgICAgICAgaWYoZ3JhcGguaW5kZWdyZWUobm9kZSkgKyBncmFwaC5vdXRkZWdyZWUobm9kZSkgPT09IDApe1xuICAgICAgICAgIGdyYXBoLnJlbW92ZU5vZGUocHJvcGVydHkuaWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSByZWZlcmVuY2UgdG8gdGhlICdldmFsdWF0ZScgZnVuY3Rpb24uXG4gICAgICBkZWxldGUgb3V0cHV0LmV2YWx1YXRlO1xuXG4gICAgICAvLyBSZW1vdmUgcmVmZXJlbmNlcyB0byBldmVyeXRoaW5nLlxuICAgICAgaW5wdXRzID0gY2FsbGJhY2sgPSBvdXRwdXQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9O1xufVxuXG4vLyBQcm9wYWdhdGVzIGNoYW5nZXMgdGhyb3VnaCB0aGUgZGVwZW5kZW5jeSBncmFwaC5cblJlYWN0aXZlRnVuY3Rpb24uZGlnZXN0ID0gZnVuY3Rpb24gKCl7XG4gIHZhciBjaGFuZ2VkSWRzID0gT2JqZWN0LmtleXMoY2hhbmdlZCk7XG4gIGNoYW5nZWQgPSB7fTtcbiAgZ3JhcGhcbiAgICAudG9wb2xvZ2ljYWxTb3J0KGNoYW5nZWRJZHMsIGZhbHNlKVxuICAgIC5tYXAoZnVuY3Rpb24gKGlkKXtcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzW2lkXTtcbiAgICB9KVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSl7XG4gICAgICBwcm9wZXJ0eS5ldmFsdWF0ZSgpO1xuICAgIH0pO1xuICBjaGFuZ2VkID0ge307XG59O1xuXG4vLyBUaGlzIGZ1bmN0aW9uIHF1ZXVlcyBhIGRpZ2VzdCBhdCB0aGUgbmV4dCB0aWNrIG9mIHRoZSBldmVudCBsb29wLlxudmFyIHF1ZXVlRGlnZXN0ID0gZGVib3VuY2UoUmVhY3RpdmVGdW5jdGlvbi5kaWdlc3QpO1xuXG4vLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBpbnZva2VkLCBzY2hlZHVsZXMgdGhlIGdpdmVuIGZ1bmN0aW9uXG4vLyB0byBleGVjdXRlIG9uY2Ugb24gdGhlIG5leHQgZnJhbWUuXG4vLyBTaW1pbGFyIHRvIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnLyNkZWJvdW5jZVxuZnVuY3Rpb24gZGVib3VuY2UoY2FsbGJhY2spe1xuICB2YXIgcXVldWVkID0gZmFsc2U7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXF1ZXVlZCl7XG4gICAgICBxdWV1ZWQgPSB0cnVlO1xuICAgICAgbmV4dEZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcXVldWVkID0gZmFsc2U7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIFJldHVybnMgdHJ1ZSBpZiBhbGwgZWxlbWVudHMgb2YgdGhlIGdpdmVuIGFycmF5IGFyZSBkZWZpbmVkLlxuZnVuY3Rpb24gZGVmaW5lZChhcnIpe1xuICByZXR1cm4gIWFyci5zb21lKGlzVW5kZWZpbmVkKTtcbn1cblxuLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBvYmplY3QgaXMgdW5kZWZpbmVkLlxuLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIHNvbWUgdmFsdWUsIGluY2x1ZGluZyBudWxsLlxuLy8gSW5zcGlyZWQgYnkgaHR0cDovL3J5YW5tb3JyLmNvbS9leHBsb3JpbmctdGhlLWV0ZXJuYWwtYWJ5c3Mtb2YtbnVsbC1hbmQtdW5kZWZpbmVkL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKXtcbiAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xufVxuXG5SZWFjdGl2ZUZ1bmN0aW9uLm5leHRGcmFtZSA9IG5leHRGcmFtZTtcblxuUmVhY3RpdmVGdW5jdGlvbi5zZXJpYWxpemVHcmFwaCA9IGZ1bmN0aW9uICgpe1xuICB2YXIgc2VyaWFsaXplZCA9IGdyYXBoLnNlcmlhbGl6ZSgpO1xuXG4gIC8vIEFkZCBwcm9wZXJ0eSBuYW1lcy5cbiAgc2VyaWFsaXplZC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKXtcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydGllc1tub2RlLmlkXS5wcm9wZXJ0eU5hbWU7XG4gICAgaWYodHlwZW9mIHByb3BlcnR5TmFtZSAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICBub2RlLnByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBzZXJpYWxpemVkO1xufVxuXG5SZWFjdGl2ZUZ1bmN0aW9uLmxpbmsgPSBmdW5jdGlvbiAocHJvcGVydHlBLCBwcm9wZXJ0eUIpe1xuICByZXR1cm4gUmVhY3RpdmVGdW5jdGlvbih7XG4gICAgaW5wdXRzOiBbcHJvcGVydHlBXSxcbiAgICBvdXRwdXQ6IHByb3BlcnR5QixcbiAgICBjYWxsYmFjazogZnVuY3Rpb24gKHgpeyByZXR1cm4geDsgfVxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdGl2ZUZ1bmN0aW9uO1xuIiwiLy8gQnkgQ3VycmFuIEtlbGxlaGVyXG4vLyBMYXN0IHVwZGF0ZWQgTWF5IDIwMTZcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhdmlzLXRlY2gvcmVhY3RpdmUtZnVuY3Rpb25cbnZhciBSZWFjdGl2ZUZ1bmN0aW9uID0gcmVxdWlyZShcInJlYWN0aXZlLWZ1bmN0aW9uXCIpO1xuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhdGF2aXMtdGVjaC9yZWFjdGl2ZS1wcm9wZXJ0eVxudmFyIFJlYWN0aXZlUHJvcGVydHkgPSByZXF1aXJlKFwicmVhY3RpdmUtcHJvcGVydHlcIik7XG5cbi8vIEZ1bmN0aW9uYWwgdXRpbGl0eSBmb3IgaW52b2tpbmcgbWV0aG9kcyBvbiBjb2xsZWN0aW9ucy5cbmZ1bmN0aW9uIGludm9rZShtZXRob2Qpe1xuICByZXR1cm4gZnVuY3Rpb24oZCl7XG4gICAgcmV0dXJuIGRbbWV0aG9kXSgpO1xuICB9O1xufVxuXG4vLyBUaGUgY29uc3RydWN0b3IgZm9yIHJlYWN0aXZlIG1vZGVscy5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgZXhwb3J0ZWQgYXMgdGhlIHB1YmxpYyBBUEkgb2YgdGhpcyBtb2R1bGUuXG5mdW5jdGlvbiBSZWFjdGl2ZU1vZGVsKCl7XG5cbiAgLy8gQW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgZm9yIGV4cG9zZWQgcHJvcGVydGllcy5cbiAgdmFyIGV4cG9zZWRQcm9wZXJ0aWVzO1xuXG4gIC8vIFRoaXMgaXMgYSBzdHJpbmcsIHRoZSBuYW1lIG9mIHRoZSBsYXN0IHByb3BlcnR5IGFkZGVkLlxuICAvLyBUaGlzIGlzIHVzZWQgaW4gYGV4cG9zZSgpYDtcbiAgdmFyIGxhc3RQcm9wZXJ0eUFkZGVkO1xuXG4gIC8vIFRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBtb2RlbCBpcyByZXByZXNlbnRlZCBhcyBhbiBvYmplY3QgYW5kIHN0b3JlZFxuICAvLyBpbiB0aGlzIHJlYWN0aXZlIHByb3BlcnR5LiBOb3RlIHRoYXQgb25seSB2YWx1ZXMgZm9yIGV4cG9zZWQgcHJvcGVydGllc1xuICAvLyB3aG9zZSB2YWx1ZXMgZGlmZmVyIGZyb20gdGhlaXIgZGVmYXVsdHMgYXJlIGluY2x1ZGVkIGluIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgLy8gVGhlIHB1cnBvc2Ugb2YgdGhlIGNvbmZpZ3VyYXRpb24gYWNjZXNzb3IgQVBJIGlzIHNlcmlhbGl6YXRpb24gYW5kIGRlc2VyaWFsaXphdGlvbixcbiAgLy8gc28gZGVmYXVsdCB2YWx1ZXMgYXJlIGxlZnQgb3V0IGZvciBhIGNvbmNpc2Ugc2VyaWFsaXplZCBmb3JtLlxuICB2YXIgY29uZmlndXJhdGlvblByb3BlcnR5ID0gUmVhY3RpdmVQcm9wZXJ0eSgpO1xuICBjb25maWd1cmF0aW9uUHJvcGVydHkucHJvcGVydHlOYW1lID0gXCJjb25maWd1cmF0aW9uXCI7XG5cbiAgLy8gVGhpcyBpcyBhIHJlYWN0aXZlIGZ1bmN0aW9uIHNldCB1cCB0byBsaXN0ZW4gZm9yIGNoYW5nZXMgaW4gYWxsXG4gIC8vIGV4cG9zZWQgcHJvcGVydGllcyBhbmQgc2V0IHRoZSBjb25maWd1cmF0aW9uUHJvcGVydHkgdmFsdWUuXG4gIHZhciBjb25maWd1cmF0aW9uUmVhY3RpdmVGdW5jdGlvbjtcblxuICAvLyBBbiBhcnJheSBvZiByZWFjdGl2ZSBmdW5jdGlvbnMgdGhhdCBoYXZlIGJlZW4gc2V0IHVwIG9uIHRoaXMgbW9kZWwuXG4gIC8vIFRoZXNlIGFyZSB0cmFja2VkIG9ubHkgc28gdGhleSBjYW4gYmUgZGVzdHJveWVkIGluIG1vZGVsLmRlc3Ryb3koKS5cbiAgdmFyIHJlYWN0aXZlRnVuY3Rpb25zID0gW107XG5cbiAgLy8gVGhlIG1vZGVsIGluc3RhbmNlIG9iamVjdC5cbiAgLy8gVGhpcyBpcyB0aGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgY29uc3RydWN0b3IuXG4gIHZhciBtb2RlbCA9IGZ1bmN0aW9uICgpe1xuICAgIHZhciBvdXRwdXRQcm9wZXJ0eU5hbWUsIGNhbGxiYWNrLCBpbnB1dFByb3BlcnR5TmFtZXNcblxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDApe1xuICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSgpO1xuICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKXtcbiAgICAgIGlmKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09IFwib2JqZWN0XCIpe1xuXG4gICAgICAgIC8vIFRoZSBpbnZvY2F0aW9uIGlzIG9mIHRoZSBmb3JtIG1vZGVsKGNvbmZpZ3VyYXRpb24pXG4gICAgICAgIHJldHVybiBzZXRDb25maWd1cmF0aW9uKGFyZ3VtZW50c1swXSk7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIFRoZSBpbnZvY2F0aW9uIGlzIG9mIHRoZSBmb3JtIG1vZGVsKHByb3BlcnR5TmFtZSlcbiAgICAgICAgcmV0dXJuIGFkZFByb3BlcnR5KGFyZ3VtZW50c1swXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpe1xuICAgICAgaWYodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJmdW5jdGlvblwiKXtcblxuICAgICAgICAvLyBUaGUgaW52b2NhdGlvbiBpcyBvZiB0aGUgZm9ybSBtb2RlbChjYWxsYmFjaywgaW5wdXRQcm9wZXJ0eU5hbWVzKVxuICAgICAgICBpbnB1dFByb3BlcnR5TmFtZXMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBvdXRwdXRQcm9wZXJ0eU5hbWUgPSB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIFRoZSBpbnZvY2F0aW9uIGlzIG9mIHRoZSBmb3JtIG1vZGVsKHByb3BlcnR5TmFtZSwgZGVmYXVsdFZhbHVlKVxuICAgICAgICByZXR1cm4gYWRkUHJvcGVydHkoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAzKXtcbiAgICAgIG91dHB1dFByb3BlcnR5TmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzWzFdO1xuICAgICAgaW5wdXRQcm9wZXJ0eU5hbWVzID0gYXJndW1lbnRzWzJdO1xuICAgIH1cblxuICAgIC8vIGlucHV0UHJvcGVydHlOYW1lcyBtYXkgYmUgYSBzdHJpbmcgb2YgY29tbWEtc2VwYXJhdGVkIHByb3BlcnR5IG5hbWVzLFxuICAgIC8vIG9yIGFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICAgIGlmKHR5cGVvZiBpbnB1dFByb3BlcnR5TmFtZXMgPT09IFwic3RyaW5nXCIpe1xuICAgICAgaW5wdXRQcm9wZXJ0eU5hbWVzID0gaW5wdXRQcm9wZXJ0eU5hbWVzLnNwbGl0KFwiLFwiKS5tYXAoaW52b2tlKFwidHJpbVwiKSk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyB0aHJvdyBhbiBlcnJvciBpZiBhIHByb3BlcnR5IGlzIG5vdCBvbiB0aGUgbW9kZWwuXG4gICAgdmFyIGlucHV0cyA9IGlucHV0UHJvcGVydHlOYW1lcy5tYXAoZ2V0UHJvcGVydHkpO1xuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IHJlYWN0aXZlIHByb3BlcnR5IGZvciB0aGUgb3V0cHV0IGFuZCBhc3NpZ24gaXQgdG8gdGhlIG1vZGVsLlxuICAgIC8vIFRPRE8gdGhyb3cgYW4gZXJyb3IgaWYgdGhlIG91dHB1dCBwcm9wZXJ0eSBpcyBhbHJlYWR5IGRlZmluZWQgb24gdGhlIG1vZGVsLlxuICAgIGlmKG91dHB1dFByb3BlcnR5TmFtZSl7XG4gICAgICB2YXIgb3V0cHV0ID0gUmVhY3RpdmVQcm9wZXJ0eSgpO1xuICAgICAgb3V0cHV0LnByb3BlcnR5TmFtZSA9IG91dHB1dFByb3BlcnR5TmFtZTtcbiAgICAgIG1vZGVsW291dHB1dFByb3BlcnR5TmFtZV0gPSBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgZXhwZWN0ZWQgYnkgdGhlIGNhbGxiYWNrIGlzIG9uZSBncmVhdGVyIHRoYW4gdGhlXG4gICAgLy8gbnVtYmVyIG9mIGlucHV0cywgdGhlbiB0aGUgbGFzdCBhcmd1bWVudCBpcyB0aGUgXCJkb25lXCIgY2FsbGJhY2ssIGFuZCB0aGlzXG4gICAgLy8gcmVhY3RpdmUgZnVuY3Rpb24gd2lsbCBiZSBzZXQgdXAgdG8gYmUgYXN5bmNocm9ub3VzLiBUaGUgXCJkb25lXCIgY2FsbGJhY2sgc2hvdWxkXG4gICAgLy8gYmUgY2FsbGVkIHdpdGggdGhlIG5ldyB2YWx1ZSBvZiB0aGUgb3V0cHV0IHByb3BlcnR5IGFzeW5jaHJvbm91c2x5LlxuICAgIHZhciBpc0FzeW5jaHJvbm91cyA9IChjYWxsYmFjay5sZW5ndGggPT09IGlucHV0cy5sZW5ndGggKyAxKTtcbiAgICBpZihpc0FzeW5jaHJvbm91cyl7XG4gICAgICByZWFjdGl2ZUZ1bmN0aW9ucy5wdXNoKFJlYWN0aXZlRnVuY3Rpb24oe1xuICAgICAgICBpbnB1dHM6IGlucHV0cyxcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uICgpe1xuXG4gICAgICAgICAgLy8gQ29udmVydCB0aGUgYXJndW1lbnRzIHBhc3NlZCBpbnRvIHRoaXMgZnVuY3Rpb24gaW50byBhbiBhcnJheS5cbiAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAvLyBQdXNoIHRoZSBcImRvbmVcIiBjYWxsYmFjayBvbnRvIHRoZSBhcmdzIGFycmF5LlxuICAgICAgICAgIC8vIFdlIGFyZSBhY3RhbGx5IHBhc3NpbmcgdGhlIG91dHB1dCByZWFjdGl2ZSBwcm9wZXJ0eSBoZXJlLCBpbnZva2luZyBpdFxuICAgICAgICAgIC8vIGFzIHRoZSBcImRvbmVcIiBjYWxsYmFjayB3aWxsIHNldCB0aGUgdmFsdWUgb2YgdGhlIG91dHB1dCBwcm9wZXJ0eS5cbiAgICAgICAgICBhcmdzLnB1c2gob3V0cHV0KTtcblxuICAgICAgICAgIC8vIFdyYXAgaW4gc2V0VGltZW91dCB0byBndWFyYW50ZWUgdGhhdCB0aGUgb3V0cHV0IHByb3BlcnR5IGlzIHNldFxuICAgICAgICAgIC8vIGFzeW5jaHJvbm91c2x5LCBvdXRzaWRlIG9mIHRoZSBjdXJyZW50IGRpZ2VzdC4gVGhpcyBpcyBuZWNlc3NhcnlcbiAgICAgICAgICAvLyB0byBlbnN1cmUgdGhhdCBpZiBkZXZlbG9wZXJzIGluYWR2ZXJ0ZW50bHkgaW52b2tlIHRoZSBcImRvbmVcIiBjYWxsYmFjayBcbiAgICAgICAgICAvLyBzeW5jaHJvbm91c2x5LCB0aGVpciBjb2RlIHdpbGwgc3RpbGwgaGF2ZSB0aGUgZXhwZWN0ZWQgYmVoYXZpb3IuXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcblxuICAgICAgICAgICAgLy8gSW52b2tlIHRoZSBvcmlnaW5hbCBjYWxsYmFjayB3aXRoIHRoZSBhcmdzIGFycmF5IGFzIGFyZ3VtZW50cy5cbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWN0aXZlRnVuY3Rpb25zLnB1c2goUmVhY3RpdmVGdW5jdGlvbih7XG4gICAgICAgIGlucHV0czogaW5wdXRzLFxuICAgICAgICBvdXRwdXQ6IG91dHB1dCwgLy8gVGhpcyBtYXkgYmUgdW5kZWZpbmVkLlxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vZGVsO1xuICB9O1xuXG4gIC8vIEdldHMgYSByZWFjdGl2ZSBwcm9wZXJ0eSBmcm9tIHRoZSBtb2RlbCBieSBuYW1lLlxuICAvLyBDb252ZW5pZW50IGZvciBmdW5jdGlvbmFsIHBhdHRlcm5zIGxpa2UgYHByb3BlcnR5TmFtZXMubWFwKGdldFByb3BlcnR5KWBcbiAgZnVuY3Rpb24gZ2V0UHJvcGVydHkocHJvcGVydHlOYW1lKXtcbiAgICByZXR1cm4gbW9kZWxbcHJvcGVydHlOYW1lXTtcbiAgfVxuXG4gIC8vIEFkZHMgYSBwcm9wZXJ0eSB0byB0aGUgbW9kZWwgdGhhdCBpcyBub3QgZXhwb3NlZCxcbiAgLy8gbWVhbmluZyB0aGF0IGl0IGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gIGZ1bmN0aW9uIGFkZFByb3BlcnR5KHByb3BlcnR5TmFtZSwgZGVmYXVsdFZhbHVlKXtcbiAgICB2YXIgcHJvcGVydHkgPSBSZWFjdGl2ZVByb3BlcnR5KGRlZmF1bHRWYWx1ZSk7XG4gICAgcHJvcGVydHkucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgIG1vZGVsW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eTtcbiAgICBsYXN0UHJvcGVydHlBZGRlZCA9IHByb3BlcnR5TmFtZTtcbiAgICByZXR1cm4gbW9kZWw7XG5cbiAgICAvLyBUT0RPIHRocm93IGFuIGVycm9yIGlmIHRoZSBuYW1lIGlzIG5vdCBhdmFpbGFibGUgKGUuZy4gYW5vdGhlciBwcm9wZXJ0eSBuYW1lLCBcImNvbmZpZ3VyYXRpb25cIiBvciBcImFkZFB1YmxpY1Byb3BlcnR5XCIpLlxuICB9XG5cbiAgLy8gRXhwb3NlcyB0aGUgbGFzdCBhZGRlZCBwcm9wZXJ0eSB0byB0aGUgY29uZmlndXJhdGlvbi5cbiAgZnVuY3Rpb24gZXhwb3NlKCl7XG5cbiAgICAvLyBUT0RPIHRlc3QgdGhpc1xuICAgIC8vIGlmKCFpc0RlZmluZWQoZGVmYXVsdFZhbHVlKSl7XG4gICAgLy8gIHRocm93IG5ldyBFcnJvcihcIm1vZGVsLmFkZFB1YmxpY1Byb3BlcnR5KCkgaXMgYmVpbmcgXCIgK1xuICAgIC8vICAgIFwiaW52b2tlZCB3aXRoIGFuIHVuZGVmaW5lZCBkZWZhdWx0IHZhbHVlLiBEZWZhdWx0IHZhbHVlcyBmb3IgZXhwb3NlZCBwcm9wZXJ0aWVzIFwiICtcbiAgICAvLyAgICBcIm11c3QgYmUgZGVmaW5lZCwgdG8gZ3VhcmFudGVlIHByZWRpY3RhYmxlIGJlaGF2aW9yLiBGb3IgZXhwb3NlZCBwcm9wZXJ0aWVzIHRoYXQgXCIgK1xuICAgIC8vICAgIFwiYXJlIG9wdGlvbmFsIGFuZCBzaG91bGQgaGF2ZSB0aGUgc2VtYW50aWNzIG9mIGFuIHVuZGVmaW5lZCB2YWx1ZSwgXCIgK1xuICAgIC8vICAgIFwidXNlIG51bGwgYXMgdGhlIGRlZmF1bHQgdmFsdWUuXCIpO1xuICAgIC8vfVxuXG4gICAgLy8gVE9ETyB0ZXN0IHRoaXNcbiAgICBpZighbGFzdFByb3BlcnR5QWRkZWQpe1xuICAgICAgdGhyb3cgRXJyb3IoXCJFeHBvc2UoKSB3YXMgY2FsbGVkIHdpdGhvdXQgZmlyc3QgYWRkaW5nIGEgcHJvcGVydHkuXCIpO1xuICAgIH1cblxuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBsYXN0UHJvcGVydHlBZGRlZDtcblxuICAgIGlmKCFleHBvc2VkUHJvcGVydGllcyl7XG4gICAgICBleHBvc2VkUHJvcGVydGllcyA9IFtdO1xuICAgIH1cbiAgICBleHBvc2VkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cbiAgICAvLyBEZXN0cm95IHRoZSBwcmV2aW91cyByZWFjdGl2ZSBmdW5jdGlvbiB0aGF0IHdhcyBsaXN0ZW5pbmcgZm9yIGNoYW5nZXNcbiAgICAvLyBpbiBhbGwgZXhwb3NlZCBwcm9wZXJ0aWVzIGV4Y2VwdCB0aGUgbmV3bHkgYWRkZWQgb25lLlxuICAgIC8vIFRPRE8gdGhpbmsgYWJvdXQgaG93IHRoaXMgbWlnaHQgYmUgZG9uZSBvbmx5IG9uY2UsIGF0IHRoZSBzYW1lIHRpbWUgaXNGaW5hbGl6ZWQgaXMgc2V0LlxuICAgIGlmKGNvbmZpZ3VyYXRpb25SZWFjdGl2ZUZ1bmN0aW9uKXtcbiAgICAgIGNvbmZpZ3VyYXRpb25SZWFjdGl2ZUZ1bmN0aW9uLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdXAgdGhlIG5ldyByZWFjdGl2ZSBmdW5jdGlvbiB0aGF0IHdpbGwgbGlzdGVuIGZvciBjaGFuZ2VzXG4gICAgLy8gaW4gYWxsIGV4cG9zZWQgcHJvcGVydGllcyBpbmNsdWRpbmcgdGhlIG5ld2x5IGFkZGVkIG9uZS5cbiAgICB2YXIgaW5wdXRQcm9wZXJ0eU5hbWVzID0gZXhwb3NlZFByb3BlcnRpZXM7XG5cbiAgICAvL2NvbnNvbGUubG9nKGlucHV0UHJvcGVydHlOYW1lcyk7XG4gICAgY29uZmlndXJhdGlvblJlYWN0aXZlRnVuY3Rpb24gPSBSZWFjdGl2ZUZ1bmN0aW9uKHtcbiAgICAgIGlucHV0czogaW5wdXRQcm9wZXJ0eU5hbWVzLm1hcChnZXRQcm9wZXJ0eSksXG4gICAgICBvdXRwdXQ6IGNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgdmFyIGNvbmZpZ3VyYXRpb24gPSB7fTtcbiAgICAgICAgaW5wdXRQcm9wZXJ0eU5hbWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSl7XG4gICAgICAgICAgdmFyIHByb3BlcnR5ID0gZ2V0UHJvcGVydHkocHJvcGVydHlOYW1lKTtcblxuICAgICAgICAgIC8vIE9taXQgZGVmYXVsdCB2YWx1ZXMgZnJvbSB0aGUgcmV0dXJuZWQgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgICAgICAgaWYocHJvcGVydHkoKSAhPT0gcHJvcGVydHkuZGVmYXVsdCgpKXtcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25bcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTdXBwb3J0IG1ldGhvZCBjaGFpbmluZy5cbiAgICByZXR1cm4gbW9kZWw7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRDb25maWd1cmF0aW9uKG5ld0NvbmZpZ3VyYXRpb24pe1xuXG4gICAgZXhwb3NlZFByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHlOYW1lKXtcbiAgICAgIHZhciBwcm9wZXJ0eSA9IGdldFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XG4gICAgICB2YXIgb2xkVmFsdWUgPSBwcm9wZXJ0eSgpO1xuICAgICAgdmFyIG5ld1ZhbHVlO1xuXG4gICAgICBpZihwcm9wZXJ0eU5hbWUgaW4gbmV3Q29uZmlndXJhdGlvbil7XG4gICAgICAgIG5ld1ZhbHVlID0gbmV3Q29uZmlndXJhdGlvbltwcm9wZXJ0eU5hbWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBwcm9wZXJ0eS5kZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSl7XG4gICAgICAgIG1vZGVsW3Byb3BlcnR5TmFtZV0obmV3VmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgLy8gRGVzdHJveXMgYWxsIHJlYWN0aXZlIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgbW9kZWwuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKXtcbiAgICBcbiAgICAvLyBEZXN0cm95IHJlYWN0aXZlIGZ1bmN0aW9ucy5cbiAgICByZWFjdGl2ZUZ1bmN0aW9ucy5mb3JFYWNoKGludm9rZShcImRlc3Ryb3lcIikpO1xuICAgIGlmKGNvbmZpZ3VyYXRpb25SZWFjdGl2ZUZ1bmN0aW9uKXtcbiAgICAgIGNvbmZpZ3VyYXRpb25SZWFjdGl2ZUZ1bmN0aW9uLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgXG4gICAgLy8gRGVzdHJveSBwcm9wZXJ0aWVzIChyZW1vdmVzIGxpc3RlbmVycykuXG4gICAgT2JqZWN0LmtleXMobW9kZWwpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSl7XG4gICAgICB2YXIgcHJvcGVydHkgPSBtb2RlbFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgaWYocHJvcGVydHkuZGVzdHJveSl7XG4gICAgICAgIHByb3BlcnR5LmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFJlbGVhc2UgcmVmZXJlbmNlcy5cbiAgICByZWFjdGl2ZUZ1bmN0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICBjb25maWd1cmF0aW9uUmVhY3RpdmVGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbGwgKGZuKXtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgYXJnc1swXSA9IG1vZGVsO1xuICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIHJldHVybiBtb2RlbDtcbiAgfTtcblxuICBtb2RlbC5leHBvc2UgPSBleHBvc2U7XG4gIG1vZGVsLmRlc3Ryb3kgPSBkZXN0cm95O1xuICBtb2RlbC5jYWxsID0gY2FsbDtcbiAgbW9kZWwub24gPSBmdW5jdGlvbiAoY2FsbGJhY2spe1xuICBcbiAgICAvLyBFbnN1cmUgdGhlIGNhbGxiYWNrIGlzIGludm9rZWQgYXN5bmNocm9ub3VzbHksXG4gICAgLy8gc28gdGhhdCBwcm9wZXJ0eSB2YWx1ZXMgY2FuIGJlIHNldCBpbnNpZGUgaXQuXG4gICAgcmV0dXJuIGNvbmZpZ3VyYXRpb25Qcm9wZXJ0eS5vbihmdW5jdGlvbiAobmV3Q29uZmlndXJhdGlvbil7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xuICAgICAgICBjYWxsYmFjayhuZXdDb25maWd1cmF0aW9uKTtcbiAgICAgIH0sIDApO1xuICAgIH0pO1xuICB9O1xuXG4gIG1vZGVsLm9mZiA9IGNvbmZpZ3VyYXRpb25Qcm9wZXJ0eS5vZmY7XG5cbiAgLy8gRXhwb3NlIGRpZ2VzdCBvbiBpbnN0YW5jZXMgZm9yIGNvbnZlbmllbmNlLlxuICBtb2RlbC5kaWdlc3QgPSBmdW5jdGlvbiAoKXtcbiAgICBSZWFjdGl2ZU1vZGVsLmRpZ2VzdCgpO1xuICAgIHJldHVybiBtb2RlbDtcbiAgfTtcblxuICByZXR1cm4gbW9kZWw7XG59XG5cbi8vIEV4cG9zZSBzdGF0aWMgZnVuY3Rpb25zIGZyb20gUmVhY3RpdmVGdW5jdGlvbi5cblJlYWN0aXZlTW9kZWwuZGlnZXN0ICAgICAgICAgPSBSZWFjdGl2ZUZ1bmN0aW9uLmRpZ2VzdDtcblJlYWN0aXZlTW9kZWwuc2VyaWFsaXplR3JhcGggPSBSZWFjdGl2ZUZ1bmN0aW9uLnNlcmlhbGl6ZUdyYXBoO1xuUmVhY3RpdmVNb2RlbC5saW5rICAgICAgICAgICA9IFJlYWN0aXZlRnVuY3Rpb24ubGluaztcblxuLy9SZWFjdGl2ZU1vZGVsLm5leHRGcmFtZSA9IFJlYWN0aXZlRnVuY3Rpb24ubmV4dEZyYW1lO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0aXZlTW9kZWw7XG4iLCJleHBvcnQgdmFyIHhodG1sID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gIHhodG1sOiB4aHRtbCxcbiAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICB4bWw6IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIsXG4gIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCJcbn07XG4iLCJpbXBvcnQgbmFtZXNwYWNlcyBmcm9tIFwiLi9uYW1lc3BhY2VzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIHByZWZpeCA9IG5hbWUgKz0gXCJcIiwgaSA9IHByZWZpeC5pbmRleE9mKFwiOlwiKTtcbiAgaWYgKGkgPj0gMCAmJiAocHJlZml4ID0gbmFtZS5zbGljZSgwLCBpKSkgIT09IFwieG1sbnNcIikgbmFtZSA9IG5hbWUuc2xpY2UoaSArIDEpO1xuICByZXR1cm4gbmFtZXNwYWNlcy5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpID8ge3NwYWNlOiBuYW1lc3BhY2VzW3ByZWZpeF0sIGxvY2FsOiBuYW1lfSA6IG5hbWU7XG59XG4iLCJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuL25hbWVzcGFjZVwiO1xuaW1wb3J0IHt4aHRtbH0gZnJvbSBcIi4vbmFtZXNwYWNlc1wiO1xuXG5mdW5jdGlvbiBjcmVhdG9ySW5oZXJpdChuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVyaSA9IHRoaXMubmFtZXNwYWNlVVJJO1xuICAgIHJldHVybiB1cmkgPT09IHhodG1sICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5uYW1lc3BhY2VVUkkgPT09IHhodG1sXG4gICAgICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxuICAgICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh1cmksIG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdG9yRml4ZWQoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuICByZXR1cm4gKGZ1bGxuYW1lLmxvY2FsXG4gICAgICA/IGNyZWF0b3JGaXhlZFxuICAgICAgOiBjcmVhdG9ySW5oZXJpdCkoZnVsbG5hbWUpO1xufVxuIiwidmFyIG5leHRJZCA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsKCkge1xuICByZXR1cm4gbmV3IExvY2FsO1xufVxuXG5mdW5jdGlvbiBMb2NhbCgpIHtcbiAgdGhpcy5fID0gXCJAXCIgKyAoKytuZXh0SWQpLnRvU3RyaW5nKDM2KTtcbn1cblxuTG9jYWwucHJvdG90eXBlID0gbG9jYWwucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogTG9jYWwsXG4gIGdldDogZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciBpZCA9IHRoaXMuXztcbiAgICB3aGlsZSAoIShpZCBpbiBub2RlKSkgaWYgKCEobm9kZSA9IG5vZGUucGFyZW50Tm9kZSkpIHJldHVybjtcbiAgICByZXR1cm4gbm9kZVtpZF07XG4gIH0sXG4gIHNldDogZnVuY3Rpb24obm9kZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gbm9kZVt0aGlzLl9dID0gdmFsdWU7XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24obm9kZSkge1xuICAgIHJldHVybiB0aGlzLl8gaW4gbm9kZSAmJiBkZWxldGUgbm9kZVt0aGlzLl9dO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuXztcbiAgfVxufTtcbiIsInZhciBtYXRjaGVyID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXMoc2VsZWN0b3IpO1xuICB9O1xufTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgaWYgKCFlbGVtZW50Lm1hdGNoZXMpIHtcbiAgICB2YXIgdmVuZG9yTWF0Y2hlcyA9IGVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yXG4gICAgICAgIHx8IGVsZW1lbnQubXNNYXRjaGVzU2VsZWN0b3JcbiAgICAgICAgfHwgZWxlbWVudC5tb3pNYXRjaGVzU2VsZWN0b3JcbiAgICAgICAgfHwgZWxlbWVudC5vTWF0Y2hlc1NlbGVjdG9yO1xuICAgIG1hdGNoZXIgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmVuZG9yTWF0Y2hlcy5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBtYXRjaGVyO1xuIiwidmFyIGZpbHRlckV2ZW50cyA9IHt9O1xuXG5leHBvcnQgdmFyIGV2ZW50ID0gbnVsbDtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgaWYgKCEoXCJvbm1vdXNlZW50ZXJcIiBpbiBlbGVtZW50KSkge1xuICAgIGZpbHRlckV2ZW50cyA9IHttb3VzZWVudGVyOiBcIm1vdXNlb3ZlclwiLCBtb3VzZWxlYXZlOiBcIm1vdXNlb3V0XCJ9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbHRlckNvbnRleHRMaXN0ZW5lcihsaXN0ZW5lciwgaW5kZXgsIGdyb3VwKSB7XG4gIGxpc3RlbmVyID0gY29udGV4dExpc3RlbmVyKGxpc3RlbmVyLCBpbmRleCwgZ3JvdXApO1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgcmVsYXRlZCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQ7XG4gICAgaWYgKCFyZWxhdGVkIHx8IChyZWxhdGVkICE9PSB0aGlzICYmICEocmVsYXRlZC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0aGlzKSAmIDgpKSkge1xuICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb250ZXh0TGlzdGVuZXIobGlzdGVuZXIsIGluZGV4LCBncm91cCkge1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQxKSB7XG4gICAgdmFyIGV2ZW50MCA9IGV2ZW50OyAvLyBFdmVudHMgY2FuIGJlIHJlZW50cmFudCAoZS5nLiwgZm9jdXMpLlxuICAgIGV2ZW50ID0gZXZlbnQxO1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIHRoaXMuX19kYXRhX18sIGluZGV4LCBncm91cCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGV2ZW50ID0gZXZlbnQwO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBlbmFtZXModHlwZW5hbWVzKSB7XG4gIHJldHVybiB0eXBlbmFtZXMudHJpbSgpLnNwbGl0KC9efFxccysvKS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHZhciBuYW1lID0gXCJcIiwgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgbmFtZSA9IHQuc2xpY2UoaSArIDEpLCB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICByZXR1cm4ge3R5cGU6IHQsIG5hbWU6IG5hbWV9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gb25SZW1vdmUodHlwZW5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBvbiA9IHRoaXMuX19vbjtcbiAgICBpZiAoIW9uKSByZXR1cm47XG4gICAgZm9yICh2YXIgaiA9IDAsIGkgPSAtMSwgbSA9IG9uLmxlbmd0aCwgbzsgaiA8IG07ICsraikge1xuICAgICAgaWYgKG8gPSBvbltqXSwgKCF0eXBlbmFtZS50eXBlIHx8IG8udHlwZSA9PT0gdHlwZW5hbWUudHlwZSkgJiYgby5uYW1lID09PSB0eXBlbmFtZS5uYW1lKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIsIG8uY2FwdHVyZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvblsrK2ldID0gbztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCsraSkgb24ubGVuZ3RoID0gaTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9fb247XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uQWRkKHR5cGVuYW1lLCB2YWx1ZSwgY2FwdHVyZSkge1xuICB2YXIgd3JhcCA9IGZpbHRlckV2ZW50cy5oYXNPd25Qcm9wZXJ0eSh0eXBlbmFtZS50eXBlKSA/IGZpbHRlckNvbnRleHRMaXN0ZW5lciA6IGNvbnRleHRMaXN0ZW5lcjtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQsIGksIGdyb3VwKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uLCBvLCBsaXN0ZW5lciA9IHdyYXAodmFsdWUsIGksIGdyb3VwKTtcbiAgICBpZiAob24pIGZvciAodmFyIGogPSAwLCBtID0gb24ubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAoKG8gPSBvbltqXSkudHlwZSA9PT0gdHlwZW5hbWUudHlwZSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5jYXB0dXJlKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciA9IGxpc3RlbmVyLCBvLmNhcHR1cmUgPSBjYXB0dXJlKTtcbiAgICAgICAgby52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlbmFtZS50eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSk7XG4gICAgbyA9IHt0eXBlOiB0eXBlbmFtZS50eXBlLCBuYW1lOiB0eXBlbmFtZS5uYW1lLCB2YWx1ZTogdmFsdWUsIGxpc3RlbmVyOiBsaXN0ZW5lciwgY2FwdHVyZTogY2FwdHVyZX07XG4gICAgaWYgKCFvbikgdGhpcy5fX29uID0gW29dO1xuICAgIGVsc2Ugb24ucHVzaChvKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZW5hbWUsIHZhbHVlLCBjYXB0dXJlKSB7XG4gIHZhciB0eXBlbmFtZXMgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIpLCBpLCBuID0gdHlwZW5hbWVzLmxlbmd0aCwgdDtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgb24gPSB0aGlzLm5vZGUoKS5fX29uO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGZvciAoaSA9IDAsIG8gPSBvbltqXTsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoKHQgPSB0eXBlbmFtZXNbaV0pLnR5cGUgPT09IG8udHlwZSAmJiB0Lm5hbWUgPT09IG8ubmFtZSkge1xuICAgICAgICAgIHJldHVybiBvLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIG9uID0gdmFsdWUgPyBvbkFkZCA6IG9uUmVtb3ZlO1xuICBpZiAoY2FwdHVyZSA9PSBudWxsKSBjYXB0dXJlID0gZmFsc2U7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHRoaXMuZWFjaChvbih0eXBlbmFtZXNbaV0sIHZhbHVlLCBjYXB0dXJlKSk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tRXZlbnQoZXZlbnQxLCBsaXN0ZW5lciwgdGhhdCwgYXJncykge1xuICB2YXIgZXZlbnQwID0gZXZlbnQ7XG4gIGV2ZW50MS5zb3VyY2VFdmVudCA9IGV2ZW50O1xuICBldmVudCA9IGV2ZW50MTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gbGlzdGVuZXIuYXBwbHkodGhhdCwgYXJncyk7XG4gIH0gZmluYWxseSB7XG4gICAgZXZlbnQgPSBldmVudDA7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3RvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3Ioc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBzdWJub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChzdWJub2RlID0gc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSkge1xuICAgICAgICBpZiAoXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgICBzdWJncm91cFtpXSA9IHN1Ym5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHNlbGVjdG9yQWxsIGZyb20gXCIuLi9zZWxlY3RvckFsbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3JBbGwoc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBbXSwgcGFyZW50cyA9IFtdLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpO1xuICAgICAgICBwYXJlbnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCBwYXJlbnRzKTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IG1hdGNoZXIgZnJvbSBcIi4uL21hdGNoZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBtYXRjaCAhPT0gXCJmdW5jdGlvblwiKSBtYXRjaCA9IG1hdGNoZXIobWF0Y2gpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBbXSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBtYXRjaC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuLi9jb25zdGFudFwiO1xuXG52YXIga2V5UHJlZml4ID0gXCIkXCI7IC8vIFByb3RlY3QgYWdhaW5zdCBrZXlzIGxpa2Ug4oCcX19wcm90b19f4oCdLlxuXG5mdW5jdGlvbiBiaW5kSW5kZXgocGFyZW50LCBncm91cCwgZW50ZXIsIHVwZGF0ZSwgZXhpdCwgZGF0YSkge1xuICB2YXIgaSA9IDAsXG4gICAgICBub2RlLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cbiAgLy8gUHV0IGFueSBub24tbnVsbCBub2RlcyB0aGF0IGZpdCBpbnRvIHVwZGF0ZS5cbiAgLy8gUHV0IGFueSBudWxsIG5vZGVzIGludG8gZW50ZXIuXG4gIC8vIFB1dCBhbnkgcmVtYWluaW5nIGRhdGEgaW50byBlbnRlci5cbiAgZm9yICg7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZShwYXJlbnQsIGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBkb27igJl0IGZpdCBpbnRvIGV4aXQuXG4gIGZvciAoOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBiaW5kS2V5KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEsIGtleSkge1xuICB2YXIgaSxcbiAgICAgIG5vZGUsXG4gICAgICBub2RlQnlLZXlWYWx1ZSA9IHt9LFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICBrZXlWYWx1ZXMgPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpLFxuICAgICAga2V5VmFsdWU7XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIG5vZGUuXG4gIC8vIElmIG11bHRpcGxlIG5vZGVzIGhhdmUgdGhlIHNhbWUga2V5LCB0aGUgZHVwbGljYXRlcyBhcmUgYWRkZWQgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBrZXlWYWx1ZXNbaV0gPSBrZXlWYWx1ZSA9IGtleVByZWZpeCArIGtleS5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKTtcbiAgICAgIGlmIChrZXlWYWx1ZSBpbiBub2RlQnlLZXlWYWx1ZSkge1xuICAgICAgICBleGl0W2ldID0gbm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVCeUtleVZhbHVlW2tleVZhbHVlXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIGRhdHVtLlxuICAvLyBJZiB0aGVyZSBhIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMga2V5LCBqb2luIGFuZCBhZGQgaXQgdG8gdXBkYXRlLlxuICAvLyBJZiB0aGVyZSBpcyBub3QgKG9yIHRoZSBrZXkgaXMgYSBkdXBsaWNhdGUpLCBhZGQgaXQgdG8gZW50ZXIuXG4gIGZvciAoaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBrZXlWYWx1ZSA9IGtleVByZWZpeCArIGtleS5jYWxsKHBhcmVudCwgZGF0YVtpXSwgaSwgZGF0YSk7XG4gICAgaWYgKG5vZGUgPSBub2RlQnlLZXlWYWx1ZVtrZXlWYWx1ZV0pIHtcbiAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgIG5vZGVCeUtleVZhbHVlW2tleVZhbHVlXSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZShwYXJlbnQsIGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCBhbnkgcmVtYWluaW5nIG5vZGVzIHRoYXQgd2VyZSBub3QgYm91bmQgdG8gZGF0YSB0byBleGl0LlxuICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAobm9kZUJ5S2V5VmFsdWVba2V5VmFsdWVzW2ldXSA9PT0gbm9kZSkpIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICBkYXRhID0gbmV3IEFycmF5KHRoaXMuc2l6ZSgpKSwgaiA9IC0xO1xuICAgIHRoaXMuZWFjaChmdW5jdGlvbihkKSB7IGRhdGFbKytqXSA9IGQ7IH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgdmFyIGJpbmQgPSBrZXkgPyBiaW5kS2V5IDogYmluZEluZGV4LFxuICAgICAgcGFyZW50cyA9IHRoaXMuX3BhcmVudHMsXG4gICAgICBncm91cHMgPSB0aGlzLl9ncm91cHM7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB2YWx1ZSA9IGNvbnN0YW50KHZhbHVlKTtcblxuICBmb3IgKHZhciBtID0gZ3JvdXBzLmxlbmd0aCwgdXBkYXRlID0gbmV3IEFycmF5KG0pLCBlbnRlciA9IG5ldyBBcnJheShtKSwgZXhpdCA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICB2YXIgcGFyZW50ID0gcGFyZW50c1tqXSxcbiAgICAgICAgZ3JvdXAgPSBncm91cHNbal0sXG4gICAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgICBkYXRhID0gdmFsdWUuY2FsbChwYXJlbnQsIHBhcmVudCAmJiBwYXJlbnQuX19kYXRhX18sIGosIHBhcmVudHMpLFxuICAgICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICAgIGVudGVyR3JvdXAgPSBlbnRlcltqXSA9IG5ldyBBcnJheShkYXRhTGVuZ3RoKSxcbiAgICAgICAgdXBkYXRlR3JvdXAgPSB1cGRhdGVbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIGV4aXRHcm91cCA9IGV4aXRbal0gPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpO1xuXG4gICAgYmluZChwYXJlbnQsIGdyb3VwLCBlbnRlckdyb3VwLCB1cGRhdGVHcm91cCwgZXhpdEdyb3VwLCBkYXRhLCBrZXkpO1xuXG4gICAgLy8gTm93IGNvbm5lY3QgdGhlIGVudGVyIG5vZGVzIHRvIHRoZWlyIGZvbGxvd2luZyB1cGRhdGUgbm9kZSwgc3VjaCB0aGF0XG4gICAgLy8gYXBwZW5kQ2hpbGQgY2FuIGluc2VydCB0aGUgbWF0ZXJpYWxpemVkIGVudGVyIG5vZGUgYmVmb3JlIHRoaXMgbm9kZSxcbiAgICAvLyByYXRoZXIgdGhhbiBhdCB0aGUgZW5kIG9mIHRoZSBwYXJlbnQgbm9kZS5cbiAgICBmb3IgKHZhciBpMCA9IDAsIGkxID0gMCwgcHJldmlvdXMsIG5leHQ7IGkwIDwgZGF0YUxlbmd0aDsgKytpMCkge1xuICAgICAgaWYgKHByZXZpb3VzID0gZW50ZXJHcm91cFtpMF0pIHtcbiAgICAgICAgaWYgKGkwID49IGkxKSBpMSA9IGkwICsgMTtcbiAgICAgICAgd2hpbGUgKCEobmV4dCA9IHVwZGF0ZUdyb3VwW2kxXSkgJiYgKytpMSA8IGRhdGFMZW5ndGgpO1xuICAgICAgICBwcmV2aW91cy5fbmV4dCA9IG5leHQgfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGUgPSBuZXcgU2VsZWN0aW9uKHVwZGF0ZSwgcGFyZW50cyk7XG4gIHVwZGF0ZS5fZW50ZXIgPSBlbnRlcjtcbiAgdXBkYXRlLl9leGl0ID0gZXhpdDtcbiAgcmV0dXJuIHVwZGF0ZTtcbn1cblxuZnVuY3Rpb24gRW50ZXJOb2RlKHBhcmVudCwgZGF0dW0pIHtcbiAgdGhpcy5vd25lckRvY3VtZW50ID0gcGFyZW50Lm93bmVyRG9jdW1lbnQ7XG4gIHRoaXMubmFtZXNwYWNlVVJJID0gcGFyZW50Lm5hbWVzcGFjZVVSSTtcbiAgdGhpcy5fbmV4dCA9IG51bGw7XG4gIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5fX2RhdGFfXyA9IGRhdHVtO1xufVxuXG5FbnRlck5vZGUucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRW50ZXJOb2RlLFxuICBhcHBlbmRDaGlsZDogZnVuY3Rpb24oY2hpbGQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX25leHQpOyB9LFxuICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKGNoaWxkLCBuZXh0KSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBuZXh0KTsgfSxcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTsgfSxcbiAgcXVlcnlTZWxlY3RvckFsbDogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTsgfVxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHVwZGF0ZSkge1xuICByZXR1cm4gbmV3IEFycmF5KHVwZGF0ZS5sZW5ndGgpO1xufVxuIiwiaW1wb3J0IHNwYXJzZSBmcm9tIFwiLi9zcGFyc2VcIjtcbmltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZW50ZXIgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsImltcG9ydCBzcGFyc2UgZnJvbSBcIi4vc3BhcnNlXCI7XG5pbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2V4aXQgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rpb24pIHtcblxuICBmb3IgKHZhciBncm91cHMwID0gdGhpcy5fZ3JvdXBzLCBncm91cHMxID0gc2VsZWN0aW9uLl9ncm91cHMsIG0wID0gZ3JvdXBzMC5sZW5ndGgsIG0xID0gZ3JvdXBzMS5sZW5ndGgsIG0gPSBNYXRoLm1pbihtMCwgbTEpLCBtZXJnZXMgPSBuZXcgQXJyYXkobTApLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwMCA9IGdyb3VwczBbal0sIGdyb3VwMSA9IGdyb3VwczFbal0sIG4gPSBncm91cDAubGVuZ3RoLCBtZXJnZSA9IG1lcmdlc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXAwW2ldIHx8IGdyb3VwMVtpXSkge1xuICAgICAgICBtZXJnZVtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IGogPCBtMDsgKytqKSB7XG4gICAgbWVyZ2VzW2pdID0gZ3JvdXBzMFtqXTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKG1lcmdlcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAtMSwgbSA9IGdyb3Vwcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBuZXh0ICE9PSBub2RlLm5leHRTaWJsaW5nKSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb21wYXJlKSB7XG4gIGlmICghY29tcGFyZSkgY29tcGFyZSA9IGFzY2VuZGluZztcblxuICBmdW5jdGlvbiBjb21wYXJlTm9kZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmUoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc29ydGdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc29ydGdyb3VwID0gc29ydGdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc29ydGdyb3VwW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc29ydGdyb3VwLnNvcnQoY29tcGFyZU5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc29ydGdyb3VwcywgdGhpcy5fcGFyZW50cykub3JkZXIoKTtcbn1cblxuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1swXTtcbiAgYXJndW1lbnRzWzBdID0gdGhpcztcbiAgY2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIG5vZGVzID0gbmV3IEFycmF5KHRoaXMuc2l6ZSgpKSwgaSA9IC0xO1xuICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7IG5vZGVzWysraV0gPSB0aGlzOyB9KTtcbiAgcmV0dXJuIG5vZGVzO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIHNpemUgPSAwO1xuICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7ICsrc2l6ZTsgfSk7XG4gIHJldHVybiBzaXplO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5ub2RlKCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjYWxsYmFjaykge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsImltcG9ydCBuYW1lc3BhY2UgZnJvbSBcIi4uL25hbWVzcGFjZVwiO1xuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlTlMoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHYpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICByZXR1cm4gZnVsbG5hbWUubG9jYWxcbiAgICAgICAgPyBub2RlLmdldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbClcbiAgICAgICAgOiBub2RlLmdldEF0dHJpYnV0ZShmdWxsbmFtZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJSZW1vdmVOUyA6IGF0dHJSZW1vdmUpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAoZnVsbG5hbWUubG9jYWwgPyBhdHRyQ29uc3RhbnROUyA6IGF0dHJDb25zdGFudCkpKShmdWxsbmFtZSwgdmFsdWUpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIChub2RlLm93bmVyRG9jdW1lbnQgJiYgbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3KSAvLyBub2RlIGlzIGEgTm9kZVxuICAgICAgfHwgKG5vZGUuZG9jdW1lbnQgJiYgbm9kZSkgLy8gbm9kZSBpcyBhIFdpbmRvd1xuICAgICAgfHwgbm9kZS5kZWZhdWx0VmlldzsgLy8gbm9kZSBpcyBhIERvY3VtZW50XG59XG4iLCJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvd1wiO1xuXG5mdW5jdGlvbiBzdHlsZVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUNvbnN0YW50KG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHYsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHZhciBub2RlO1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHN0eWxlUmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gc3R5bGVGdW5jdGlvblxuICAgICAgICAgICAgOiBzdHlsZUNvbnN0YW50KShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkgPT0gbnVsbCA/IFwiXCIgOiBwcmlvcml0eSkpXG4gICAgICA6IGRlZmF1bHRWaWV3KG5vZGUgPSB0aGlzLm5vZGUoKSlcbiAgICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKVxuICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xufVxuIiwiZnVuY3Rpb24gcHJvcGVydHlSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXNbbmFtZV0gPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIGVsc2UgdGhpc1tuYW1lXSA9IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHByb3BlcnR5UmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHByb3BlcnR5RnVuY3Rpb25cbiAgICAgICAgICA6IHByb3BlcnR5Q29uc3RhbnQpKG5hbWUsIHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKClbbmFtZV07XG59XG4iLCJmdW5jdGlvbiBjbGFzc0FycmF5KHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnRyaW0oKS5zcGxpdCgvXnxcXHMrLyk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzTGlzdChub2RlKSB7XG4gIHJldHVybiBub2RlLmNsYXNzTGlzdCB8fCBuZXcgQ2xhc3NMaXN0KG5vZGUpO1xufVxuXG5mdW5jdGlvbiBDbGFzc0xpc3Qobm9kZSkge1xuICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgdGhpcy5fbmFtZXMgPSBjbGFzc0FycmF5KG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIik7XG59XG5cbkNsYXNzTGlzdC5wcm90b3R5cGUgPSB7XG4gIGFkZDogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoaSA8IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnB1c2gobmFtZSk7XG4gICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuX25hbWVzLmpvaW4oXCIgXCIpKTtcbiAgICB9XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5zcGxpY2UoaSwgMSk7XG4gICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuX25hbWVzLmpvaW4oXCIgXCIpKTtcbiAgICB9XG4gIH0sXG4gIGNvbnRhaW5zOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSkgPj0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY2xhc3NlZEFkZChub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5hZGQobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkUmVtb3ZlKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LnJlbW92ZShuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRUcnVlKG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjbGFzc2VkQWRkKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZEZhbHNlKG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjbGFzc2VkUmVtb3ZlKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZEZ1bmN0aW9uKG5hbWVzLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgKHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgPyBjbGFzc2VkQWRkIDogY2xhc3NlZFJlbW92ZSkodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgbmFtZXMgPSBjbGFzc0FycmF5KG5hbWUgKyBcIlwiKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgbGlzdCA9IGNsYXNzTGlzdCh0aGlzLm5vZGUoKSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFsaXN0LmNvbnRhaW5zKG5hbWVzW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gY2xhc3NlZEZ1bmN0aW9uIDogdmFsdWVcbiAgICAgID8gY2xhc3NlZFRydWVcbiAgICAgIDogY2xhc3NlZEZhbHNlKShuYW1lcywgdmFsdWUpKTtcbn1cbiIsImZ1bmN0aW9uIHRleHRSZW1vdmUoKSB7XG4gIHRoaXMudGV4dENvbnRlbnQgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiB0ZXh0Q29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGV4dEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gdGV4dFJlbW92ZSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gdGV4dEZ1bmN0aW9uXG4gICAgICAgICAgOiB0ZXh0Q29uc3RhbnQpKHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG59XG4iLCJmdW5jdGlvbiBodG1sUmVtb3ZlKCkge1xuICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIGh0bWxDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaHRtbEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IGh0bWxSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IGh0bWxGdW5jdGlvblxuICAgICAgICAgIDogaHRtbENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLmlubmVySFRNTDtcbn1cbiIsImZ1bmN0aW9uIHJhaXNlKCkge1xuICBpZiAodGhpcy5uZXh0U2libGluZykgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyYWlzZSk7XG59XG4iLCJmdW5jdGlvbiBsb3dlcigpIHtcbiAgaWYgKHRoaXMucHJldmlvdXNTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsIHRoaXMucGFyZW50Tm9kZS5maXJzdENoaWxkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gobG93ZXIpO1xufVxuIiwiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9KTtcbn1cbiIsImltcG9ydCBjcmVhdG9yIGZyb20gXCIuLi9jcmVhdG9yXCI7XG5pbXBvcnQgc2VsZWN0b3IgZnJvbSBcIi4uL3NlbGVjdG9yXCI7XG5cbmZ1bmN0aW9uIGNvbnN0YW50TnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpLFxuICAgICAgc2VsZWN0ID0gYmVmb3JlID09IG51bGwgPyBjb25zdGFudE51bGwgOiB0eXBlb2YgYmVmb3JlID09PSBcImZ1bmN0aW9uXCIgPyBiZWZvcmUgOiBzZWxlY3RvcihiZWZvcmUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBzZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCJmdW5jdGlvbiByZW1vdmUoKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIGlmIChwYXJlbnQpIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmVtb3ZlKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSlcbiAgICAgIDogdGhpcy5ub2RlKCkuX19kYXRhX187XG59XG4iLCJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvd1wiO1xuXG5mdW5jdGlvbiBkaXNwYXRjaEV2ZW50KG5vZGUsIHR5cGUsIHBhcmFtcykge1xuICB2YXIgd2luZG93ID0gZGVmYXVsdFZpZXcobm9kZSksXG4gICAgICBldmVudCA9IHdpbmRvdy5DdXN0b21FdmVudDtcblxuICBpZiAoZXZlbnQpIHtcbiAgICBldmVudCA9IG5ldyBldmVudCh0eXBlLCBwYXJhbXMpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiRXZlbnRcIik7XG4gICAgaWYgKHBhcmFtcykgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSksIGV2ZW50LmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gICAgZWxzZSBldmVudC5pbml0RXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlKTtcbiAgfVxuXG4gIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoQ29uc3RhbnQodHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHBhcmFtcyA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGRpc3BhdGNoRnVuY3Rpb25cbiAgICAgIDogZGlzcGF0Y2hDb25zdGFudCkodHlwZSwgcGFyYW1zKSk7XG59XG4iLCJpbXBvcnQgc2VsZWN0aW9uX3NlbGVjdCBmcm9tIFwiLi9zZWxlY3RcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0QWxsIGZyb20gXCIuL3NlbGVjdEFsbFwiO1xuaW1wb3J0IHNlbGVjdGlvbl9maWx0ZXIgZnJvbSBcIi4vZmlsdGVyXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdGEgZnJvbSBcIi4vZGF0YVwiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbnRlciBmcm9tIFwiLi9lbnRlclwiO1xuaW1wb3J0IHNlbGVjdGlvbl9leGl0IGZyb20gXCIuL2V4aXRcIjtcbmltcG9ydCBzZWxlY3Rpb25fbWVyZ2UgZnJvbSBcIi4vbWVyZ2VcIjtcbmltcG9ydCBzZWxlY3Rpb25fb3JkZXIgZnJvbSBcIi4vb3JkZXJcIjtcbmltcG9ydCBzZWxlY3Rpb25fc29ydCBmcm9tIFwiLi9zb3J0XCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NhbGwgZnJvbSBcIi4vY2FsbFwiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlcyBmcm9tIFwiLi9ub2Rlc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlIGZyb20gXCIuL25vZGVcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2l6ZSBmcm9tIFwiLi9zaXplXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VtcHR5IGZyb20gXCIuL2VtcHR5XCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VhY2ggZnJvbSBcIi4vZWFjaFwiO1xuaW1wb3J0IHNlbGVjdGlvbl9hdHRyIGZyb20gXCIuL2F0dHJcIjtcbmltcG9ydCBzZWxlY3Rpb25fc3R5bGUgZnJvbSBcIi4vc3R5bGVcIjtcbmltcG9ydCBzZWxlY3Rpb25fcHJvcGVydHkgZnJvbSBcIi4vcHJvcGVydHlcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xhc3NlZCBmcm9tIFwiLi9jbGFzc2VkXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3RleHQgZnJvbSBcIi4vdGV4dFwiO1xuaW1wb3J0IHNlbGVjdGlvbl9odG1sIGZyb20gXCIuL2h0bWxcIjtcbmltcG9ydCBzZWxlY3Rpb25fcmFpc2UgZnJvbSBcIi4vcmFpc2VcIjtcbmltcG9ydCBzZWxlY3Rpb25fbG93ZXIgZnJvbSBcIi4vbG93ZXJcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXBwZW5kIGZyb20gXCIuL2FwcGVuZFwiO1xuaW1wb3J0IHNlbGVjdGlvbl9pbnNlcnQgZnJvbSBcIi4vaW5zZXJ0XCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JlbW92ZSBmcm9tIFwiLi9yZW1vdmVcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0dW0gZnJvbSBcIi4vZGF0dW1cIjtcbmltcG9ydCBzZWxlY3Rpb25fb24gZnJvbSBcIi4vb25cIjtcbmltcG9ydCBzZWxlY3Rpb25fZGlzcGF0Y2ggZnJvbSBcIi4vZGlzcGF0Y2hcIjtcblxuZXhwb3J0IHZhciByb290ID0gW251bGxdO1xuXG5leHBvcnQgZnVuY3Rpb24gU2VsZWN0aW9uKGdyb3VwcywgcGFyZW50cykge1xuICB0aGlzLl9ncm91cHMgPSBncm91cHM7XG4gIHRoaXMuX3BhcmVudHMgPSBwYXJlbnRzO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XV0sIHJvb3QpO1xufVxuXG5TZWxlY3Rpb24ucHJvdG90eXBlID0gc2VsZWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFNlbGVjdGlvbixcbiAgc2VsZWN0OiBzZWxlY3Rpb25fc2VsZWN0LFxuICBzZWxlY3RBbGw6IHNlbGVjdGlvbl9zZWxlY3RBbGwsXG4gIGZpbHRlcjogc2VsZWN0aW9uX2ZpbHRlcixcbiAgZGF0YTogc2VsZWN0aW9uX2RhdGEsXG4gIGVudGVyOiBzZWxlY3Rpb25fZW50ZXIsXG4gIGV4aXQ6IHNlbGVjdGlvbl9leGl0LFxuICBtZXJnZTogc2VsZWN0aW9uX21lcmdlLFxuICBvcmRlcjogc2VsZWN0aW9uX29yZGVyLFxuICBzb3J0OiBzZWxlY3Rpb25fc29ydCxcbiAgY2FsbDogc2VsZWN0aW9uX2NhbGwsXG4gIG5vZGVzOiBzZWxlY3Rpb25fbm9kZXMsXG4gIG5vZGU6IHNlbGVjdGlvbl9ub2RlLFxuICBzaXplOiBzZWxlY3Rpb25fc2l6ZSxcbiAgZW1wdHk6IHNlbGVjdGlvbl9lbXB0eSxcbiAgZWFjaDogc2VsZWN0aW9uX2VhY2gsXG4gIGF0dHI6IHNlbGVjdGlvbl9hdHRyLFxuICBzdHlsZTogc2VsZWN0aW9uX3N0eWxlLFxuICBwcm9wZXJ0eTogc2VsZWN0aW9uX3Byb3BlcnR5LFxuICBjbGFzc2VkOiBzZWxlY3Rpb25fY2xhc3NlZCxcbiAgdGV4dDogc2VsZWN0aW9uX3RleHQsXG4gIGh0bWw6IHNlbGVjdGlvbl9odG1sLFxuICByYWlzZTogc2VsZWN0aW9uX3JhaXNlLFxuICBsb3dlcjogc2VsZWN0aW9uX2xvd2VyLFxuICBhcHBlbmQ6IHNlbGVjdGlvbl9hcHBlbmQsXG4gIGluc2VydDogc2VsZWN0aW9uX2luc2VydCxcbiAgcmVtb3ZlOiBzZWxlY3Rpb25fcmVtb3ZlLFxuICBkYXR1bTogc2VsZWN0aW9uX2RhdHVtLFxuICBvbjogc2VsZWN0aW9uX29uLFxuICBkaXNwYXRjaDogc2VsZWN0aW9uX2Rpc3BhdGNoXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZWxlY3Rpb247XG4iLCJpbXBvcnQge1NlbGVjdGlvbiwgcm9vdH0gZnJvbSBcIi4vc2VsZWN0aW9uL2luZGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCJcbiAgICAgID8gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXV0sIFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdKVxuICAgICAgOiBuZXcgU2VsZWN0aW9uKFtbc2VsZWN0b3JdXSwgcm9vdCk7XG59XG4iLCJpbXBvcnQgeyBzZWxlY3QgfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5cbi8vIFJlc2l6ZXMgdGhlIFNWRyBjb250YWluZXIuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTVkcgKG15KXtcbiAgbXkoXCJzdmdcIilcbiAgICAoXCJ3aWR0aFwiLCA5NjApXG4gICAgKFwiaGVpZ2h0XCIsIDUwMClcblxuICAgIChcInN2Z1NlbGVjdGlvblwiLCBzZWxlY3QsIFwic3ZnXCIpXG5cbiAgICAoXCJzdmctd2lkdGhcIiwgZnVuY3Rpb24gKHN2Z1NlbGVjdGlvbiwgd2lkdGgpe1xuICAgICAgc3ZnU2VsZWN0aW9uLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XG4gICAgfSwgXCJzdmdTZWxlY3Rpb24sIHdpZHRoXCIpXG5cbiAgICAoXCJzdmctaGVpZ2h0XCIsIGZ1bmN0aW9uIChzdmdTZWxlY3Rpb24sIGhlaWdodCl7XG4gICAgICBzdmdTZWxlY3Rpb24uYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xuICAgIH0sIFwic3ZnU2VsZWN0aW9uLCBoZWlnaHRcIik7XG59XG4iLCJpbXBvcnQgeyBzZWxlY3QgfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5cbi8vIEVuY2Fwc3VsYXRlcyB0aGUgbWFyZ2luIGNvbnZlbnRpb24uXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNYXJnaW4obXkpe1xuICBteShcIm1hcmdpblRvcFwiLCA1MClcbiAgICAoXCJtYXJnaW5Cb3R0b21cIiwgNTApXG4gICAgKFwibWFyZ2luTGVmdFwiLCA1MClcbiAgICAoXCJtYXJnaW5SaWdodFwiLCA1MClcblxuICAgIChcImlubmVyV2lkdGhcIiwgZnVuY3Rpb24gKHdpZHRoLCBtYXJnaW5MZWZ0LCBtYXJnaW5SaWdodCl7XG4gICAgICByZXR1cm4gd2lkdGggLSBtYXJnaW5MZWZ0IC0gbWFyZ2luUmlnaHQ7XG4gICAgfSwgXCJ3aWR0aCwgbWFyZ2luTGVmdCwgbWFyZ2luUmlnaHRcIilcblxuICAgIChcImlubmVySGVpZ2h0XCIsIGZ1bmN0aW9uIChoZWlnaHQsIG1hcmdpblRvcCwgbWFyZ2luQm90dG9tKXtcbiAgICAgIHJldHVybiBoZWlnaHQgLSBtYXJnaW5Ub3AgLSBtYXJnaW5Cb3R0b207XG4gICAgfSwgXCJoZWlnaHQsIG1hcmdpblRvcCwgbWFyZ2luQm90dG9tXCIpXG5cbiAgICAoXCJnXCIsIGZ1bmN0aW9uIChzdmdTZWxlY3Rpb24pe1xuXG4gICAgICB2YXIgZyA9IHN2Z1NlbGVjdGlvbi5zZWxlY3RBbGwoXCIucmVhY3RpdmUtdmlzLW1hcmdpbi1nXCIpXG4gICAgICAgIC5kYXRhKFsxXSk7XG5cbiAgICAgIHJldHVybiBnLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJyZWFjdGl2ZS12aXMtbWFyZ2luLWdcIilcbiAgICAgICAgLm1lcmdlKGcpO1xuXG4gICAgfSwgXCJzdmdTZWxlY3Rpb25cIilcblxuICAgIChcImctdHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChnLCBtYXJnaW5MZWZ0LCBtYXJnaW5Ub3Ape1xuICAgICAgZy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luTGVmdCArIFwiLFwiICsgbWFyZ2luVG9wICsgXCIpXCIpO1xuICAgIH0sIFwiZywgbWFyZ2luTGVmdCwgbWFyZ2luVG9wXCIpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGF0YSAobXkpe1xuICBteShcImRhdGFcIik7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb2x1bW4gKG15LCBuYW1lKXtcbiAgbXkobmFtZSArIFwiQ29sdW1uXCIpXG4gICAgKG5hbWUgKyBcIkFjY2Vzc29yXCIsIGZ1bmN0aW9uIChjb2x1bW4pe1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkKXsgcmV0dXJuIGRbY29sdW1uXTsgfTtcbiAgICB9LCBuYW1lICsgXCJDb2x1bW5cIik7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTY2FsZSAobXksIG5hbWUsIHNjYWxlQ29uc3RydWN0b3Ipe1xuXG4gIHZhciBzY2FsZSA9IHNjYWxlQ29uc3RydWN0b3IoKTtcblxuICBteSAobmFtZSArIFwiU2NhbGVcIiwgZnVuY3Rpb24oZG9tYWluLCByYW5nZSl7XG4gICAgcmV0dXJuIHNjYWxlXG4gICAgICAuZG9tYWluKGRvbWFpbilcbiAgICAgIC5yYW5nZShyYW5nZSk7XG4gIH0sIFtuYW1lICsgXCJEb21haW5cIiwgbmFtZSArIFwiUmFuZ2VcIl0pO1xuXG4gIG15KG5hbWUgKyBcIlNjYWxlZFwiLCBmdW5jdGlvbihzY2FsZSwgYWNjZXNzb3Ipe1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCl7XG4gICAgICByZXR1cm4gc2NhbGUoYWNjZXNzb3IoZCkpO1xuICAgIH07XG4gIH0sIFtuYW1lICsgXCJTY2FsZVwiLCBuYW1lICsgXCJBY2Nlc3NvclwiXSk7XG59XG4iLCIvLyBSZXNwb25kIHRvIHJlc2l6ZSBieSBzZXR0aW5nIHdpZHRoIGFuZCBoZWlnaHQgZnJvbSBET00gZWxlbWVudC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlc2l6ZShteSwgZWwpe1xuXG4gIGZ1bmN0aW9uIHJlc2l6ZSgpe1xuICAgIG15LndpZHRoKGVsLmNsaWVudFdpZHRoKVxuICAgICAgLmhlaWdodChlbC5jbGllbnRIZWlnaHQpO1xuICB9XG5cbiAgLy8gU2V0IGluaXRpYWwgc2l6ZS5cbiAgcmVzaXplKCk7XG5cbiAgLy8gR3VhcmQgc28gdW5pdCB0ZXN0cyBkb24ndCBicmVhayBpbiBOb2RlSlMgZW52aXJvbm1lbnQuXG4gIGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpe1xuXG4gICAgLy8gVXBkYXRlIHNpemUgd2hlbiB0aGUgYnJvd3NlciB3aW5kb3cgaXMgcmVzaXplZC5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCByZXNpemUpO1xuICB9XG59XG4iLCJpbXBvcnQgUmVhY3RpdmVNb2RlbCBmcm9tIFwicmVhY3RpdmUtbW9kZWxcIjtcbmltcG9ydCBTVkcgZnJvbSBcIi4uL21peGlucy9zdmdcIjtcbmltcG9ydCBEYXRhIGZyb20gXCIuLi9taXhpbnMvZGF0YVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDaXJjbGUoKXtcbiAgcmV0dXJuIFJlYWN0aXZlTW9kZWwoKVxuICAgIC5jYWxsKFNWRylcbiAgICAuY2FsbChEYXRhKVxuXG4gICAgKFwiY2lyY2xlXCIsIGZ1bmN0aW9uIChzdmdTZWxlY3Rpb24sIGRhdGEpe1xuXG4gICAgICB2YXIgY2lyY2xlID0gc3ZnU2VsZWN0aW9uLnNlbGVjdEFsbChcIi5yZWFjdGl2ZS12aXMtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKGRhdGEpO1xuXG4gICAgICByZXR1cm4gY2lyY2xlLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInJlYWN0aXZlLXZpcy1jaXJjbGVcIilcbiAgICAgICAgLm1lcmdlKGNpcmNsZSk7XG5cbiAgICB9LCBcInN2Z1NlbGVjdGlvbiwgZGF0YVwiKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufVxuIiwiaW1wb3J0IGFzY2VuZGluZyBmcm9tIFwiLi9hc2NlbmRpbmdcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29tcGFyZSkge1xuICBpZiAoY29tcGFyZS5sZW5ndGggPT09IDEpIGNvbXBhcmUgPSBhc2NlbmRpbmdDb21wYXJhdG9yKGNvbXBhcmUpO1xuICByZXR1cm4ge1xuICAgIGxlZnQ6IGZ1bmN0aW9uKGEsIHgsIGxvLCBoaSkge1xuICAgICAgaWYgKGxvID09IG51bGwpIGxvID0gMDtcbiAgICAgIGlmIChoaSA9PSBudWxsKSBoaSA9IGEubGVuZ3RoO1xuICAgICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgIGlmIChjb21wYXJlKGFbbWlkXSwgeCkgPCAwKSBsbyA9IG1pZCArIDE7XG4gICAgICAgIGVsc2UgaGkgPSBtaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gbG87XG4gICAgfSxcbiAgICByaWdodDogZnVuY3Rpb24oYSwgeCwgbG8sIGhpKSB7XG4gICAgICBpZiAobG8gPT0gbnVsbCkgbG8gPSAwO1xuICAgICAgaWYgKGhpID09IG51bGwpIGhpID0gYS5sZW5ndGg7XG4gICAgICB3aGlsZSAobG8gPCBoaSkge1xuICAgICAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICAgICAgaWYgKGNvbXBhcmUoYVttaWRdLCB4KSA+IDApIGhpID0gbWlkO1xuICAgICAgICBlbHNlIGxvID0gbWlkICsgMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsbztcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFzY2VuZGluZ0NvbXBhcmF0b3IoZikge1xuICByZXR1cm4gZnVuY3Rpb24oZCwgeCkge1xuICAgIHJldHVybiBhc2NlbmRpbmcoZihkKSwgeCk7XG4gIH07XG59XG4iLCJpbXBvcnQgYXNjZW5kaW5nIGZyb20gXCIuL2FzY2VuZGluZ1wiO1xuaW1wb3J0IGJpc2VjdG9yIGZyb20gXCIuL2Jpc2VjdG9yXCI7XG5cbnZhciBhc2NlbmRpbmdCaXNlY3QgPSBiaXNlY3Rvcihhc2NlbmRpbmcpO1xuZXhwb3J0IHZhciBiaXNlY3RSaWdodCA9IGFzY2VuZGluZ0Jpc2VjdC5yaWdodDtcbmV4cG9ydCB2YXIgYmlzZWN0TGVmdCA9IGFzY2VuZGluZ0Jpc2VjdC5sZWZ0O1xuZXhwb3J0IGRlZmF1bHQgYmlzZWN0UmlnaHQ7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhcnJheSwgZikge1xuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGEsXG4gICAgICBiLFxuICAgICAgYztcblxuICBpZiAoZiA9PSBudWxsKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYyA9IGI7IGJyZWFrOyB9XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsKSB7XG4gICAgICBpZiAoYSA+IGIpIGEgPSBiO1xuICAgICAgaWYgKGMgPCBiKSBjID0gYjtcbiAgICB9XG4gIH1cblxuICBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gZihhcnJheVtpXSwgaSwgYXJyYXkpKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYyA9IGI7IGJyZWFrOyB9XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYoYXJyYXlbaV0sIGksIGFycmF5KSkgIT0gbnVsbCkge1xuICAgICAgaWYgKGEgPiBiKSBhID0gYjtcbiAgICAgIGlmIChjIDwgYikgYyA9IGI7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFthLCBjXTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGFycmF5LCBmKSB7XG4gIHZhciBpID0gLTEsXG4gICAgICBuID0gYXJyYXkubGVuZ3RoLFxuICAgICAgYSxcbiAgICAgIGI7XG5cbiAgaWYgKGYgPT0gbnVsbCkge1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBhcnJheVtpXSkgIT0gbnVsbCAmJiBiID49IGIpIHsgYSA9IGI7IGJyZWFrOyB9XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGIgPiBhKSBhID0gYjtcbiAgfVxuXG4gIGVsc2Uge1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmKGFycmF5W2ldLCBpLCBhcnJheSkpICE9IG51bGwgJiYgYiA+PSBiKSB7IGEgPSBiOyBicmVhazsgfVxuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmKGFycmF5W2ldLCBpLCBhcnJheSkpICE9IG51bGwgJiYgYiA+IGEpIGEgPSBiO1xuICB9XG5cbiAgcmV0dXJuIGE7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn1cbiIsImltcG9ydCBhc2NlbmRpbmcgZnJvbSBcIi4vYXNjZW5kaW5nXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbXBhcmUpIHtcbiAgaWYgKGNvbXBhcmUubGVuZ3RoID09PSAxKSBjb21wYXJlID0gYXNjZW5kaW5nQ29tcGFyYXRvcihjb21wYXJlKTtcbiAgcmV0dXJuIHtcbiAgICBsZWZ0OiBmdW5jdGlvbihhLCB4LCBsbywgaGkpIHtcbiAgICAgIGlmIChsbyA9PSBudWxsKSBsbyA9IDA7XG4gICAgICBpZiAoaGkgPT0gbnVsbCkgaGkgPSBhLmxlbmd0aDtcbiAgICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgICAgICBpZiAoY29tcGFyZShhW21pZF0sIHgpIDwgMCkgbG8gPSBtaWQgKyAxO1xuICAgICAgICBlbHNlIGhpID0gbWlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxvO1xuICAgIH0sXG4gICAgcmlnaHQ6IGZ1bmN0aW9uKGEsIHgsIGxvLCBoaSkge1xuICAgICAgaWYgKGxvID09IG51bGwpIGxvID0gMDtcbiAgICAgIGlmIChoaSA9PSBudWxsKSBoaSA9IGEubGVuZ3RoO1xuICAgICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgIGlmIChjb21wYXJlKGFbbWlkXSwgeCkgPiAwKSBoaSA9IG1pZDtcbiAgICAgICAgZWxzZSBsbyA9IG1pZCArIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbG87XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBhc2NlbmRpbmdDb21wYXJhdG9yKGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQsIHgpIHtcbiAgICByZXR1cm4gYXNjZW5kaW5nKGYoZCksIHgpO1xuICB9O1xufVxuIiwiaW1wb3J0IGFzY2VuZGluZyBmcm9tIFwiLi9hc2NlbmRpbmdcIjtcbmltcG9ydCBiaXNlY3RvciBmcm9tIFwiLi9iaXNlY3RvclwiO1xuXG52YXIgYXNjZW5kaW5nQmlzZWN0ID0gYmlzZWN0b3IoYXNjZW5kaW5nKTtcbmV4cG9ydCB2YXIgYmlzZWN0UmlnaHQgPSBhc2NlbmRpbmdCaXNlY3QucmlnaHQ7XG5leHBvcnQgdmFyIGJpc2VjdExlZnQgPSBhc2NlbmRpbmdCaXNlY3QubGVmdDtcbmV4cG9ydCBkZWZhdWx0IGJpc2VjdFJpZ2h0O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgc3RhcnQgPSArc3RhcnQsIHN0b3AgPSArc3RvcCwgc3RlcCA9IChuID0gYXJndW1lbnRzLmxlbmd0aCkgPCAyID8gKHN0b3AgPSBzdGFydCwgc3RhcnQgPSAwLCAxKSA6IG4gPCAzID8gMSA6ICtzdGVwO1xuXG4gIHZhciBpID0gLTEsXG4gICAgICBuID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCkpIHwgMCxcbiAgICAgIHJhbmdlID0gbmV3IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgcmFuZ2VbaV0gPSBzdGFydCArIGkgKiBzdGVwO1xuICB9XG5cbiAgcmV0dXJuIHJhbmdlO1xufVxuIiwiaW1wb3J0IHJhbmdlIGZyb20gXCIuL3JhbmdlXCI7XG5cbnZhciBlMTAgPSBNYXRoLnNxcnQoNTApLFxuICAgIGU1ID0gTWF0aC5zcXJ0KDEwKSxcbiAgICBlMiA9IE1hdGguc3FydCgyKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3RhcnQsIHN0b3AsIGNvdW50KSB7XG4gIHZhciBzdGVwID0gdGlja1N0ZXAoc3RhcnQsIHN0b3AsIGNvdW50KTtcbiAgcmV0dXJuIHJhbmdlKFxuICAgIE1hdGguY2VpbChzdGFydCAvIHN0ZXApICogc3RlcCxcbiAgICBNYXRoLmZsb29yKHN0b3AgLyBzdGVwKSAqIHN0ZXAgKyBzdGVwIC8gMiwgLy8gaW5jbHVzaXZlXG4gICAgc3RlcFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja1N0ZXAoc3RhcnQsIHN0b3AsIGNvdW50KSB7XG4gIHZhciBzdGVwMCA9IE1hdGguYWJzKHN0b3AgLSBzdGFydCkgLyBNYXRoLm1heCgwLCBjb3VudCksXG4gICAgICBzdGVwMSA9IE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKHN0ZXAwKSAvIE1hdGguTE4xMCkpLFxuICAgICAgZXJyb3IgPSBzdGVwMCAvIHN0ZXAxO1xuICBpZiAoZXJyb3IgPj0gZTEwKSBzdGVwMSAqPSAxMDtcbiAgZWxzZSBpZiAoZXJyb3IgPj0gZTUpIHN0ZXAxICo9IDU7XG4gIGVsc2UgaWYgKGVycm9yID49IGUyKSBzdGVwMSAqPSAyO1xuICByZXR1cm4gc3RvcCA8IHN0YXJ0ID8gLXN0ZXAxIDogc3RlcDE7XG59XG4iLCJ2YXIgYXJyYXkgPSBBcnJheS5wcm90b3R5cGU7XG5cbmV4cG9ydCB2YXIgbWFwID0gYXJyYXkubWFwO1xuZXhwb3J0IHZhciBzbGljZSA9IGFycmF5LnNsaWNlO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29uc3RydWN0b3IsIGZhY3RvcnksIHByb3RvdHlwZSkge1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBmYWN0b3J5LnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgcHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQocGFyZW50LCBkZWZpbml0aW9uKSB7XG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xuICBmb3IgKHZhciBrZXkgaW4gZGVmaW5pdGlvbikgcHJvdG90eXBlW2tleV0gPSBkZWZpbml0aW9uW2tleV07XG4gIHJldHVybiBwcm90b3R5cGU7XG59XG4iLCJpbXBvcnQgZGVmaW5lLCB7ZXh0ZW5kfSBmcm9tIFwiLi9kZWZpbmVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbG9yKCkge31cblxuZXhwb3J0IHZhciBkYXJrZXIgPSAwLjc7XG5leHBvcnQgdmFyIGJyaWdodGVyID0gMSAvIGRhcmtlcjtcblxudmFyIHJlSGV4MyA9IC9eIyhbMC05YS1mXXszfSkkLyxcbiAgICByZUhleDYgPSAvXiMoWzAtOWEtZl17Nn0pJC8sXG4gICAgcmVSZ2JJbnRlZ2VyID0gL15yZ2JcXChcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKlxcKSQvLFxuICAgIHJlUmdiUGVyY2VudCA9IC9ecmdiXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccypcXCkkLyxcbiAgICByZVJnYmFJbnRlZ2VyID0gL15yZ2JhXFwoXFxzKihbLStdP1xcZCspXFxzKixcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKSQvLFxuICAgIHJlUmdiYVBlcmNlbnQgPSAvXnJnYmFcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqXFwpJC8sXG4gICAgcmVIc2xQZXJjZW50ID0gL15oc2xcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqXFwpJC8sXG4gICAgcmVIc2xhUGVyY2VudCA9IC9eaHNsYVxcKFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKSQvO1xuXG52YXIgbmFtZWQgPSB7XG4gIGFsaWNlYmx1ZTogMHhmMGY4ZmYsXG4gIGFudGlxdWV3aGl0ZTogMHhmYWViZDcsXG4gIGFxdWE6IDB4MDBmZmZmLFxuICBhcXVhbWFyaW5lOiAweDdmZmZkNCxcbiAgYXp1cmU6IDB4ZjBmZmZmLFxuICBiZWlnZTogMHhmNWY1ZGMsXG4gIGJpc3F1ZTogMHhmZmU0YzQsXG4gIGJsYWNrOiAweDAwMDAwMCxcbiAgYmxhbmNoZWRhbG1vbmQ6IDB4ZmZlYmNkLFxuICBibHVlOiAweDAwMDBmZixcbiAgYmx1ZXZpb2xldDogMHg4YTJiZTIsXG4gIGJyb3duOiAweGE1MmEyYSxcbiAgYnVybHl3b29kOiAweGRlYjg4NyxcbiAgY2FkZXRibHVlOiAweDVmOWVhMCxcbiAgY2hhcnRyZXVzZTogMHg3ZmZmMDAsXG4gIGNob2NvbGF0ZTogMHhkMjY5MWUsXG4gIGNvcmFsOiAweGZmN2Y1MCxcbiAgY29ybmZsb3dlcmJsdWU6IDB4NjQ5NWVkLFxuICBjb3Juc2lsazogMHhmZmY4ZGMsXG4gIGNyaW1zb246IDB4ZGMxNDNjLFxuICBjeWFuOiAweDAwZmZmZixcbiAgZGFya2JsdWU6IDB4MDAwMDhiLFxuICBkYXJrY3lhbjogMHgwMDhiOGIsXG4gIGRhcmtnb2xkZW5yb2Q6IDB4Yjg4NjBiLFxuICBkYXJrZ3JheTogMHhhOWE5YTksXG4gIGRhcmtncmVlbjogMHgwMDY0MDAsXG4gIGRhcmtncmV5OiAweGE5YTlhOSxcbiAgZGFya2toYWtpOiAweGJkYjc2YixcbiAgZGFya21hZ2VudGE6IDB4OGIwMDhiLFxuICBkYXJrb2xpdmVncmVlbjogMHg1NTZiMmYsXG4gIGRhcmtvcmFuZ2U6IDB4ZmY4YzAwLFxuICBkYXJrb3JjaGlkOiAweDk5MzJjYyxcbiAgZGFya3JlZDogMHg4YjAwMDAsXG4gIGRhcmtzYWxtb246IDB4ZTk5NjdhLFxuICBkYXJrc2VhZ3JlZW46IDB4OGZiYzhmLFxuICBkYXJrc2xhdGVibHVlOiAweDQ4M2Q4YixcbiAgZGFya3NsYXRlZ3JheTogMHgyZjRmNGYsXG4gIGRhcmtzbGF0ZWdyZXk6IDB4MmY0ZjRmLFxuICBkYXJrdHVycXVvaXNlOiAweDAwY2VkMSxcbiAgZGFya3Zpb2xldDogMHg5NDAwZDMsXG4gIGRlZXBwaW5rOiAweGZmMTQ5MyxcbiAgZGVlcHNreWJsdWU6IDB4MDBiZmZmLFxuICBkaW1ncmF5OiAweDY5Njk2OSxcbiAgZGltZ3JleTogMHg2OTY5NjksXG4gIGRvZGdlcmJsdWU6IDB4MWU5MGZmLFxuICBmaXJlYnJpY2s6IDB4YjIyMjIyLFxuICBmbG9yYWx3aGl0ZTogMHhmZmZhZjAsXG4gIGZvcmVzdGdyZWVuOiAweDIyOGIyMixcbiAgZnVjaHNpYTogMHhmZjAwZmYsXG4gIGdhaW5zYm9ybzogMHhkY2RjZGMsXG4gIGdob3N0d2hpdGU6IDB4ZjhmOGZmLFxuICBnb2xkOiAweGZmZDcwMCxcbiAgZ29sZGVucm9kOiAweGRhYTUyMCxcbiAgZ3JheTogMHg4MDgwODAsXG4gIGdyZWVuOiAweDAwODAwMCxcbiAgZ3JlZW55ZWxsb3c6IDB4YWRmZjJmLFxuICBncmV5OiAweDgwODA4MCxcbiAgaG9uZXlkZXc6IDB4ZjBmZmYwLFxuICBob3RwaW5rOiAweGZmNjliNCxcbiAgaW5kaWFucmVkOiAweGNkNWM1YyxcbiAgaW5kaWdvOiAweDRiMDA4MixcbiAgaXZvcnk6IDB4ZmZmZmYwLFxuICBraGFraTogMHhmMGU2OGMsXG4gIGxhdmVuZGVyOiAweGU2ZTZmYSxcbiAgbGF2ZW5kZXJibHVzaDogMHhmZmYwZjUsXG4gIGxhd25ncmVlbjogMHg3Y2ZjMDAsXG4gIGxlbW9uY2hpZmZvbjogMHhmZmZhY2QsXG4gIGxpZ2h0Ymx1ZTogMHhhZGQ4ZTYsXG4gIGxpZ2h0Y29yYWw6IDB4ZjA4MDgwLFxuICBsaWdodGN5YW46IDB4ZTBmZmZmLFxuICBsaWdodGdvbGRlbnJvZHllbGxvdzogMHhmYWZhZDIsXG4gIGxpZ2h0Z3JheTogMHhkM2QzZDMsXG4gIGxpZ2h0Z3JlZW46IDB4OTBlZTkwLFxuICBsaWdodGdyZXk6IDB4ZDNkM2QzLFxuICBsaWdodHBpbms6IDB4ZmZiNmMxLFxuICBsaWdodHNhbG1vbjogMHhmZmEwN2EsXG4gIGxpZ2h0c2VhZ3JlZW46IDB4MjBiMmFhLFxuICBsaWdodHNreWJsdWU6IDB4ODdjZWZhLFxuICBsaWdodHNsYXRlZ3JheTogMHg3Nzg4OTksXG4gIGxpZ2h0c2xhdGVncmV5OiAweDc3ODg5OSxcbiAgbGlnaHRzdGVlbGJsdWU6IDB4YjBjNGRlLFxuICBsaWdodHllbGxvdzogMHhmZmZmZTAsXG4gIGxpbWU6IDB4MDBmZjAwLFxuICBsaW1lZ3JlZW46IDB4MzJjZDMyLFxuICBsaW5lbjogMHhmYWYwZTYsXG4gIG1hZ2VudGE6IDB4ZmYwMGZmLFxuICBtYXJvb246IDB4ODAwMDAwLFxuICBtZWRpdW1hcXVhbWFyaW5lOiAweDY2Y2RhYSxcbiAgbWVkaXVtYmx1ZTogMHgwMDAwY2QsXG4gIG1lZGl1bW9yY2hpZDogMHhiYTU1ZDMsXG4gIG1lZGl1bXB1cnBsZTogMHg5MzcwZGIsXG4gIG1lZGl1bXNlYWdyZWVuOiAweDNjYjM3MSxcbiAgbWVkaXVtc2xhdGVibHVlOiAweDdiNjhlZSxcbiAgbWVkaXVtc3ByaW5nZ3JlZW46IDB4MDBmYTlhLFxuICBtZWRpdW10dXJxdW9pc2U6IDB4NDhkMWNjLFxuICBtZWRpdW12aW9sZXRyZWQ6IDB4YzcxNTg1LFxuICBtaWRuaWdodGJsdWU6IDB4MTkxOTcwLFxuICBtaW50Y3JlYW06IDB4ZjVmZmZhLFxuICBtaXN0eXJvc2U6IDB4ZmZlNGUxLFxuICBtb2NjYXNpbjogMHhmZmU0YjUsXG4gIG5hdmFqb3doaXRlOiAweGZmZGVhZCxcbiAgbmF2eTogMHgwMDAwODAsXG4gIG9sZGxhY2U6IDB4ZmRmNWU2LFxuICBvbGl2ZTogMHg4MDgwMDAsXG4gIG9saXZlZHJhYjogMHg2YjhlMjMsXG4gIG9yYW5nZTogMHhmZmE1MDAsXG4gIG9yYW5nZXJlZDogMHhmZjQ1MDAsXG4gIG9yY2hpZDogMHhkYTcwZDYsXG4gIHBhbGVnb2xkZW5yb2Q6IDB4ZWVlOGFhLFxuICBwYWxlZ3JlZW46IDB4OThmYjk4LFxuICBwYWxldHVycXVvaXNlOiAweGFmZWVlZSxcbiAgcGFsZXZpb2xldHJlZDogMHhkYjcwOTMsXG4gIHBhcGF5YXdoaXA6IDB4ZmZlZmQ1LFxuICBwZWFjaHB1ZmY6IDB4ZmZkYWI5LFxuICBwZXJ1OiAweGNkODUzZixcbiAgcGluazogMHhmZmMwY2IsXG4gIHBsdW06IDB4ZGRhMGRkLFxuICBwb3dkZXJibHVlOiAweGIwZTBlNixcbiAgcHVycGxlOiAweDgwMDA4MCxcbiAgcmViZWNjYXB1cnBsZTogMHg2NjMzOTksXG4gIHJlZDogMHhmZjAwMDAsXG4gIHJvc3licm93bjogMHhiYzhmOGYsXG4gIHJveWFsYmx1ZTogMHg0MTY5ZTEsXG4gIHNhZGRsZWJyb3duOiAweDhiNDUxMyxcbiAgc2FsbW9uOiAweGZhODA3MixcbiAgc2FuZHlicm93bjogMHhmNGE0NjAsXG4gIHNlYWdyZWVuOiAweDJlOGI1NyxcbiAgc2Vhc2hlbGw6IDB4ZmZmNWVlLFxuICBzaWVubmE6IDB4YTA1MjJkLFxuICBzaWx2ZXI6IDB4YzBjMGMwLFxuICBza3libHVlOiAweDg3Y2VlYixcbiAgc2xhdGVibHVlOiAweDZhNWFjZCxcbiAgc2xhdGVncmF5OiAweDcwODA5MCxcbiAgc2xhdGVncmV5OiAweDcwODA5MCxcbiAgc25vdzogMHhmZmZhZmEsXG4gIHNwcmluZ2dyZWVuOiAweDAwZmY3ZixcbiAgc3RlZWxibHVlOiAweDQ2ODJiNCxcbiAgdGFuOiAweGQyYjQ4YyxcbiAgdGVhbDogMHgwMDgwODAsXG4gIHRoaXN0bGU6IDB4ZDhiZmQ4LFxuICB0b21hdG86IDB4ZmY2MzQ3LFxuICB0dXJxdW9pc2U6IDB4NDBlMGQwLFxuICB2aW9sZXQ6IDB4ZWU4MmVlLFxuICB3aGVhdDogMHhmNWRlYjMsXG4gIHdoaXRlOiAweGZmZmZmZixcbiAgd2hpdGVzbW9rZTogMHhmNWY1ZjUsXG4gIHllbGxvdzogMHhmZmZmMDAsXG4gIHllbGxvd2dyZWVuOiAweDlhY2QzMlxufTtcblxuZGVmaW5lKENvbG9yLCBjb2xvciwge1xuICBkaXNwbGF5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmdiKCkuZGlzcGxheWFibGUoKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJnYigpICsgXCJcIjtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbG9yKGZvcm1hdCkge1xuICB2YXIgbTtcbiAgZm9ybWF0ID0gKGZvcm1hdCArIFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKG0gPSByZUhleDMuZXhlYyhmb3JtYXQpKSA/IChtID0gcGFyc2VJbnQobVsxXSwgMTYpLCBuZXcgUmdiKChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4MGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpLCAxKSkgLy8gI2YwMFxuICAgICAgOiAobSA9IHJlSGV4Ni5leGVjKGZvcm1hdCkpID8gcmdibihwYXJzZUludChtWzFdLCAxNikpIC8vICNmZjAwMDBcbiAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSwgbVsyXSwgbVszXSwgMSkgLy8gcmdiKDI1NSwgMCwgMClcbiAgICAgIDogKG0gPSByZVJnYlBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgMSkgLy8gcmdiKDEwMCUsIDAlLCAwJSlcbiAgICAgIDogKG0gPSByZVJnYmFJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyByZ2JhKG1bMV0sIG1bMl0sIG1bM10sIG1bNF0pIC8vIHJnYmEoMjU1LCAwLCAwLCAxKVxuICAgICAgOiAobSA9IHJlUmdiYVBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IHJnYmEobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgbVs0XSkgLy8gcmdiKDEwMCUsIDAlLCAwJSwgMSlcbiAgICAgIDogKG0gPSByZUhzbFBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbGEobVsxXSwgbVsyXSAvIDEwMCwgbVszXSAvIDEwMCwgMSkgLy8gaHNsKDEyMCwgNTAlLCA1MCUpXG4gICAgICA6IChtID0gcmVIc2xhUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsYShtWzFdLCBtWzJdIC8gMTAwLCBtWzNdIC8gMTAwLCBtWzRdKSAvLyBoc2xhKDEyMCwgNTAlLCA1MCUsIDEpXG4gICAgICA6IG5hbWVkLmhhc093blByb3BlcnR5KGZvcm1hdCkgPyByZ2JuKG5hbWVkW2Zvcm1hdF0pXG4gICAgICA6IGZvcm1hdCA9PT0gXCJ0cmFuc3BhcmVudFwiID8gbmV3IFJnYihOYU4sIE5hTiwgTmFOLCAwKVxuICAgICAgOiBudWxsO1xufVxuXG5mdW5jdGlvbiByZ2JuKG4pIHtcbiAgcmV0dXJuIG5ldyBSZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmLCAxKTtcbn1cblxuZnVuY3Rpb24gcmdiYShyLCBnLCBiLCBhKSB7XG4gIGlmIChhIDw9IDApIHIgPSBnID0gYiA9IE5hTjtcbiAgcmV0dXJuIG5ldyBSZ2IociwgZywgYiwgYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZ2JDb252ZXJ0KG8pIHtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIENvbG9yKSkgbyA9IGNvbG9yKG8pO1xuICBpZiAoIW8pIHJldHVybiBuZXcgUmdiO1xuICBvID0gby5yZ2IoKTtcbiAgcmV0dXJuIG5ldyBSZ2Ioby5yLCBvLmcsIG8uYiwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYihyLCBnLCBiLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gcmdiQ29udmVydChyKSA6IG5ldyBSZ2IociwgZywgYiwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmdiKHIsIGcsIGIsIG9wYWNpdHkpIHtcbiAgdGhpcy5yID0gK3I7XG4gIHRoaXMuZyA9ICtnO1xuICB0aGlzLmIgPSArYjtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShSZ2IsIHJnYiwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGRpc3BsYXlhYmxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKDAgPD0gdGhpcy5yICYmIHRoaXMuciA8PSAyNTUpXG4gICAgICAgICYmICgwIDw9IHRoaXMuZyAmJiB0aGlzLmcgPD0gMjU1KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmIgJiYgdGhpcy5iIDw9IDI1NSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5vcGFjaXR5ICYmIHRoaXMub3BhY2l0eSA8PSAxKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhID0gdGhpcy5vcGFjaXR5OyBhID0gaXNOYU4oYSkgPyAxIDogTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgYSkpO1xuICAgIHJldHVybiAoYSA9PT0gMSA/IFwicmdiKFwiIDogXCJyZ2JhKFwiKVxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLnIpIHx8IDApKSArIFwiLCBcIlxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLmcpIHx8IDApKSArIFwiLCBcIlxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLmIpIHx8IDApKVxuICAgICAgICArIChhID09PSAxID8gXCIpXCIgOiBcIiwgXCIgKyBhICsgXCIpXCIpO1xuICB9XG59KSk7XG5cbmZ1bmN0aW9uIGhzbGEoaCwgcywgbCwgYSkge1xuICBpZiAoYSA8PSAwKSBoID0gcyA9IGwgPSBOYU47XG4gIGVsc2UgaWYgKGwgPD0gMCB8fCBsID49IDEpIGggPSBzID0gTmFOO1xuICBlbHNlIGlmIChzIDw9IDApIGggPSBOYU47XG4gIHJldHVybiBuZXcgSHNsKGgsIHMsIGwsIGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHNsQ29udmVydChvKSB7XG4gIGlmIChvIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gbmV3IEhzbChvLmgsIG8ucywgby5sLCBvLm9wYWNpdHkpO1xuICBpZiAoIShvIGluc3RhbmNlb2YgQ29sb3IpKSBvID0gY29sb3Iobyk7XG4gIGlmICghbykgcmV0dXJuIG5ldyBIc2w7XG4gIGlmIChvIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gbztcbiAgbyA9IG8ucmdiKCk7XG4gIHZhciByID0gby5yIC8gMjU1LFxuICAgICAgZyA9IG8uZyAvIDI1NSxcbiAgICAgIGIgPSBvLmIgLyAyNTUsXG4gICAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcbiAgICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxuICAgICAgaCA9IE5hTixcbiAgICAgIHMgPSBtYXggLSBtaW4sXG4gICAgICBsID0gKG1heCArIG1pbikgLyAyO1xuICBpZiAocykge1xuICAgIGlmIChyID09PSBtYXgpIGggPSAoZyAtIGIpIC8gcyArIChnIDwgYikgKiA2O1xuICAgIGVsc2UgaWYgKGcgPT09IG1heCkgaCA9IChiIC0gcikgLyBzICsgMjtcbiAgICBlbHNlIGggPSAociAtIGcpIC8gcyArIDQ7XG4gICAgcyAvPSBsIDwgMC41ID8gbWF4ICsgbWluIDogMiAtIG1heCAtIG1pbjtcbiAgICBoICo9IDYwO1xuICB9IGVsc2Uge1xuICAgIHMgPSBsID4gMCAmJiBsIDwgMSA/IDAgOiBoO1xuICB9XG4gIHJldHVybiBuZXcgSHNsKGgsIHMsIGwsIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoc2woaCwgcywgbCwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IGhzbENvbnZlcnQoaCkgOiBuZXcgSHNsKGgsIHMsIGwsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZnVuY3Rpb24gSHNsKGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgdGhpcy5oID0gK2g7XG4gIHRoaXMucyA9ICtzO1xuICB0aGlzLmwgPSArbDtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShIc2wsIGhzbCwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXI6IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaCA9IHRoaXMuaCAlIDM2MCArICh0aGlzLmggPCAwKSAqIDM2MCxcbiAgICAgICAgcyA9IGlzTmFOKGgpIHx8IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zLFxuICAgICAgICBsID0gdGhpcy5sLFxuICAgICAgICBtMiA9IGwgKyAobCA8IDAuNSA/IGwgOiAxIC0gbCkgKiBzLFxuICAgICAgICBtMSA9IDIgKiBsIC0gbTI7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICBoc2wycmdiKGggPj0gMjQwID8gaCAtIDI0MCA6IGggKyAxMjAsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGgsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGggPCAxMjAgPyBoICsgMjQwIDogaCAtIDEyMCwgbTEsIG0yKSxcbiAgICAgIHRoaXMub3BhY2l0eVxuICAgICk7XG4gIH0sXG4gIGRpc3BsYXlhYmxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKDAgPD0gdGhpcy5zICYmIHRoaXMucyA8PSAxIHx8IGlzTmFOKHRoaXMucykpXG4gICAgICAgICYmICgwIDw9IHRoaXMubCAmJiB0aGlzLmwgPD0gMSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5vcGFjaXR5ICYmIHRoaXMub3BhY2l0eSA8PSAxKTtcbiAgfVxufSkpO1xuXG4vKiBGcm9tIEZ2RCAxMy4zNywgQ1NTIENvbG9yIE1vZHVsZSBMZXZlbCAzICovXG5mdW5jdGlvbiBoc2wycmdiKGgsIG0xLCBtMikge1xuICByZXR1cm4gKGggPCA2MCA/IG0xICsgKG0yIC0gbTEpICogaCAvIDYwXG4gICAgICA6IGggPCAxODAgPyBtMlxuICAgICAgOiBoIDwgMjQwID8gbTEgKyAobTIgLSBtMSkgKiAoMjQwIC0gaCkgLyA2MFxuICAgICAgOiBtMSkgKiAyNTU7XG59XG4iLCJleHBvcnQgdmFyIGRlZzJyYWQgPSBNYXRoLlBJIC8gMTgwO1xuZXhwb3J0IHZhciByYWQyZGVnID0gMTgwIC8gTWF0aC5QSTtcbiIsImltcG9ydCBkZWZpbmUsIHtleHRlbmR9IGZyb20gXCIuL2RlZmluZVwiO1xuaW1wb3J0IHtDb2xvciwgcmdiQ29udmVydCwgUmdifSBmcm9tIFwiLi9jb2xvclwiO1xuaW1wb3J0IHtkZWcycmFkLCByYWQyZGVnfSBmcm9tIFwiLi9tYXRoXCI7XG5cbnZhciBLbiA9IDE4LFxuICAgIFhuID0gMC45NTA0NzAsIC8vIEQ2NSBzdGFuZGFyZCByZWZlcmVudFxuICAgIFluID0gMSxcbiAgICBabiA9IDEuMDg4ODMwLFxuICAgIHQwID0gNCAvIDI5LFxuICAgIHQxID0gNiAvIDI5LFxuICAgIHQyID0gMyAqIHQxICogdDEsXG4gICAgdDMgPSB0MSAqIHQxICogdDE7XG5cbmZ1bmN0aW9uIGxhYkNvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIExhYikgcmV0dXJuIG5ldyBMYWIoby5sLCBvLmEsIG8uYiwgby5vcGFjaXR5KTtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIY2wpIHtcbiAgICB2YXIgaCA9IG8uaCAqIGRlZzJyYWQ7XG4gICAgcmV0dXJuIG5ldyBMYWIoby5sLCBNYXRoLmNvcyhoKSAqIG8uYywgTWF0aC5zaW4oaCkgKiBvLmMsIG8ub3BhY2l0eSk7XG4gIH1cbiAgaWYgKCEobyBpbnN0YW5jZW9mIFJnYikpIG8gPSByZ2JDb252ZXJ0KG8pO1xuICB2YXIgYiA9IHJnYjJ4eXooby5yKSxcbiAgICAgIGEgPSByZ2IyeHl6KG8uZyksXG4gICAgICBsID0gcmdiMnh5eihvLmIpLFxuICAgICAgeCA9IHh5ejJsYWIoKDAuNDEyNDU2NCAqIGIgKyAwLjM1NzU3NjEgKiBhICsgMC4xODA0Mzc1ICogbCkgLyBYbiksXG4gICAgICB5ID0geHl6MmxhYigoMC4yMTI2NzI5ICogYiArIDAuNzE1MTUyMiAqIGEgKyAwLjA3MjE3NTAgKiBsKSAvIFluKSxcbiAgICAgIHogPSB4eXoybGFiKCgwLjAxOTMzMzkgKiBiICsgMC4xMTkxOTIwICogYSArIDAuOTUwMzA0MSAqIGwpIC8gWm4pO1xuICByZXR1cm4gbmV3IExhYigxMTYgKiB5IC0gMTYsIDUwMCAqICh4IC0geSksIDIwMCAqICh5IC0geiksIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxhYihsLCBhLCBiLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gbGFiQ29udmVydChsKSA6IG5ldyBMYWIobCwgYSwgYiwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTGFiKGwsIGEsIGIsIG9wYWNpdHkpIHtcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMuYSA9ICthO1xuICB0aGlzLmIgPSArYjtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShMYWIsIGxhYiwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sICsgS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYiwgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYiwgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgeSA9ICh0aGlzLmwgKyAxNikgLyAxMTYsXG4gICAgICAgIHggPSBpc05hTih0aGlzLmEpID8geSA6IHkgKyB0aGlzLmEgLyA1MDAsXG4gICAgICAgIHogPSBpc05hTih0aGlzLmIpID8geSA6IHkgLSB0aGlzLmIgLyAyMDA7XG4gICAgeSA9IFluICogbGFiMnh5eih5KTtcbiAgICB4ID0gWG4gKiBsYWIyeHl6KHgpO1xuICAgIHogPSBabiAqIGxhYjJ4eXooeik7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICB4eXoycmdiKCAzLjI0MDQ1NDIgKiB4IC0gMS41MzcxMzg1ICogeSAtIDAuNDk4NTMxNCAqIHopLCAvLyBENjUgLT4gc1JHQlxuICAgICAgeHl6MnJnYigtMC45NjkyNjYwICogeCArIDEuODc2MDEwOCAqIHkgKyAwLjA0MTU1NjAgKiB6KSxcbiAgICAgIHh5ejJyZ2IoIDAuMDU1NjQzNCAqIHggLSAwLjIwNDAyNTkgKiB5ICsgMS4wNTcyMjUyICogeiksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9XG59KSk7XG5cbmZ1bmN0aW9uIHh5ejJsYWIodCkge1xuICByZXR1cm4gdCA+IHQzID8gTWF0aC5wb3codCwgMSAvIDMpIDogdCAvIHQyICsgdDA7XG59XG5cbmZ1bmN0aW9uIGxhYjJ4eXoodCkge1xuICByZXR1cm4gdCA+IHQxID8gdCAqIHQgKiB0IDogdDIgKiAodCAtIHQwKTtcbn1cblxuZnVuY3Rpb24geHl6MnJnYih4KSB7XG4gIHJldHVybiAyNTUgKiAoeCA8PSAwLjAwMzEzMDggPyAxMi45MiAqIHggOiAxLjA1NSAqIE1hdGgucG93KHgsIDEgLyAyLjQpIC0gMC4wNTUpO1xufVxuXG5mdW5jdGlvbiByZ2IyeHl6KHgpIHtcbiAgcmV0dXJuICh4IC89IDI1NSkgPD0gMC4wNDA0NSA/IHggLyAxMi45MiA6IE1hdGgucG93KCh4ICsgMC4wNTUpIC8gMS4wNTUsIDIuNCk7XG59XG5cbmZ1bmN0aW9uIGhjbENvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIEhjbCkgcmV0dXJuIG5ldyBIY2woby5oLCBvLmMsIG8ubCwgby5vcGFjaXR5KTtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIExhYikpIG8gPSBsYWJDb252ZXJ0KG8pO1xuICB2YXIgaCA9IE1hdGguYXRhbjIoby5iLCBvLmEpICogcmFkMmRlZztcbiAgcmV0dXJuIG5ldyBIY2woaCA8IDAgPyBoICsgMzYwIDogaCwgTWF0aC5zcXJ0KG8uYSAqIG8uYSArIG8uYiAqIG8uYiksIG8ubCwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhjbChoLCBjLCBsLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gaGNsQ29udmVydChoKSA6IG5ldyBIY2woaCwgYywgbCwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGNsKGgsIGMsIGwsIG9wYWNpdHkpIHtcbiAgdGhpcy5oID0gK2g7XG4gIHRoaXMuYyA9ICtjO1xuICB0aGlzLmwgPSArbDtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShIY2wsIGhjbCwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBIY2wodGhpcy5oLCB0aGlzLmMsIHRoaXMubCArIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBIY2wodGhpcy5oLCB0aGlzLmMsIHRoaXMubCAtIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbGFiQ29udmVydCh0aGlzKS5yZ2IoKTtcbiAgfVxufSkpO1xuIiwiaW1wb3J0IGRlZmluZSwge2V4dGVuZH0gZnJvbSBcIi4vZGVmaW5lXCI7XG5pbXBvcnQge0NvbG9yLCByZ2JDb252ZXJ0LCBSZ2IsIGRhcmtlciwgYnJpZ2h0ZXJ9IGZyb20gXCIuL2NvbG9yXCI7XG5pbXBvcnQge2RlZzJyYWQsIHJhZDJkZWd9IGZyb20gXCIuL21hdGhcIjtcblxudmFyIEEgPSAtMC4xNDg2MSxcbiAgICBCID0gKzEuNzgyNzcsXG4gICAgQyA9IC0wLjI5MjI3LFxuICAgIEQgPSAtMC45MDY0OSxcbiAgICBFID0gKzEuOTcyOTQsXG4gICAgRUQgPSBFICogRCxcbiAgICBFQiA9IEUgKiBCLFxuICAgIEJDX0RBID0gQiAqIEMgLSBEICogQTtcblxuZnVuY3Rpb24gY3ViZWhlbGl4Q29udmVydChvKSB7XG4gIGlmIChvIGluc3RhbmNlb2YgQ3ViZWhlbGl4KSByZXR1cm4gbmV3IEN1YmVoZWxpeChvLmgsIG8ucywgby5sLCBvLm9wYWNpdHkpO1xuICBpZiAoIShvIGluc3RhbmNlb2YgUmdiKSkgbyA9IHJnYkNvbnZlcnQobyk7XG4gIHZhciByID0gby5yIC8gMjU1LFxuICAgICAgZyA9IG8uZyAvIDI1NSxcbiAgICAgIGIgPSBvLmIgLyAyNTUsXG4gICAgICBsID0gKEJDX0RBICogYiArIEVEICogciAtIEVCICogZykgLyAoQkNfREEgKyBFRCAtIEVCKSxcbiAgICAgIGJsID0gYiAtIGwsXG4gICAgICBrID0gKEUgKiAoZyAtIGwpIC0gQyAqIGJsKSAvIEQsXG4gICAgICBzID0gTWF0aC5zcXJ0KGsgKiBrICsgYmwgKiBibCkgLyAoRSAqIGwgKiAoMSAtIGwpKSwgLy8gTmFOIGlmIGw9MCBvciBsPTFcbiAgICAgIGggPSBzID8gTWF0aC5hdGFuMihrLCBibCkgKiByYWQyZGVnIC0gMTIwIDogTmFOO1xuICByZXR1cm4gbmV3IEN1YmVoZWxpeChoIDwgMCA/IGggKyAzNjAgOiBoLCBzLCBsLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjdWJlaGVsaXgoaCwgcywgbCwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IGN1YmVoZWxpeENvbnZlcnQoaCkgOiBuZXcgQ3ViZWhlbGl4KGgsIHMsIGwsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEN1YmVoZWxpeChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHRoaXMuaCA9ICtoO1xuICB0aGlzLnMgPSArcztcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoQ3ViZWhlbGl4LCBjdWJlaGVsaXgsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEN1YmVoZWxpeCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSBpc05hTih0aGlzLmgpID8gMCA6ICh0aGlzLmggKyAxMjApICogZGVnMnJhZCxcbiAgICAgICAgbCA9ICt0aGlzLmwsXG4gICAgICAgIGEgPSBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyAqIGwgKiAoMSAtIGwpLFxuICAgICAgICBjb3NoID0gTWF0aC5jb3MoaCksXG4gICAgICAgIHNpbmggPSBNYXRoLnNpbihoKTtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIDI1NSAqIChsICsgYSAqIChBICogY29zaCArIEIgKiBzaW5oKSksXG4gICAgICAyNTUgKiAobCArIGEgKiAoQyAqIGNvc2ggKyBEICogc2luaCkpLFxuICAgICAgMjU1ICogKGwgKyBhICogKEUgKiBjb3NoKSksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9XG59KSk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsImltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudFwiO1xuXG5mdW5jdGlvbiBsaW5lYXIoYSwgZCkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICsgdCAqIGQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV4cG9uZW50aWFsKGEsIGIsIHkpIHtcbiAgcmV0dXJuIGEgPSBNYXRoLnBvdyhhLCB5KSwgYiA9IE1hdGgucG93KGIsIHkpIC0gYSwgeSA9IDEgLyB5LCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KGEgKyB0ICogYiwgeSk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodWUoYSwgYikge1xuICB2YXIgZCA9IGIgLSBhO1xuICByZXR1cm4gZCA/IGxpbmVhcihhLCBkID4gMTgwIHx8IGQgPCAtMTgwID8gZCAtIDM2MCAqIE1hdGgucm91bmQoZCAvIDM2MCkgOiBkKSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2FtbWEoeSkge1xuICByZXR1cm4gKHkgPSAreSkgPT09IDEgPyBub2dhbW1hIDogZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiIC0gYSA/IGV4cG9uZW50aWFsKGEsIGIsIHkpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vZ2FtbWEoYSwgYikge1xuICB2YXIgZCA9IGIgLSBhO1xuICByZXR1cm4gZCA/IGxpbmVhcihhLCBkKSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xufVxuIiwiaW1wb3J0IHtyZ2IgYXMgY29sb3JSZ2J9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IGJhc2lzIGZyb20gXCIuL2Jhc2lzXCI7XG5pbXBvcnQgYmFzaXNDbG9zZWQgZnJvbSBcIi4vYmFzaXNDbG9zZWRcIjtcbmltcG9ydCB7Z2FtbWF9IGZyb20gXCIuL2NvbG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiByZ2JHYW1tYSh5KSB7XG4gIHZhciBjb2xvciA9IGdhbW1hKHkpO1xuXG4gIGZ1bmN0aW9uIHJnYihzdGFydCwgZW5kKSB7XG4gICAgdmFyIHIgPSBjb2xvcigoc3RhcnQgPSBjb2xvclJnYihzdGFydCkpLnIsIChlbmQgPSBjb2xvclJnYihlbmQpKS5yKSxcbiAgICAgICAgZyA9IGNvbG9yKHN0YXJ0LmcsIGVuZC5nKSxcbiAgICAgICAgYiA9IGNvbG9yKHN0YXJ0LmIsIGVuZC5iKSxcbiAgICAgICAgb3BhY2l0eSA9IGNvbG9yKHN0YXJ0Lm9wYWNpdHksIGVuZC5vcGFjaXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgc3RhcnQuciA9IHIodCk7XG4gICAgICBzdGFydC5nID0gZyh0KTtcbiAgICAgIHN0YXJ0LmIgPSBiKHQpO1xuICAgICAgc3RhcnQub3BhY2l0eSA9IG9wYWNpdHkodCk7XG4gICAgICByZXR1cm4gc3RhcnQgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICByZ2IuZ2FtbWEgPSByZ2JHYW1tYTtcblxuICByZXR1cm4gcmdiO1xufSkoMSk7XG5cbmZ1bmN0aW9uIHJnYlNwbGluZShzcGxpbmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbG9ycykge1xuICAgIHZhciBuID0gY29sb3JzLmxlbmd0aCxcbiAgICAgICAgciA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgZyA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgYiA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgaSwgY29sb3I7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgY29sb3IgPSBjb2xvclJnYihjb2xvcnNbaV0pO1xuICAgICAgcltpXSA9IGNvbG9yLnIgfHwgMDtcbiAgICAgIGdbaV0gPSBjb2xvci5nIHx8IDA7XG4gICAgICBiW2ldID0gY29sb3IuYiB8fCAwO1xuICAgIH1cbiAgICByID0gc3BsaW5lKHIpO1xuICAgIGcgPSBzcGxpbmUoZyk7XG4gICAgYiA9IHNwbGluZShiKTtcbiAgICBjb2xvci5vcGFjaXR5ID0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgY29sb3IuciA9IHIodCk7XG4gICAgICBjb2xvci5nID0gZyh0KTtcbiAgICAgIGNvbG9yLmIgPSBiKHQpO1xuICAgICAgcmV0dXJuIGNvbG9yICsgXCJcIjtcbiAgICB9O1xuICB9O1xufVxuXG5leHBvcnQgdmFyIHJnYkJhc2lzID0gcmdiU3BsaW5lKGJhc2lzKTtcbmV4cG9ydCB2YXIgcmdiQmFzaXNDbG9zZWQgPSByZ2JTcGxpbmUoYmFzaXNDbG9zZWQpO1xuIiwiaW1wb3J0IHZhbHVlIGZyb20gXCIuL3ZhbHVlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIG5iID0gYiA/IGIubGVuZ3RoIDogMCxcbiAgICAgIG5hID0gYSA/IE1hdGgubWluKG5iLCBhLmxlbmd0aCkgOiAwLFxuICAgICAgeCA9IG5ldyBBcnJheShuYiksXG4gICAgICBjID0gbmV3IEFycmF5KG5iKSxcbiAgICAgIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IG5hOyArK2kpIHhbaV0gPSB2YWx1ZShhW2ldLCBiW2ldKTtcbiAgZm9yICg7IGkgPCBuYjsgKytpKSBjW2ldID0gYltpXTtcblxuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBuYTsgKytpKSBjW2ldID0geFtpXSh0KTtcbiAgICByZXR1cm4gYztcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPSArYSwgYiAtPSBhLCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGEgKyBiICogdDtcbiAgfTtcbn1cbiIsImltcG9ydCB2YWx1ZSBmcm9tIFwiLi92YWx1ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBpID0ge30sXG4gICAgICBjID0ge30sXG4gICAgICBrO1xuXG4gIGlmIChhID09PSBudWxsIHx8IHR5cGVvZiBhICE9PSBcIm9iamVjdFwiKSBhID0ge307XG4gIGlmIChiID09PSBudWxsIHx8IHR5cGVvZiBiICE9PSBcIm9iamVjdFwiKSBiID0ge307XG5cbiAgZm9yIChrIGluIGIpIHtcbiAgICBpZiAoayBpbiBhKSB7XG4gICAgICBpW2tdID0gdmFsdWUoYVtrXSwgYltrXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNba10gPSBiW2tdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgZm9yIChrIGluIGkpIGNba10gPSBpW2tdKHQpO1xuICAgIHJldHVybiBjO1xuICB9O1xufVxuIiwiaW1wb3J0IG51bWJlciBmcm9tIFwiLi9udW1iZXJcIjtcblxudmFyIHJlQSA9IC9bLStdPyg/OlxcZCtcXC4/XFxkKnxcXC4/XFxkKykoPzpbZUVdWy0rXT9cXGQrKT8vZyxcbiAgICByZUIgPSBuZXcgUmVnRXhwKHJlQS5zb3VyY2UsIFwiZ1wiKTtcblxuZnVuY3Rpb24gemVybyhiKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25lKGIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gYih0KSArIFwiXCI7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIGJpID0gcmVBLmxhc3RJbmRleCA9IHJlQi5sYXN0SW5kZXggPSAwLCAvLyBzY2FuIGluZGV4IGZvciBuZXh0IG51bWJlciBpbiBiXG4gICAgICBhbSwgLy8gY3VycmVudCBtYXRjaCBpbiBhXG4gICAgICBibSwgLy8gY3VycmVudCBtYXRjaCBpbiBiXG4gICAgICBicywgLy8gc3RyaW5nIHByZWNlZGluZyBjdXJyZW50IG51bWJlciBpbiBiLCBpZiBhbnlcbiAgICAgIGkgPSAtMSwgLy8gaW5kZXggaW4gc1xuICAgICAgcyA9IFtdLCAvLyBzdHJpbmcgY29uc3RhbnRzIGFuZCBwbGFjZWhvbGRlcnNcbiAgICAgIHEgPSBbXTsgLy8gbnVtYmVyIGludGVycG9sYXRvcnNcblxuICAvLyBDb2VyY2UgaW5wdXRzIHRvIHN0cmluZ3MuXG4gIGEgPSBhICsgXCJcIiwgYiA9IGIgKyBcIlwiO1xuXG4gIC8vIEludGVycG9sYXRlIHBhaXJzIG9mIG51bWJlcnMgaW4gYSAmIGIuXG4gIHdoaWxlICgoYW0gPSByZUEuZXhlYyhhKSlcbiAgICAgICYmIChibSA9IHJlQi5leGVjKGIpKSkge1xuICAgIGlmICgoYnMgPSBibS5pbmRleCkgPiBiaSkgeyAvLyBhIHN0cmluZyBwcmVjZWRlcyB0aGUgbmV4dCBudW1iZXIgaW4gYlxuICAgICAgYnMgPSBiLnNsaWNlKGJpLCBicyk7XG4gICAgICBpZiAoc1tpXSkgc1tpXSArPSBiczsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICAgIGVsc2Ugc1srK2ldID0gYnM7XG4gICAgfVxuICAgIGlmICgoYW0gPSBhbVswXSkgPT09IChibSA9IGJtWzBdKSkgeyAvLyBudW1iZXJzIGluIGEgJiBiIG1hdGNoXG4gICAgICBpZiAoc1tpXSkgc1tpXSArPSBibTsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICAgIGVsc2Ugc1srK2ldID0gYm07XG4gICAgfSBlbHNlIHsgLy8gaW50ZXJwb2xhdGUgbm9uLW1hdGNoaW5nIG51bWJlcnNcbiAgICAgIHNbKytpXSA9IG51bGw7XG4gICAgICBxLnB1c2goe2k6IGksIHg6IG51bWJlcihhbSwgYm0pfSk7XG4gICAgfVxuICAgIGJpID0gcmVCLmxhc3RJbmRleDtcbiAgfVxuXG4gIC8vIEFkZCByZW1haW5zIG9mIGIuXG4gIGlmIChiaSA8IGIubGVuZ3RoKSB7XG4gICAgYnMgPSBiLnNsaWNlKGJpKTtcbiAgICBpZiAoc1tpXSkgc1tpXSArPSBiczsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICBlbHNlIHNbKytpXSA9IGJzO1xuICB9XG5cbiAgLy8gU3BlY2lhbCBvcHRpbWl6YXRpb24gZm9yIG9ubHkgYSBzaW5nbGUgbWF0Y2guXG4gIC8vIE90aGVyd2lzZSwgaW50ZXJwb2xhdGUgZWFjaCBvZiB0aGUgbnVtYmVycyBhbmQgcmVqb2luIHRoZSBzdHJpbmcuXG4gIHJldHVybiBzLmxlbmd0aCA8IDIgPyAocVswXVxuICAgICAgPyBvbmUocVswXS54KVxuICAgICAgOiB6ZXJvKGIpKVxuICAgICAgOiAoYiA9IHEubGVuZ3RoLCBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG87IGkgPCBiOyArK2kpIHNbKG8gPSBxW2ldKS5pXSA9IG8ueCh0KTtcbiAgICAgICAgICByZXR1cm4gcy5qb2luKFwiXCIpO1xuICAgICAgICB9KTtcbn1cbiIsImltcG9ydCB7Y29sb3J9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IHJnYiBmcm9tIFwiLi9yZ2JcIjtcbmltcG9ydCBhcnJheSBmcm9tIFwiLi9hcnJheVwiO1xuaW1wb3J0IG51bWJlciBmcm9tIFwiLi9udW1iZXJcIjtcbmltcG9ydCBvYmplY3QgZnJvbSBcIi4vb2JqZWN0XCI7XG5pbXBvcnQgc3RyaW5nIGZyb20gXCIuL3N0cmluZ1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIHQgPSB0eXBlb2YgYiwgYztcbiAgcmV0dXJuIGIgPT0gbnVsbCB8fCB0ID09PSBcImJvb2xlYW5cIiA/IGNvbnN0YW50KGIpXG4gICAgICA6ICh0ID09PSBcIm51bWJlclwiID8gbnVtYmVyXG4gICAgICA6IHQgPT09IFwic3RyaW5nXCIgPyAoKGMgPSBjb2xvcihiKSkgPyAoYiA9IGMsIHJnYikgOiBzdHJpbmcpXG4gICAgICA6IGIgaW5zdGFuY2VvZiBjb2xvciA/IHJnYlxuICAgICAgOiBBcnJheS5pc0FycmF5KGIpID8gYXJyYXlcbiAgICAgIDogb2JqZWN0KShhLCBiKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPSArYSwgYiAtPSBhLCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoYSArIGIgKiB0KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7Y3ViZWhlbGl4IGFzIGNvbG9yQ3ViZWhlbGl4fSBmcm9tIFwiZDMtY29sb3JcIjtcbmltcG9ydCBjb2xvciwge2h1ZX0gZnJvbSBcIi4vY29sb3JcIjtcblxuZnVuY3Rpb24gY3ViZWhlbGl4KGh1ZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGN1YmVoZWxpeEdhbW1hKHkpIHtcbiAgICB5ID0gK3k7XG5cbiAgICBmdW5jdGlvbiBjdWJlaGVsaXgoc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIGggPSBodWUoKHN0YXJ0ID0gY29sb3JDdWJlaGVsaXgoc3RhcnQpKS5oLCAoZW5kID0gY29sb3JDdWJlaGVsaXgoZW5kKSkuaCksXG4gICAgICAgICAgcyA9IGNvbG9yKHN0YXJ0LnMsIGVuZC5zKSxcbiAgICAgICAgICBsID0gY29sb3Ioc3RhcnQubCwgZW5kLmwpLFxuICAgICAgICAgIG9wYWNpdHkgPSBjb2xvcihzdGFydC5vcGFjaXR5LCBlbmQub3BhY2l0eSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICBzdGFydC5oID0gaCh0KTtcbiAgICAgICAgc3RhcnQucyA9IHModCk7XG4gICAgICAgIHN0YXJ0LmwgPSBsKE1hdGgucG93KHQsIHkpKTtcbiAgICAgICAgc3RhcnQub3BhY2l0eSA9IG9wYWNpdHkodCk7XG4gICAgICAgIHJldHVybiBzdGFydCArIFwiXCI7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGN1YmVoZWxpeC5nYW1tYSA9IGN1YmVoZWxpeEdhbW1hO1xuXG4gICAgcmV0dXJuIGN1YmVoZWxpeDtcbiAgfSkoMSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGN1YmVoZWxpeChodWUpO1xuZXhwb3J0IHZhciBjdWJlaGVsaXhMb25nID0gY3ViZWhlbGl4KGNvbG9yKTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gK3g7XG59XG4iLCJpbXBvcnQge2Jpc2VjdH0gZnJvbSBcImQzLWFycmF5XCI7XG5pbXBvcnQge2ludGVycG9sYXRlIGFzIGludGVycG9sYXRlVmFsdWUsIGludGVycG9sYXRlUm91bmR9IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuaW1wb3J0IHttYXAsIHNsaWNlfSBmcm9tIFwiLi9hcnJheVwiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50XCI7XG5pbXBvcnQgbnVtYmVyIGZyb20gXCIuL251bWJlclwiO1xuXG52YXIgdW5pdCA9IFswLCAxXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRlaW50ZXJwb2xhdGVMaW5lYXIoYSwgYikge1xuICByZXR1cm4gKGIgLT0gKGEgPSArYSkpXG4gICAgICA/IGZ1bmN0aW9uKHgpIHsgcmV0dXJuICh4IC0gYSkgLyBiOyB9XG4gICAgICA6IGNvbnN0YW50KGIpO1xufVxuXG5mdW5jdGlvbiBkZWludGVycG9sYXRlQ2xhbXAoZGVpbnRlcnBvbGF0ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciBkID0gZGVpbnRlcnBvbGF0ZShhID0gK2EsIGIgPSArYik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPD0gYSA/IDAgOiB4ID49IGIgPyAxIDogZCh4KTsgfTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVpbnRlcnBvbGF0ZUNsYW1wKHJlaW50ZXJwb2xhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgciA9IHJlaW50ZXJwb2xhdGUoYSA9ICthLCBiID0gK2IpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHJldHVybiB0IDw9IDAgPyBhIDogdCA+PSAxID8gYiA6IHIodCk7IH07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJpbWFwKGRvbWFpbiwgcmFuZ2UsIGRlaW50ZXJwb2xhdGUsIHJlaW50ZXJwb2xhdGUpIHtcbiAgdmFyIGQwID0gZG9tYWluWzBdLCBkMSA9IGRvbWFpblsxXSwgcjAgPSByYW5nZVswXSwgcjEgPSByYW5nZVsxXTtcbiAgaWYgKGQxIDwgZDApIGQwID0gZGVpbnRlcnBvbGF0ZShkMSwgZDApLCByMCA9IHJlaW50ZXJwb2xhdGUocjEsIHIwKTtcbiAgZWxzZSBkMCA9IGRlaW50ZXJwb2xhdGUoZDAsIGQxKSwgcjAgPSByZWludGVycG9sYXRlKHIwLCByMSk7XG4gIHJldHVybiBmdW5jdGlvbih4KSB7IHJldHVybiByMChkMCh4KSk7IH07XG59XG5cbmZ1bmN0aW9uIHBvbHltYXAoZG9tYWluLCByYW5nZSwgZGVpbnRlcnBvbGF0ZSwgcmVpbnRlcnBvbGF0ZSkge1xuICB2YXIgaiA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlLmxlbmd0aCkgLSAxLFxuICAgICAgZCA9IG5ldyBBcnJheShqKSxcbiAgICAgIHIgPSBuZXcgQXJyYXkoaiksXG4gICAgICBpID0gLTE7XG5cbiAgLy8gUmV2ZXJzZSBkZXNjZW5kaW5nIGRvbWFpbnMuXG4gIGlmIChkb21haW5bal0gPCBkb21haW5bMF0pIHtcbiAgICBkb21haW4gPSBkb21haW4uc2xpY2UoKS5yZXZlcnNlKCk7XG4gICAgcmFuZ2UgPSByYW5nZS5zbGljZSgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIHdoaWxlICgrK2kgPCBqKSB7XG4gICAgZFtpXSA9IGRlaW50ZXJwb2xhdGUoZG9tYWluW2ldLCBkb21haW5baSArIDFdKTtcbiAgICByW2ldID0gcmVpbnRlcnBvbGF0ZShyYW5nZVtpXSwgcmFuZ2VbaSArIDFdKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgdmFyIGkgPSBiaXNlY3QoZG9tYWluLCB4LCAxLCBqKSAtIDE7XG4gICAgcmV0dXJuIHJbaV0oZFtpXSh4KSk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5KHNvdXJjZSwgdGFyZ2V0KSB7XG4gIHJldHVybiB0YXJnZXRcbiAgICAgIC5kb21haW4oc291cmNlLmRvbWFpbigpKVxuICAgICAgLnJhbmdlKHNvdXJjZS5yYW5nZSgpKVxuICAgICAgLmludGVycG9sYXRlKHNvdXJjZS5pbnRlcnBvbGF0ZSgpKVxuICAgICAgLmNsYW1wKHNvdXJjZS5jbGFtcCgpKTtcbn1cblxuLy8gZGVpbnRlcnBvbGF0ZShhLCBiKSh4KSB0YWtlcyBhIGRvbWFpbiB2YWx1ZSB4IGluIFthLGJdIGFuZCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHBhcmFtZXRlciB0IGluIFswLDFdLlxuLy8gcmVpbnRlcnBvbGF0ZShhLCBiKSh0KSB0YWtlcyBhIHBhcmFtZXRlciB0IGluIFswLDFdIGFuZCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGRvbWFpbiB2YWx1ZSB4IGluIFthLGJdLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29udGludW91cyhkZWludGVycG9sYXRlLCByZWludGVycG9sYXRlKSB7XG4gIHZhciBkb21haW4gPSB1bml0LFxuICAgICAgcmFuZ2UgPSB1bml0LFxuICAgICAgaW50ZXJwb2xhdGUgPSBpbnRlcnBvbGF0ZVZhbHVlLFxuICAgICAgY2xhbXAgPSBmYWxzZSxcbiAgICAgIHBpZWNld2lzZSxcbiAgICAgIG91dHB1dCxcbiAgICAgIGlucHV0O1xuXG4gIGZ1bmN0aW9uIHJlc2NhbGUoKSB7XG4gICAgcGllY2V3aXNlID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UubGVuZ3RoKSA+IDIgPyBwb2x5bWFwIDogYmltYXA7XG4gICAgb3V0cHV0ID0gaW5wdXQgPSBudWxsO1xuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICByZXR1cm4gKG91dHB1dCB8fCAob3V0cHV0ID0gcGllY2V3aXNlKGRvbWFpbiwgcmFuZ2UsIGNsYW1wID8gZGVpbnRlcnBvbGF0ZUNsYW1wKGRlaW50ZXJwb2xhdGUpIDogZGVpbnRlcnBvbGF0ZSwgaW50ZXJwb2xhdGUpKSkoK3gpO1xuICB9XG5cbiAgc2NhbGUuaW52ZXJ0ID0gZnVuY3Rpb24oeSkge1xuICAgIHJldHVybiAoaW5wdXQgfHwgKGlucHV0ID0gcGllY2V3aXNlKHJhbmdlLCBkb21haW4sIGRlaW50ZXJwb2xhdGVMaW5lYXIsIGNsYW1wID8gcmVpbnRlcnBvbGF0ZUNsYW1wKHJlaW50ZXJwb2xhdGUpIDogcmVpbnRlcnBvbGF0ZSkpKSgreSk7XG4gIH07XG5cbiAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRvbWFpbiA9IG1hcC5jYWxsKF8sIG51bWJlciksIHJlc2NhbGUoKSkgOiBkb21haW4uc2xpY2UoKTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5nZSA9IHNsaWNlLmNhbGwoXyksIHJlc2NhbGUoKSkgOiByYW5nZS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnJhbmdlUm91bmQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIHJhbmdlID0gc2xpY2UuY2FsbChfKSwgaW50ZXJwb2xhdGUgPSBpbnRlcnBvbGF0ZVJvdW5kLCByZXNjYWxlKCk7XG4gIH07XG5cbiAgc2NhbGUuY2xhbXAgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xhbXAgPSAhIV8sIHJlc2NhbGUoKSkgOiBjbGFtcDtcbiAgfTtcblxuICBzY2FsZS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpbnRlcnBvbGF0ZSA9IF8sIHJlc2NhbGUoKSkgOiBpbnRlcnBvbGF0ZTtcbiAgfTtcblxuICByZXR1cm4gcmVzY2FsZSgpO1xufVxuIiwiLy8gQ29tcHV0ZXMgdGhlIGRlY2ltYWwgY29lZmZpY2llbnQgYW5kIGV4cG9uZW50IG9mIHRoZSBzcGVjaWZpZWQgbnVtYmVyIHggd2l0aFxuLy8gc2lnbmlmaWNhbnQgZGlnaXRzIHAsIHdoZXJlIHggaXMgcG9zaXRpdmUgYW5kIHAgaXMgaW4gWzEsIDIxXSBvciB1bmRlZmluZWQuXG4vLyBGb3IgZXhhbXBsZSwgZm9ybWF0RGVjaW1hbCgxLjIzKSByZXR1cm5zIFtcIjEyM1wiLCAwXS5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgsIHApIHtcbiAgaWYgKChpID0gKHggPSBwID8geC50b0V4cG9uZW50aWFsKHAgLSAxKSA6IHgudG9FeHBvbmVudGlhbCgpKS5pbmRleE9mKFwiZVwiKSkgPCAwKSByZXR1cm4gbnVsbDsgLy8gTmFOLCDCsUluZmluaXR5XG4gIHZhciBpLCBjb2VmZmljaWVudCA9IHguc2xpY2UoMCwgaSk7XG5cbiAgLy8gVGhlIHN0cmluZyByZXR1cm5lZCBieSB0b0V4cG9uZW50aWFsIGVpdGhlciBoYXMgdGhlIGZvcm0gXFxkXFwuXFxkK2VbLStdXFxkK1xuICAvLyAoZS5nLiwgMS4yZSszKSBvciB0aGUgZm9ybSBcXGRlWy0rXVxcZCsgKGUuZy4sIDFlKzMpLlxuICByZXR1cm4gW1xuICAgIGNvZWZmaWNpZW50Lmxlbmd0aCA+IDEgPyBjb2VmZmljaWVudFswXSArIGNvZWZmaWNpZW50LnNsaWNlKDIpIDogY29lZmZpY2llbnQsXG4gICAgK3guc2xpY2UoaSArIDEpXG4gIF07XG59XG4iLCJpbXBvcnQgZm9ybWF0RGVjaW1hbCBmcm9tIFwiLi9mb3JtYXREZWNpbWFsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHggPSBmb3JtYXREZWNpbWFsKE1hdGguYWJzKHgpKSwgeCA/IHhbMV0gOiBOYU47XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihncm91cGluZywgdGhvdXNhbmRzKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSwgd2lkdGgpIHtcbiAgICB2YXIgaSA9IHZhbHVlLmxlbmd0aCxcbiAgICAgICAgdCA9IFtdLFxuICAgICAgICBqID0gMCxcbiAgICAgICAgZyA9IGdyb3VwaW5nWzBdLFxuICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgd2hpbGUgKGkgPiAwICYmIGcgPiAwKSB7XG4gICAgICBpZiAobGVuZ3RoICsgZyArIDEgPiB3aWR0aCkgZyA9IE1hdGgubWF4KDEsIHdpZHRoIC0gbGVuZ3RoKTtcbiAgICAgIHQucHVzaCh2YWx1ZS5zdWJzdHJpbmcoaSAtPSBnLCBpICsgZykpO1xuICAgICAgaWYgKChsZW5ndGggKz0gZyArIDEpID4gd2lkdGgpIGJyZWFrO1xuICAgICAgZyA9IGdyb3VwaW5nW2ogPSAoaiArIDEpICUgZ3JvdXBpbmcubGVuZ3RoXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdC5yZXZlcnNlKCkuam9pbih0aG91c2FuZHMpO1xuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCwgcCkge1xuICB4ID0geC50b1ByZWNpc2lvbihwKTtcblxuICBvdXQ6IGZvciAodmFyIG4gPSB4Lmxlbmd0aCwgaSA9IDEsIGkwID0gLTEsIGkxOyBpIDwgbjsgKytpKSB7XG4gICAgc3dpdGNoICh4W2ldKSB7XG4gICAgICBjYXNlIFwiLlwiOiBpMCA9IGkxID0gaTsgYnJlYWs7XG4gICAgICBjYXNlIFwiMFwiOiBpZiAoaTAgPT09IDApIGkwID0gaTsgaTEgPSBpOyBicmVhaztcbiAgICAgIGNhc2UgXCJlXCI6IGJyZWFrIG91dDtcbiAgICAgIGRlZmF1bHQ6IGlmIChpMCA+IDApIGkwID0gMDsgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGkwID4gMCA/IHguc2xpY2UoMCwgaTApICsgeC5zbGljZShpMSArIDEpIDogeDtcbn1cbiIsImltcG9ydCBmb3JtYXREZWNpbWFsIGZyb20gXCIuL2Zvcm1hdERlY2ltYWxcIjtcblxuZXhwb3J0IHZhciBwcmVmaXhFeHBvbmVudDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCwgcCkge1xuICB2YXIgZCA9IGZvcm1hdERlY2ltYWwoeCwgcCk7XG4gIGlmICghZCkgcmV0dXJuIHggKyBcIlwiO1xuICB2YXIgY29lZmZpY2llbnQgPSBkWzBdLFxuICAgICAgZXhwb25lbnQgPSBkWzFdLFxuICAgICAgaSA9IGV4cG9uZW50IC0gKHByZWZpeEV4cG9uZW50ID0gTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQgLyAzKSkpICogMykgKyAxLFxuICAgICAgbiA9IGNvZWZmaWNpZW50Lmxlbmd0aDtcbiAgcmV0dXJuIGkgPT09IG4gPyBjb2VmZmljaWVudFxuICAgICAgOiBpID4gbiA/IGNvZWZmaWNpZW50ICsgbmV3IEFycmF5KGkgLSBuICsgMSkuam9pbihcIjBcIilcbiAgICAgIDogaSA+IDAgPyBjb2VmZmljaWVudC5zbGljZSgwLCBpKSArIFwiLlwiICsgY29lZmZpY2llbnQuc2xpY2UoaSlcbiAgICAgIDogXCIwLlwiICsgbmV3IEFycmF5KDEgLSBpKS5qb2luKFwiMFwiKSArIGZvcm1hdERlY2ltYWwoeCwgTWF0aC5tYXgoMCwgcCArIGkgLSAxKSlbMF07IC8vIGxlc3MgdGhhbiAxeSFcbn1cbiIsImltcG9ydCBmb3JtYXREZWNpbWFsIGZyb20gXCIuL2Zvcm1hdERlY2ltYWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCwgcCkge1xuICB2YXIgZCA9IGZvcm1hdERlY2ltYWwoeCwgcCk7XG4gIGlmICghZCkgcmV0dXJuIHggKyBcIlwiO1xuICB2YXIgY29lZmZpY2llbnQgPSBkWzBdLFxuICAgICAgZXhwb25lbnQgPSBkWzFdO1xuICByZXR1cm4gZXhwb25lbnQgPCAwID8gXCIwLlwiICsgbmV3IEFycmF5KC1leHBvbmVudCkuam9pbihcIjBcIikgKyBjb2VmZmljaWVudFxuICAgICAgOiBjb2VmZmljaWVudC5sZW5ndGggPiBleHBvbmVudCArIDEgPyBjb2VmZmljaWVudC5zbGljZSgwLCBleHBvbmVudCArIDEpICsgXCIuXCIgKyBjb2VmZmljaWVudC5zbGljZShleHBvbmVudCArIDEpXG4gICAgICA6IGNvZWZmaWNpZW50ICsgbmV3IEFycmF5KGV4cG9uZW50IC0gY29lZmZpY2llbnQubGVuZ3RoICsgMikuam9pbihcIjBcIik7XG59XG4iLCJpbXBvcnQgZm9ybWF0RGVmYXVsdCBmcm9tIFwiLi9mb3JtYXREZWZhdWx0XCI7XG5pbXBvcnQgZm9ybWF0UHJlZml4QXV0byBmcm9tIFwiLi9mb3JtYXRQcmVmaXhBdXRvXCI7XG5pbXBvcnQgZm9ybWF0Um91bmRlZCBmcm9tIFwiLi9mb3JtYXRSb3VuZGVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgXCJcIjogZm9ybWF0RGVmYXVsdCxcbiAgXCIlXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuICh4ICogMTAwKS50b0ZpeGVkKHApOyB9LFxuICBcImJcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygyKTsgfSxcbiAgXCJjXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyBcIlwiOyB9LFxuICBcImRcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxMCk7IH0sXG4gIFwiZVwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRXhwb25lbnRpYWwocCk7IH0sXG4gIFwiZlwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRml4ZWQocCk7IH0sXG4gIFwiZ1wiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvUHJlY2lzaW9uKHApOyB9LFxuICBcIm9cIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZyg4KTsgfSxcbiAgXCJwXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIGZvcm1hdFJvdW5kZWQoeCAqIDEwMCwgcCk7IH0sXG4gIFwiclwiOiBmb3JtYXRSb3VuZGVkLFxuICBcInNcIjogZm9ybWF0UHJlZml4QXV0byxcbiAgXCJYXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IH0sXG4gIFwieFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDE2KTsgfVxufTtcbiIsImltcG9ydCBmb3JtYXRUeXBlcyBmcm9tIFwiLi9mb3JtYXRUeXBlc1wiO1xuXG4vLyBbW2ZpbGxdYWxpZ25dW3NpZ25dW3N5bWJvbF1bMF1bd2lkdGhdWyxdWy5wcmVjaXNpb25dW3R5cGVdXG52YXIgcmUgPSAvXig/OiguKT8oWzw+PV5dKSk/KFsrXFwtXFwoIF0pPyhbJCNdKT8oMCk/KFxcZCspPygsKT8oXFwuXFxkKyk/KFthLXolXSk/JC9pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgcmV0dXJuIG5ldyBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcbn1cblxuZnVuY3Rpb24gRm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICBpZiAoIShtYXRjaCA9IHJlLmV4ZWMoc3BlY2lmaWVyKSkpIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgZm9ybWF0OiBcIiArIHNwZWNpZmllcik7XG5cbiAgdmFyIG1hdGNoLFxuICAgICAgZmlsbCA9IG1hdGNoWzFdIHx8IFwiIFwiLFxuICAgICAgYWxpZ24gPSBtYXRjaFsyXSB8fCBcIj5cIixcbiAgICAgIHNpZ24gPSBtYXRjaFszXSB8fCBcIi1cIixcbiAgICAgIHN5bWJvbCA9IG1hdGNoWzRdIHx8IFwiXCIsXG4gICAgICB6ZXJvID0gISFtYXRjaFs1XSxcbiAgICAgIHdpZHRoID0gbWF0Y2hbNl0gJiYgK21hdGNoWzZdLFxuICAgICAgY29tbWEgPSAhIW1hdGNoWzddLFxuICAgICAgcHJlY2lzaW9uID0gbWF0Y2hbOF0gJiYgK21hdGNoWzhdLnNsaWNlKDEpLFxuICAgICAgdHlwZSA9IG1hdGNoWzldIHx8IFwiXCI7XG5cbiAgLy8gVGhlIFwiblwiIHR5cGUgaXMgYW4gYWxpYXMgZm9yIFwiLGdcIi5cbiAgaWYgKHR5cGUgPT09IFwiblwiKSBjb21tYSA9IHRydWUsIHR5cGUgPSBcImdcIjtcblxuICAvLyBNYXAgaW52YWxpZCB0eXBlcyB0byB0aGUgZGVmYXVsdCBmb3JtYXQuXG4gIGVsc2UgaWYgKCFmb3JtYXRUeXBlc1t0eXBlXSkgdHlwZSA9IFwiXCI7XG5cbiAgLy8gSWYgemVybyBmaWxsIGlzIHNwZWNpZmllZCwgcGFkZGluZyBnb2VzIGFmdGVyIHNpZ24gYW5kIGJlZm9yZSBkaWdpdHMuXG4gIGlmICh6ZXJvIHx8IChmaWxsID09PSBcIjBcIiAmJiBhbGlnbiA9PT0gXCI9XCIpKSB6ZXJvID0gdHJ1ZSwgZmlsbCA9IFwiMFwiLCBhbGlnbiA9IFwiPVwiO1xuXG4gIHRoaXMuZmlsbCA9IGZpbGw7XG4gIHRoaXMuYWxpZ24gPSBhbGlnbjtcbiAgdGhpcy5zaWduID0gc2lnbjtcbiAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gIHRoaXMuemVybyA9IHplcm87XG4gIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgdGhpcy5jb21tYSA9IGNvbW1hO1xuICB0aGlzLnByZWNpc2lvbiA9IHByZWNpc2lvbjtcbiAgdGhpcy50eXBlID0gdHlwZTtcbn1cblxuRm9ybWF0U3BlY2lmaWVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5maWxsXG4gICAgICArIHRoaXMuYWxpZ25cbiAgICAgICsgdGhpcy5zaWduXG4gICAgICArIHRoaXMuc3ltYm9sXG4gICAgICArICh0aGlzLnplcm8gPyBcIjBcIiA6IFwiXCIpXG4gICAgICArICh0aGlzLndpZHRoID09IG51bGwgPyBcIlwiIDogTWF0aC5tYXgoMSwgdGhpcy53aWR0aCB8IDApKVxuICAgICAgKyAodGhpcy5jb21tYSA/IFwiLFwiIDogXCJcIilcbiAgICAgICsgKHRoaXMucHJlY2lzaW9uID09IG51bGwgPyBcIlwiIDogXCIuXCIgKyBNYXRoLm1heCgwLCB0aGlzLnByZWNpc2lvbiB8IDApKVxuICAgICAgKyB0aGlzLnR5cGU7XG59O1xuIiwiaW1wb3J0IGV4cG9uZW50IGZyb20gXCIuL2V4cG9uZW50XCI7XG5pbXBvcnQgZm9ybWF0R3JvdXAgZnJvbSBcIi4vZm9ybWF0R3JvdXBcIjtcbmltcG9ydCBmb3JtYXRTcGVjaWZpZXIgZnJvbSBcIi4vZm9ybWF0U3BlY2lmaWVyXCI7XG5pbXBvcnQgZm9ybWF0VHlwZXMgZnJvbSBcIi4vZm9ybWF0VHlwZXNcIjtcbmltcG9ydCB7cHJlZml4RXhwb25lbnR9IGZyb20gXCIuL2Zvcm1hdFByZWZpeEF1dG9cIjtcblxudmFyIHByZWZpeGVzID0gW1wieVwiLFwielwiLFwiYVwiLFwiZlwiLFwicFwiLFwiblwiLFwiwrVcIixcIm1cIixcIlwiLFwia1wiLFwiTVwiLFwiR1wiLFwiVFwiLFwiUFwiLFwiRVwiLFwiWlwiLFwiWVwiXTtcblxuZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICByZXR1cm4geDtcbn1cblxudmFyIGRlZmF1bHRMb2NhbGUgPSBmb3JtYXRMb2NhbGUoe1xuICBkZWNpbWFsOiBcIi5cIixcbiAgdGhvdXNhbmRzOiBcIixcIixcbiAgZ3JvdXBpbmc6IFszXSxcbiAgY3VycmVuY3k6IFtcIiRcIiwgXCJcIl1cbn0pO1xuXG5leHBvcnQgdmFyIGZvcm1hdCA9IGRlZmF1bHRMb2NhbGUuZm9ybWF0O1xuZXhwb3J0IHZhciBmb3JtYXRQcmVmaXggPSBkZWZhdWx0TG9jYWxlLmZvcm1hdFByZWZpeDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybWF0TG9jYWxlKGxvY2FsZSkge1xuICB2YXIgZ3JvdXAgPSBsb2NhbGUuZ3JvdXBpbmcgJiYgbG9jYWxlLnRob3VzYW5kcyA/IGZvcm1hdEdyb3VwKGxvY2FsZS5ncm91cGluZywgbG9jYWxlLnRob3VzYW5kcykgOiBpZGVudGl0eSxcbiAgICAgIGN1cnJlbmN5ID0gbG9jYWxlLmN1cnJlbmN5LFxuICAgICAgZGVjaW1hbCA9IGxvY2FsZS5kZWNpbWFsO1xuXG4gIGZ1bmN0aW9uIG5ld0Zvcm1hdChzcGVjaWZpZXIpIHtcbiAgICBzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcblxuICAgIHZhciBmaWxsID0gc3BlY2lmaWVyLmZpbGwsXG4gICAgICAgIGFsaWduID0gc3BlY2lmaWVyLmFsaWduLFxuICAgICAgICBzaWduID0gc3BlY2lmaWVyLnNpZ24sXG4gICAgICAgIHN5bWJvbCA9IHNwZWNpZmllci5zeW1ib2wsXG4gICAgICAgIHplcm8gPSBzcGVjaWZpZXIuemVybyxcbiAgICAgICAgd2lkdGggPSBzcGVjaWZpZXIud2lkdGgsXG4gICAgICAgIGNvbW1hID0gc3BlY2lmaWVyLmNvbW1hLFxuICAgICAgICBwcmVjaXNpb24gPSBzcGVjaWZpZXIucHJlY2lzaW9uLFxuICAgICAgICB0eXBlID0gc3BlY2lmaWVyLnR5cGU7XG5cbiAgICAvLyBDb21wdXRlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgICAvLyBGb3IgU0ktcHJlZml4LCB0aGUgc3VmZml4IGlzIGxhemlseSBjb21wdXRlZC5cbiAgICB2YXIgcHJlZml4ID0gc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5WzBdIDogc3ltYm9sID09PSBcIiNcIiAmJiAvW2JveFhdLy50ZXN0KHR5cGUpID8gXCIwXCIgKyB0eXBlLnRvTG93ZXJDYXNlKCkgOiBcIlwiLFxuICAgICAgICBzdWZmaXggPSBzeW1ib2wgPT09IFwiJFwiID8gY3VycmVuY3lbMV0gOiAvWyVwXS8udGVzdCh0eXBlKSA/IFwiJVwiIDogXCJcIjtcblxuICAgIC8vIFdoYXQgZm9ybWF0IGZ1bmN0aW9uIHNob3VsZCB3ZSB1c2U/XG4gICAgLy8gSXMgdGhpcyBhbiBpbnRlZ2VyIHR5cGU/XG4gICAgLy8gQ2FuIHRoaXMgdHlwZSBnZW5lcmF0ZSBleHBvbmVudGlhbCBub3RhdGlvbj9cbiAgICB2YXIgZm9ybWF0VHlwZSA9IGZvcm1hdFR5cGVzW3R5cGVdLFxuICAgICAgICBtYXliZVN1ZmZpeCA9ICF0eXBlIHx8IC9bZGVmZ3BycyVdLy50ZXN0KHR5cGUpO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHByZWNpc2lvbiBpZiBub3Qgc3BlY2lmaWVkLFxuICAgIC8vIG9yIGNsYW1wIHRoZSBzcGVjaWZpZWQgcHJlY2lzaW9uIHRvIHRoZSBzdXBwb3J0ZWQgcmFuZ2UuXG4gICAgLy8gRm9yIHNpZ25pZmljYW50IHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMSwgMjFdLlxuICAgIC8vIEZvciBmaXhlZCBwcmVjaXNpb24sIGl0IG11c3QgYmUgaW4gWzAsIDIwXS5cbiAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24gPT0gbnVsbCA/ICh0eXBlID8gNiA6IDEyKVxuICAgICAgICA6IC9bZ3Byc10vLnRlc3QodHlwZSkgPyBNYXRoLm1heCgxLCBNYXRoLm1pbigyMSwgcHJlY2lzaW9uKSlcbiAgICAgICAgOiBNYXRoLm1heCgwLCBNYXRoLm1pbigyMCwgcHJlY2lzaW9uKSk7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQodmFsdWUpIHtcbiAgICAgIHZhciB2YWx1ZVByZWZpeCA9IHByZWZpeCxcbiAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IHN1ZmZpeCxcbiAgICAgICAgICBpLCBuLCBjO1xuXG4gICAgICBpZiAodHlwZSA9PT0gXCJjXCIpIHtcbiAgICAgICAgdmFsdWVTdWZmaXggPSBmb3JtYXRUeXBlKHZhbHVlKSArIHZhbHVlU3VmZml4O1xuICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcblxuICAgICAgICAvLyBDb252ZXJ0IG5lZ2F0aXZlIHRvIHBvc2l0aXZlLCBhbmQgY29tcHV0ZSB0aGUgcHJlZml4LlxuICAgICAgICAvLyBOb3RlIHRoYXQgLTAgaXMgbm90IGxlc3MgdGhhbiAwLCBidXQgMSAvIC0wIGlzIVxuICAgICAgICB2YXIgdmFsdWVOZWdhdGl2ZSA9ICh2YWx1ZSA8IDAgfHwgMSAvIHZhbHVlIDwgMCkgJiYgKHZhbHVlICo9IC0xLCB0cnVlKTtcblxuICAgICAgICAvLyBQZXJmb3JtIHRoZSBpbml0aWFsIGZvcm1hdHRpbmcuXG4gICAgICAgIHZhbHVlID0gZm9ybWF0VHlwZSh2YWx1ZSwgcHJlY2lzaW9uKTtcblxuICAgICAgICAvLyBJZiB0aGUgb3JpZ2luYWwgdmFsdWUgd2FzIG5lZ2F0aXZlLCBpdCBtYXkgYmUgcm91bmRlZCB0byB6ZXJvIGR1cmluZ1xuICAgICAgICAvLyBmb3JtYXR0aW5nOyB0cmVhdCB0aGlzIGFzIChwb3NpdGl2ZSkgemVyby5cbiAgICAgICAgaWYgKHZhbHVlTmVnYXRpdmUpIHtcbiAgICAgICAgICBpID0gLTEsIG4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgdmFsdWVOZWdhdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAoYyA9IHZhbHVlLmNoYXJDb2RlQXQoaSksICg0OCA8IGMgJiYgYyA8IDU4KVxuICAgICAgICAgICAgICAgIHx8ICh0eXBlID09PSBcInhcIiAmJiA5NiA8IGMgJiYgYyA8IDEwMylcbiAgICAgICAgICAgICAgICB8fCAodHlwZSA9PT0gXCJYXCIgJiYgNjQgPCBjICYmIGMgPCA3MSkpIHtcbiAgICAgICAgICAgICAgdmFsdWVOZWdhdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbXB1dGUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICAgICAgICB2YWx1ZVByZWZpeCA9ICh2YWx1ZU5lZ2F0aXZlID8gKHNpZ24gPT09IFwiKFwiID8gc2lnbiA6IFwiLVwiKSA6IHNpZ24gPT09IFwiLVwiIHx8IHNpZ24gPT09IFwiKFwiID8gXCJcIiA6IHNpZ24pICsgdmFsdWVQcmVmaXg7XG4gICAgICAgIHZhbHVlU3VmZml4ID0gdmFsdWVTdWZmaXggKyAodHlwZSA9PT0gXCJzXCIgPyBwcmVmaXhlc1s4ICsgcHJlZml4RXhwb25lbnQgLyAzXSA6IFwiXCIpICsgKHZhbHVlTmVnYXRpdmUgJiYgc2lnbiA9PT0gXCIoXCIgPyBcIilcIiA6IFwiXCIpO1xuXG4gICAgICAgIC8vIEJyZWFrIHRoZSBmb3JtYXR0ZWQgdmFsdWUgaW50byB0aGUgaW50ZWdlciDigJx2YWx1ZeKAnSBwYXJ0IHRoYXQgY2FuIGJlXG4gICAgICAgIC8vIGdyb3VwZWQsIGFuZCBmcmFjdGlvbmFsIG9yIGV4cG9uZW50aWFsIOKAnHN1ZmZpeOKAnSBwYXJ0IHRoYXQgaXMgbm90LlxuICAgICAgICBpZiAobWF5YmVTdWZmaXgpIHtcbiAgICAgICAgICBpID0gLTEsIG4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChjID0gdmFsdWUuY2hhckNvZGVBdChpKSwgNDggPiBjIHx8IGMgPiA1Nykge1xuICAgICAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IChjID09PSA0NiA/IGRlY2ltYWwgKyB2YWx1ZS5zbGljZShpICsgMSkgOiB2YWx1ZS5zbGljZShpKSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBub3QgXCIwXCIsIGdyb3VwaW5nIGlzIGFwcGxpZWQgYmVmb3JlIHBhZGRpbmcuXG4gICAgICBpZiAoY29tbWEgJiYgIXplcm8pIHZhbHVlID0gZ3JvdXAodmFsdWUsIEluZmluaXR5KTtcblxuICAgICAgLy8gQ29tcHV0ZSB0aGUgcGFkZGluZy5cbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZVByZWZpeC5sZW5ndGggKyB2YWx1ZS5sZW5ndGggKyB2YWx1ZVN1ZmZpeC5sZW5ndGgsXG4gICAgICAgICAgcGFkZGluZyA9IGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSA6IFwiXCI7XG5cbiAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBhZnRlciBwYWRkaW5nLlxuICAgICAgaWYgKGNvbW1hICYmIHplcm8pIHZhbHVlID0gZ3JvdXAocGFkZGluZyArIHZhbHVlLCBwYWRkaW5nLmxlbmd0aCA/IHdpZHRoIC0gdmFsdWVTdWZmaXgubGVuZ3RoIDogSW5maW5pdHkpLCBwYWRkaW5nID0gXCJcIjtcblxuICAgICAgLy8gUmVjb25zdHJ1Y3QgdGhlIGZpbmFsIG91dHB1dCBiYXNlZCBvbiB0aGUgZGVzaXJlZCBhbGlnbm1lbnQuXG4gICAgICBzd2l0Y2ggKGFsaWduKSB7XG4gICAgICAgIGNhc2UgXCI8XCI6IHJldHVybiB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nO1xuICAgICAgICBjYXNlIFwiPVwiOiByZXR1cm4gdmFsdWVQcmVmaXggKyBwYWRkaW5nICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgY2FzZSBcIl5cIjogcmV0dXJuIHBhZGRpbmcuc2xpY2UoMCwgbGVuZ3RoID0gcGFkZGluZy5sZW5ndGggPj4gMSkgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nLnNsaWNlKGxlbmd0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFkZGluZyArIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeDtcbiAgICB9XG5cbiAgICBmb3JtYXQudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzcGVjaWZpZXIgKyBcIlwiO1xuICAgIH07XG5cbiAgICByZXR1cm4gZm9ybWF0O1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UHJlZml4KHNwZWNpZmllciwgdmFsdWUpIHtcbiAgICB2YXIgZiA9IG5ld0Zvcm1hdCgoc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciksIHNwZWNpZmllci50eXBlID0gXCJmXCIsIHNwZWNpZmllcikpLFxuICAgICAgICBlID0gTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQodmFsdWUpIC8gMykpKSAqIDMsXG4gICAgICAgIGsgPSBNYXRoLnBvdygxMCwgLWUpLFxuICAgICAgICBwcmVmaXggPSBwcmVmaXhlc1s4ICsgZSAvIDNdO1xuICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGYoayAqIHZhbHVlKSArIHByZWZpeDtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmb3JtYXQ6IG5ld0Zvcm1hdCxcbiAgICBmb3JtYXRQcmVmaXg6IGZvcm1hdFByZWZpeFxuICB9O1xufVxuIiwiaW1wb3J0IGV4cG9uZW50IGZyb20gXCIuL2V4cG9uZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0ZXApIHtcbiAgcmV0dXJuIE1hdGgubWF4KDAsIC1leHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xufVxuIiwiaW1wb3J0IGV4cG9uZW50IGZyb20gXCIuL2V4cG9uZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0ZXAsIHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyAtIGV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG59XG4iLCJpbXBvcnQgZXhwb25lbnQgZnJvbSBcIi4vZXhwb25lbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3RlcCwgbWF4KSB7XG4gIHN0ZXAgPSBNYXRoLmFicyhzdGVwKSwgbWF4ID0gTWF0aC5hYnMobWF4KSAtIHN0ZXA7XG4gIHJldHVybiBNYXRoLm1heCgwLCBleHBvbmVudChtYXgpIC0gZXhwb25lbnQoc3RlcCkpICsgMTtcbn1cbiIsImltcG9ydCB7dGlja1N0ZXB9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtmb3JtYXQsIGZvcm1hdFByZWZpeCwgZm9ybWF0U3BlY2lmaWVyLCBwcmVjaXNpb25GaXhlZCwgcHJlY2lzaW9uUHJlZml4LCBwcmVjaXNpb25Sb3VuZH0gZnJvbSBcImQzLWZvcm1hdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkb21haW4sIGNvdW50LCBzcGVjaWZpZXIpIHtcbiAgdmFyIHN0YXJ0ID0gZG9tYWluWzBdLFxuICAgICAgc3RvcCA9IGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sXG4gICAgICBzdGVwID0gdGlja1N0ZXAoc3RhcnQsIHN0b3AsIGNvdW50ID09IG51bGwgPyAxMCA6IGNvdW50KSxcbiAgICAgIHByZWNpc2lvbjtcbiAgc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciA9PSBudWxsID8gXCIsZlwiIDogc3BlY2lmaWVyKTtcbiAgc3dpdGNoIChzcGVjaWZpZXIudHlwZSkge1xuICAgIGNhc2UgXCJzXCI6IHtcbiAgICAgIHZhciB2YWx1ZSA9IE1hdGgubWF4KE1hdGguYWJzKHN0YXJ0KSwgTWF0aC5hYnMoc3RvcCkpO1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gcHJlY2lzaW9uUHJlZml4KHN0ZXAsIHZhbHVlKSkpIHNwZWNpZmllci5wcmVjaXNpb24gPSBwcmVjaXNpb247XG4gICAgICByZXR1cm4gZm9ybWF0UHJlZml4KHNwZWNpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgICBjYXNlIFwiXCI6XG4gICAgY2FzZSBcImVcIjpcbiAgICBjYXNlIFwiZ1wiOlxuICAgIGNhc2UgXCJwXCI6XG4gICAgY2FzZSBcInJcIjoge1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gcHJlY2lzaW9uUm91bmQoc3RlcCwgTWF0aC5tYXgoTWF0aC5hYnMoc3RhcnQpLCBNYXRoLmFicyhzdG9wKSkpKSkgc3BlY2lmaWVyLnByZWNpc2lvbiA9IHByZWNpc2lvbiAtIChzcGVjaWZpZXIudHlwZSA9PT0gXCJlXCIpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJmXCI6XG4gICAgY2FzZSBcIiVcIjoge1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gcHJlY2lzaW9uRml4ZWQoc3RlcCkpKSBzcGVjaWZpZXIucHJlY2lzaW9uID0gcHJlY2lzaW9uIC0gKHNwZWNpZmllci50eXBlID09PSBcIiVcIikgKiAyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtYXQoc3BlY2lmaWVyKTtcbn1cbiIsImltcG9ydCB7dGlja3MsIHRpY2tTdGVwfSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCB7aW50ZXJwb2xhdGVOdW1iZXIgYXMgcmVpbnRlcnBvbGF0ZX0gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5pbXBvcnQge2RlZmF1bHQgYXMgY29udGludW91cywgY29weSwgZGVpbnRlcnBvbGF0ZUxpbmVhciBhcyBkZWludGVycG9sYXRlfSBmcm9tIFwiLi9jb250aW51b3VzXCI7XG5pbXBvcnQgdGlja0Zvcm1hdCBmcm9tIFwiLi90aWNrRm9ybWF0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBsaW5lYXJpc2goc2NhbGUpIHtcbiAgdmFyIGRvbWFpbiA9IHNjYWxlLmRvbWFpbjtcblxuICBzY2FsZS50aWNrcyA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgdmFyIGQgPSBkb21haW4oKTtcbiAgICByZXR1cm4gdGlja3MoZFswXSwgZFtkLmxlbmd0aCAtIDFdLCBjb3VudCA9PSBudWxsID8gMTAgOiBjb3VudCk7XG4gIH07XG5cbiAgc2NhbGUudGlja0Zvcm1hdCA9IGZ1bmN0aW9uKGNvdW50LCBzcGVjaWZpZXIpIHtcbiAgICByZXR1cm4gdGlja0Zvcm1hdChkb21haW4oKSwgY291bnQsIHNwZWNpZmllcik7XG4gIH07XG5cbiAgc2NhbGUubmljZSA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgdmFyIGQgPSBkb21haW4oKSxcbiAgICAgICAgaSA9IGQubGVuZ3RoIC0gMSxcbiAgICAgICAgbiA9IGNvdW50ID09IG51bGwgPyAxMCA6IGNvdW50LFxuICAgICAgICBzdGFydCA9IGRbMF0sXG4gICAgICAgIHN0b3AgPSBkW2ldLFxuICAgICAgICBzdGVwID0gdGlja1N0ZXAoc3RhcnQsIHN0b3AsIG4pO1xuXG4gICAgaWYgKHN0ZXApIHtcbiAgICAgIHN0ZXAgPSB0aWNrU3RlcChNYXRoLmZsb29yKHN0YXJ0IC8gc3RlcCkgKiBzdGVwLCBNYXRoLmNlaWwoc3RvcCAvIHN0ZXApICogc3RlcCwgbik7XG4gICAgICBkWzBdID0gTWF0aC5mbG9vcihzdGFydCAvIHN0ZXApICogc3RlcDtcbiAgICAgIGRbaV0gPSBNYXRoLmNlaWwoc3RvcCAvIHN0ZXApICogc3RlcDtcbiAgICAgIGRvbWFpbihkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NhbGU7XG4gIH07XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsaW5lYXIoKSB7XG4gIHZhciBzY2FsZSA9IGNvbnRpbnVvdXMoZGVpbnRlcnBvbGF0ZSwgcmVpbnRlcnBvbGF0ZSk7XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjb3B5KHNjYWxlLCBsaW5lYXIoKSk7XG4gIH07XG5cbiAgcmV0dXJuIGxpbmVhcmlzaChzY2FsZSk7XG59XG4iLCJpbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnRcIjtcbmltcG9ydCB7bGluZWFyaXNofSBmcm9tIFwiLi9saW5lYXJcIjtcbmltcG9ydCB7ZGVmYXVsdCBhcyBjb250aW51b3VzLCBjb3B5fSBmcm9tIFwiLi9jb250aW51b3VzXCI7XG5cbmZ1bmN0aW9uIHJhaXNlKHgsIGV4cG9uZW50KSB7XG4gIHJldHVybiB4IDwgMCA/IC1NYXRoLnBvdygteCwgZXhwb25lbnQpIDogTWF0aC5wb3coeCwgZXhwb25lbnQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwb3coKSB7XG4gIHZhciBleHBvbmVudCA9IDEsXG4gICAgICBzY2FsZSA9IGNvbnRpbnVvdXMoZGVpbnRlcnBvbGF0ZSwgcmVpbnRlcnBvbGF0ZSksXG4gICAgICBkb21haW4gPSBzY2FsZS5kb21haW47XG5cbiAgZnVuY3Rpb24gZGVpbnRlcnBvbGF0ZShhLCBiKSB7XG4gICAgcmV0dXJuIChiID0gcmFpc2UoYiwgZXhwb25lbnQpIC0gKGEgPSByYWlzZShhLCBleHBvbmVudCkpKVxuICAgICAgICA/IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIChyYWlzZSh4LCBleHBvbmVudCkgLSBhKSAvIGI7IH1cbiAgICAgICAgOiBjb25zdGFudChiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlaW50ZXJwb2xhdGUoYSwgYikge1xuICAgIGIgPSByYWlzZShiLCBleHBvbmVudCkgLSAoYSA9IHJhaXNlKGEsIGV4cG9uZW50KSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHJhaXNlKGEgKyBiICogdCwgMSAvIGV4cG9uZW50KTsgfTtcbiAgfVxuXG4gIHNjYWxlLmV4cG9uZW50ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4cG9uZW50ID0gK18sIGRvbWFpbihkb21haW4oKSkpIDogZXhwb25lbnQ7XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjb3B5KHNjYWxlLCBwb3coKS5leHBvbmVudChleHBvbmVudCkpO1xuICB9O1xuXG4gIHJldHVybiBsaW5lYXJpc2goc2NhbGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3FydCgpIHtcbiAgcmV0dXJuIHBvdygpLmV4cG9uZW50KDAuNSk7XG59XG4iLCJ2YXIgdDAgPSBuZXcgRGF0ZSxcbiAgICB0MSA9IG5ldyBEYXRlO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBuZXdJbnRlcnZhbChmbG9vcmksIG9mZnNldGksIGNvdW50LCBmaWVsZCkge1xuXG4gIGZ1bmN0aW9uIGludGVydmFsKGRhdGUpIHtcbiAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSkpLCBkYXRlO1xuICB9XG5cbiAgaW50ZXJ2YWwuZmxvb3IgPSBpbnRlcnZhbDtcblxuICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKGRhdGUgLSAxKSksIG9mZnNldGkoZGF0ZSwgMSksIGZsb29yaShkYXRlKSwgZGF0ZTtcbiAgfTtcblxuICBpbnRlcnZhbC5yb3VuZCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZDAgPSBpbnRlcnZhbChkYXRlKSxcbiAgICAgICAgZDEgPSBpbnRlcnZhbC5jZWlsKGRhdGUpO1xuICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICB9O1xuXG4gIGludGVydmFsLm9mZnNldCA9IGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICByZXR1cm4gb2Zmc2V0aShkYXRlID0gbmV3IERhdGUoK2RhdGUpLCBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKSksIGRhdGU7XG4gIH07XG5cbiAgaW50ZXJ2YWwucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIHZhciByYW5nZSA9IFtdO1xuICAgIHN0YXJ0ID0gaW50ZXJ2YWwuY2VpbChzdGFydCk7XG4gICAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApO1xuICAgIGlmICghKHN0YXJ0IDwgc3RvcCkgfHwgIShzdGVwID4gMCkpIHJldHVybiByYW5nZTsgLy8gYWxzbyBoYW5kbGVzIEludmFsaWQgRGF0ZVxuICAgIGRvIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7IHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKVxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHdoaWxlIChmbG9vcmkoZGF0ZSksICF0ZXN0KGRhdGUpKSBkYXRlLnNldFRpbWUoZGF0ZSAtIDEpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIHdoaWxlICgtLXN0ZXAgPj0gMCkgd2hpbGUgKG9mZnNldGkoZGF0ZSwgMSksICF0ZXN0KGRhdGUpKTtcbiAgICB9KTtcbiAgfTtcblxuICBpZiAoY291bnQpIHtcbiAgICBpbnRlcnZhbC5jb3VudCA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHQwLnNldFRpbWUoK3N0YXJ0KSwgdDEuc2V0VGltZSgrZW5kKTtcbiAgICAgIGZsb29yaSh0MCksIGZsb29yaSh0MSk7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihjb3VudCh0MCwgdDEpKTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuZXZlcnkgPSBmdW5jdGlvbihzdGVwKSB7XG4gICAgICBzdGVwID0gTWF0aC5mbG9vcihzdGVwKTtcbiAgICAgIHJldHVybiAhaXNGaW5pdGUoc3RlcCkgfHwgIShzdGVwID4gMCkgPyBudWxsXG4gICAgICAgICAgOiAhKHN0ZXAgPiAxKSA/IGludGVydmFsXG4gICAgICAgICAgOiBpbnRlcnZhbC5maWx0ZXIoZmllbGRcbiAgICAgICAgICAgICAgPyBmdW5jdGlvbihkKSB7IHJldHVybiBmaWVsZChkKSAlIHN0ZXAgPT09IDA7IH1cbiAgICAgICAgICAgICAgOiBmdW5jdGlvbihkKSB7IHJldHVybiBpbnRlcnZhbC5jb3VudCgwLCBkKSAlIHN0ZXAgPT09IDA7IH0pO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gaW50ZXJ2YWw7XG59XG4iLCJpbXBvcnQgaW50ZXJ2YWwgZnJvbSBcIi4vaW50ZXJ2YWxcIjtcblxudmFyIG1pbGxpc2Vjb25kID0gaW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gIC8vIG5vb3Bcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiBlbmQgLSBzdGFydDtcbn0pO1xuXG4vLyBBbiBvcHRpbWl6ZWQgaW1wbGVtZW50YXRpb24gZm9yIHRoaXMgc2ltcGxlIGNhc2UuXG5taWxsaXNlY29uZC5ldmVyeSA9IGZ1bmN0aW9uKGspIHtcbiAgayA9IE1hdGguZmxvb3Ioayk7XG4gIGlmICghaXNGaW5pdGUoaykgfHwgIShrID4gMCkpIHJldHVybiBudWxsO1xuICBpZiAoIShrID4gMSkpIHJldHVybiBtaWxsaXNlY29uZDtcbiAgcmV0dXJuIGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFRpbWUoTWF0aC5mbG9vcihkYXRlIC8gaykgKiBrKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiBrKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gaztcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBtaWxsaXNlY29uZDtcbmV4cG9ydCB2YXIgbWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmQucmFuZ2U7XG4iLCJleHBvcnQgdmFyIGR1cmF0aW9uU2Vjb25kID0gMWUzO1xuZXhwb3J0IHZhciBkdXJhdGlvbk1pbnV0ZSA9IDZlNDtcbmV4cG9ydCB2YXIgZHVyYXRpb25Ib3VyID0gMzZlNTtcbmV4cG9ydCB2YXIgZHVyYXRpb25EYXkgPSA4NjRlNTtcbmV4cG9ydCB2YXIgZHVyYXRpb25XZWVrID0gNjA0OGU1O1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5pbXBvcnQge2R1cmF0aW9uU2Vjb25kfSBmcm9tIFwiLi9kdXJhdGlvblwiO1xuXG52YXIgc2Vjb25kID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldFRpbWUoTWF0aC5mbG9vcihkYXRlIC8gZHVyYXRpb25TZWNvbmQpICogZHVyYXRpb25TZWNvbmQpO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogZHVyYXRpb25TZWNvbmQpO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uU2Vjb25kO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRVVENTZWNvbmRzKCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgc2Vjb25kO1xuZXhwb3J0IHZhciBzZWNvbmRzID0gc2Vjb25kLnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5pbXBvcnQge2R1cmF0aW9uTWludXRlfSBmcm9tIFwiLi9kdXJhdGlvblwiO1xuXG52YXIgbWludXRlID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldFRpbWUoTWF0aC5mbG9vcihkYXRlIC8gZHVyYXRpb25NaW51dGUpICogZHVyYXRpb25NaW51dGUpO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogZHVyYXRpb25NaW51dGUpO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uTWludXRlO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRNaW51dGVzKCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbWludXRlO1xuZXhwb3J0IHZhciBtaW51dGVzID0gbWludXRlLnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5pbXBvcnQge2R1cmF0aW9uSG91ciwgZHVyYXRpb25NaW51dGV9IGZyb20gXCIuL2R1cmF0aW9uXCI7XG5cbnZhciBob3VyID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICB2YXIgb2Zmc2V0ID0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogZHVyYXRpb25NaW51dGUgJSBkdXJhdGlvbkhvdXI7XG4gIGlmIChvZmZzZXQgPCAwKSBvZmZzZXQgKz0gZHVyYXRpb25Ib3VyO1xuICBkYXRlLnNldFRpbWUoTWF0aC5mbG9vcigoK2RhdGUgLSBvZmZzZXQpIC8gZHVyYXRpb25Ib3VyKSAqIGR1cmF0aW9uSG91ciArIG9mZnNldCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiBkdXJhdGlvbkhvdXIpO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uSG91cjtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0SG91cnMoKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBob3VyO1xuZXhwb3J0IHZhciBob3VycyA9IGhvdXIucmFuZ2U7XG4iLCJpbXBvcnQgaW50ZXJ2YWwgZnJvbSBcIi4vaW50ZXJ2YWxcIjtcbmltcG9ydCB7ZHVyYXRpb25EYXksIGR1cmF0aW9uTWludXRlfSBmcm9tIFwiLi9kdXJhdGlvblwiO1xuXG52YXIgZGF5ID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogZHVyYXRpb25NaW51dGUpIC8gZHVyYXRpb25EYXk7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldERhdGUoKSAtIDE7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGF5O1xuZXhwb3J0IHZhciBkYXlzID0gZGF5LnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5pbXBvcnQge2R1cmF0aW9uTWludXRlLCBkdXJhdGlvbldlZWt9IGZyb20gXCIuL2R1cmF0aW9uXCI7XG5cbmZ1bmN0aW9uIHdlZWtkYXkoaSkge1xuICByZXR1cm4gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXAgKiA3KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIGR1cmF0aW9uTWludXRlKSAvIGR1cmF0aW9uV2VlaztcbiAgfSk7XG59XG5cbmV4cG9ydCB2YXIgc3VuZGF5ID0gd2Vla2RheSgwKTtcbmV4cG9ydCB2YXIgbW9uZGF5ID0gd2Vla2RheSgxKTtcbmV4cG9ydCB2YXIgdHVlc2RheSA9IHdlZWtkYXkoMik7XG5leHBvcnQgdmFyIHdlZG5lc2RheSA9IHdlZWtkYXkoMyk7XG5leHBvcnQgdmFyIHRodXJzZGF5ID0gd2Vla2RheSg0KTtcbmV4cG9ydCB2YXIgZnJpZGF5ID0gd2Vla2RheSg1KTtcbmV4cG9ydCB2YXIgc2F0dXJkYXkgPSB3ZWVrZGF5KDYpO1xuXG5leHBvcnQgdmFyIHN1bmRheXMgPSBzdW5kYXkucmFuZ2U7XG5leHBvcnQgdmFyIG1vbmRheXMgPSBtb25kYXkucmFuZ2U7XG5leHBvcnQgdmFyIHR1ZXNkYXlzID0gdHVlc2RheS5yYW5nZTtcbmV4cG9ydCB2YXIgd2VkbmVzZGF5cyA9IHdlZG5lc2RheS5yYW5nZTtcbmV4cG9ydCB2YXIgdGh1cnNkYXlzID0gdGh1cnNkYXkucmFuZ2U7XG5leHBvcnQgdmFyIGZyaWRheXMgPSBmcmlkYXkucmFuZ2U7XG5leHBvcnQgdmFyIHNhdHVyZGF5cyA9IHNhdHVyZGF5LnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5cbnZhciBtb250aCA9IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXREYXRlKDEpO1xuICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHN0ZXApO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gZW5kLmdldE1vbnRoKCkgLSBzdGFydC5nZXRNb250aCgpICsgKGVuZC5nZXRGdWxsWWVhcigpIC0gc3RhcnQuZ2V0RnVsbFllYXIoKSkgKiAxMjtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0TW9udGgoKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBtb250aDtcbmV4cG9ydCB2YXIgbW9udGhzID0gbW9udGgucmFuZ2U7XG4iLCJpbXBvcnQgaW50ZXJ2YWwgZnJvbSBcIi4vaW50ZXJ2YWxcIjtcblxudmFyIHllYXIgPSBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0TW9udGgoMCwgMSk7XG4gIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldEZ1bGxZZWFyKCk7XG59KTtcblxuLy8gQW4gb3B0aW1pemVkIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIHNpbXBsZSBjYXNlLlxueWVhci5ldmVyeSA9IGZ1bmN0aW9uKGspIHtcbiAgcmV0dXJuICFpc0Zpbml0ZShrID0gTWF0aC5mbG9vcihrKSkgfHwgIShrID4gMCkgPyBudWxsIDogaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoTWF0aC5mbG9vcihkYXRlLmdldEZ1bGxZZWFyKCkgLyBrKSAqIGspO1xuICAgIGRhdGUuc2V0TW9udGgoMCwgMSk7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgc3RlcCAqIGspO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHllYXI7XG5leHBvcnQgdmFyIHllYXJzID0geWVhci5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuaW1wb3J0IHtkdXJhdGlvbk1pbnV0ZX0gZnJvbSBcIi4vZHVyYXRpb25cIjtcblxudmFyIHV0Y01pbnV0ZSA9IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRVVENTZWNvbmRzKDAsIDApO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogZHVyYXRpb25NaW51dGUpO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uTWludXRlO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRVVENNaW51dGVzKCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgdXRjTWludXRlO1xuZXhwb3J0IHZhciB1dGNNaW51dGVzID0gdXRjTWludXRlLnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5pbXBvcnQge2R1cmF0aW9uSG91cn0gZnJvbSBcIi4vZHVyYXRpb25cIjtcblxudmFyIHV0Y0hvdXIgPSBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0VVRDTWludXRlcygwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIGR1cmF0aW9uSG91cik7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gZHVyYXRpb25Ib3VyO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRVVENIb3VycygpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHV0Y0hvdXI7XG5leHBvcnQgdmFyIHV0Y0hvdXJzID0gdXRjSG91ci5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuaW1wb3J0IHtkdXJhdGlvbkRheX0gZnJvbSBcIi4vZHVyYXRpb25cIjtcblxudmFyIHV0Y0RheSA9IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gZHVyYXRpb25EYXk7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldFVUQ0RhdGUoKSAtIDE7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgdXRjRGF5O1xuZXhwb3J0IHZhciB1dGNEYXlzID0gdXRjRGF5LnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5pbXBvcnQge2R1cmF0aW9uV2Vla30gZnJvbSBcIi4vZHVyYXRpb25cIjtcblxuZnVuY3Rpb24gdXRjV2Vla2RheShpKSB7XG4gIHJldHVybiBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gKGRhdGUuZ2V0VVRDRGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCAqIDcpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBkdXJhdGlvbldlZWs7XG4gIH0pO1xufVxuXG5leHBvcnQgdmFyIHV0Y1N1bmRheSA9IHV0Y1dlZWtkYXkoMCk7XG5leHBvcnQgdmFyIHV0Y01vbmRheSA9IHV0Y1dlZWtkYXkoMSk7XG5leHBvcnQgdmFyIHV0Y1R1ZXNkYXkgPSB1dGNXZWVrZGF5KDIpO1xuZXhwb3J0IHZhciB1dGNXZWRuZXNkYXkgPSB1dGNXZWVrZGF5KDMpO1xuZXhwb3J0IHZhciB1dGNUaHVyc2RheSA9IHV0Y1dlZWtkYXkoNCk7XG5leHBvcnQgdmFyIHV0Y0ZyaWRheSA9IHV0Y1dlZWtkYXkoNSk7XG5leHBvcnQgdmFyIHV0Y1NhdHVyZGF5ID0gdXRjV2Vla2RheSg2KTtcblxuZXhwb3J0IHZhciB1dGNTdW5kYXlzID0gdXRjU3VuZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB1dGNNb25kYXlzID0gdXRjTW9uZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB1dGNUdWVzZGF5cyA9IHV0Y1R1ZXNkYXkucmFuZ2U7XG5leHBvcnQgdmFyIHV0Y1dlZG5lc2RheXMgPSB1dGNXZWRuZXNkYXkucmFuZ2U7XG5leHBvcnQgdmFyIHV0Y1RodXJzZGF5cyA9IHV0Y1RodXJzZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB1dGNGcmlkYXlzID0gdXRjRnJpZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB1dGNTYXR1cmRheXMgPSB1dGNTYXR1cmRheS5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbFwiO1xuXG52YXIgdXRjTW9udGggPSBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0VVRDRGF0ZSgxKTtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRVVENNb250aChkYXRlLmdldFVUQ01vbnRoKCkgKyBzdGVwKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIGVuZC5nZXRVVENNb250aCgpIC0gc3RhcnQuZ2V0VVRDTW9udGgoKSArIChlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCkpICogMTI7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldFVUQ01vbnRoKCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgdXRjTW9udGg7XG5leHBvcnQgdmFyIHV0Y01vbnRocyA9IHV0Y01vbnRoLnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsXCI7XG5cbnZhciB1dGNZZWFyID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldFVUQ01vbnRoKDAsIDEpO1xuICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSArIHN0ZXApO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xufSk7XG5cbi8vIEFuIG9wdGltaXplZCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhpcyBzaW1wbGUgY2FzZS5cbnV0Y1llYXIuZXZlcnkgPSBmdW5jdGlvbihrKSB7XG4gIHJldHVybiAhaXNGaW5pdGUoayA9IE1hdGguZmxvb3IoaykpIHx8ICEoayA+IDApID8gbnVsbCA6IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKE1hdGguZmxvb3IoZGF0ZS5nZXRVVENGdWxsWWVhcigpIC8gaykgKiBrKTtcbiAgICBkYXRlLnNldFVUQ01vbnRoKDAsIDEpO1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSArIHN0ZXAgKiBrKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1dGNZZWFyO1xuZXhwb3J0IHZhciB1dGNZZWFycyA9IHV0Y1llYXIucmFuZ2U7XG4iLCJpbXBvcnQge3RpbWVEYXksIHRpbWVTdW5kYXksIHRpbWVNb25kYXksIHRpbWVZZWFyLCB1dGNEYXksIHV0Y1N1bmRheSwgdXRjTW9uZGF5LCB1dGNZZWFyfSBmcm9tIFwiZDMtdGltZVwiO1xuXG52YXIgZGVmYXVsdExvY2FsZSA9IGZvcm1hdExvY2FsZSh7XG4gIGRhdGVUaW1lOiBcIiVhICViICVlICVYICVZXCIsXG4gIGRhdGU6IFwiJW0vJWQvJVlcIixcbiAgdGltZTogXCIlSDolTTolU1wiLFxuICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLFxuICBkYXlzOiBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXSxcbiAgc2hvcnREYXlzOiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gIG1vbnRoczogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl0sXG4gIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNYXJcIiwgXCJBcHJcIiwgXCJNYXlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPY3RcIiwgXCJOb3ZcIiwgXCJEZWNcIl1cbn0pO1xuXG5leHBvcnQgdmFyIHRpbWVGb3JtYXQgPSBkZWZhdWx0TG9jYWxlLmZvcm1hdDtcbmV4cG9ydCB2YXIgdGltZVBhcnNlID0gZGVmYXVsdExvY2FsZS5wYXJzZTtcbmV4cG9ydCB2YXIgdXRjRm9ybWF0ID0gZGVmYXVsdExvY2FsZS51dGNGb3JtYXQ7XG5leHBvcnQgdmFyIHV0Y1BhcnNlID0gZGVmYXVsdExvY2FsZS51dGNQYXJzZTtcblxuZnVuY3Rpb24gbG9jYWxEYXRlKGQpIHtcbiAgaWYgKDAgPD0gZC55ICYmIGQueSA8IDEwMCkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoLTEsIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpO1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZC55KTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbn1cblxuZnVuY3Rpb24gdXRjRGF0ZShkKSB7XG4gIGlmICgwIDw9IGQueSAmJiBkLnkgPCAxMDApIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKC0xLCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKSk7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihkLnkpO1xuICAgIHJldHVybiBkYXRlO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyhkLnksIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpKTtcbn1cblxuZnVuY3Rpb24gbmV3WWVhcih5KSB7XG4gIHJldHVybiB7eTogeSwgbTogMCwgZDogMSwgSDogMCwgTTogMCwgUzogMCwgTDogMH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZvcm1hdExvY2FsZShsb2NhbGUpIHtcbiAgdmFyIGxvY2FsZV9kYXRlVGltZSA9IGxvY2FsZS5kYXRlVGltZSxcbiAgICAgIGxvY2FsZV9kYXRlID0gbG9jYWxlLmRhdGUsXG4gICAgICBsb2NhbGVfdGltZSA9IGxvY2FsZS50aW1lLFxuICAgICAgbG9jYWxlX3BlcmlvZHMgPSBsb2NhbGUucGVyaW9kcyxcbiAgICAgIGxvY2FsZV93ZWVrZGF5cyA9IGxvY2FsZS5kYXlzLFxuICAgICAgbG9jYWxlX3Nob3J0V2Vla2RheXMgPSBsb2NhbGUuc2hvcnREYXlzLFxuICAgICAgbG9jYWxlX21vbnRocyA9IGxvY2FsZS5tb250aHMsXG4gICAgICBsb2NhbGVfc2hvcnRNb250aHMgPSBsb2NhbGUuc2hvcnRNb250aHM7XG5cbiAgdmFyIHBlcmlvZFJlID0gZm9ybWF0UmUobG9jYWxlX3BlcmlvZHMpLFxuICAgICAgcGVyaW9kTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9wZXJpb2RzKSxcbiAgICAgIHdlZWtkYXlSZSA9IGZvcm1hdFJlKGxvY2FsZV93ZWVrZGF5cyksXG4gICAgICB3ZWVrZGF5TG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV93ZWVrZGF5cyksXG4gICAgICBzaG9ydFdlZWtkYXlSZSA9IGZvcm1hdFJlKGxvY2FsZV9zaG9ydFdlZWtkYXlzKSxcbiAgICAgIHNob3J0V2Vla2RheUxvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfc2hvcnRXZWVrZGF5cyksXG4gICAgICBtb250aFJlID0gZm9ybWF0UmUobG9jYWxlX21vbnRocyksXG4gICAgICBtb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfbW9udGhzKSxcbiAgICAgIHNob3J0TW9udGhSZSA9IGZvcm1hdFJlKGxvY2FsZV9zaG9ydE1vbnRocyksXG4gICAgICBzaG9ydE1vbnRoTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9zaG9ydE1vbnRocyk7XG5cbiAgdmFyIGZvcm1hdHMgPSB7XG4gICAgXCJhXCI6IGZvcm1hdFNob3J0V2Vla2RheSxcbiAgICBcIkFcIjogZm9ybWF0V2Vla2RheSxcbiAgICBcImJcIjogZm9ybWF0U2hvcnRNb250aCxcbiAgICBcIkJcIjogZm9ybWF0TW9udGgsXG4gICAgXCJjXCI6IG51bGwsXG4gICAgXCJkXCI6IGZvcm1hdERheU9mTW9udGgsXG4gICAgXCJlXCI6IGZvcm1hdERheU9mTW9udGgsXG4gICAgXCJIXCI6IGZvcm1hdEhvdXIyNCxcbiAgICBcIklcIjogZm9ybWF0SG91cjEyLFxuICAgIFwialwiOiBmb3JtYXREYXlPZlllYXIsXG4gICAgXCJMXCI6IGZvcm1hdE1pbGxpc2Vjb25kcyxcbiAgICBcIm1cIjogZm9ybWF0TW9udGhOdW1iZXIsXG4gICAgXCJNXCI6IGZvcm1hdE1pbnV0ZXMsXG4gICAgXCJwXCI6IGZvcm1hdFBlcmlvZCxcbiAgICBcIlNcIjogZm9ybWF0U2Vjb25kcyxcbiAgICBcIlVcIjogZm9ybWF0V2Vla051bWJlclN1bmRheSxcbiAgICBcIndcIjogZm9ybWF0V2Vla2RheU51bWJlcixcbiAgICBcIldcIjogZm9ybWF0V2Vla051bWJlck1vbmRheSxcbiAgICBcInhcIjogbnVsbCxcbiAgICBcIlhcIjogbnVsbCxcbiAgICBcInlcIjogZm9ybWF0WWVhcixcbiAgICBcIllcIjogZm9ybWF0RnVsbFllYXIsXG4gICAgXCJaXCI6IGZvcm1hdFpvbmUsXG4gICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gIH07XG5cbiAgdmFyIHV0Y0Zvcm1hdHMgPSB7XG4gICAgXCJhXCI6IGZvcm1hdFVUQ1Nob3J0V2Vla2RheSxcbiAgICBcIkFcIjogZm9ybWF0VVRDV2Vla2RheSxcbiAgICBcImJcIjogZm9ybWF0VVRDU2hvcnRNb250aCxcbiAgICBcIkJcIjogZm9ybWF0VVRDTW9udGgsXG4gICAgXCJjXCI6IG51bGwsXG4gICAgXCJkXCI6IGZvcm1hdFVUQ0RheU9mTW9udGgsXG4gICAgXCJlXCI6IGZvcm1hdFVUQ0RheU9mTW9udGgsXG4gICAgXCJIXCI6IGZvcm1hdFVUQ0hvdXIyNCxcbiAgICBcIklcIjogZm9ybWF0VVRDSG91cjEyLFxuICAgIFwialwiOiBmb3JtYXRVVENEYXlPZlllYXIsXG4gICAgXCJMXCI6IGZvcm1hdFVUQ01pbGxpc2Vjb25kcyxcbiAgICBcIm1cIjogZm9ybWF0VVRDTW9udGhOdW1iZXIsXG4gICAgXCJNXCI6IGZvcm1hdFVUQ01pbnV0ZXMsXG4gICAgXCJwXCI6IGZvcm1hdFVUQ1BlcmlvZCxcbiAgICBcIlNcIjogZm9ybWF0VVRDU2Vjb25kcyxcbiAgICBcIlVcIjogZm9ybWF0VVRDV2Vla051bWJlclN1bmRheSxcbiAgICBcIndcIjogZm9ybWF0VVRDV2Vla2RheU51bWJlcixcbiAgICBcIldcIjogZm9ybWF0VVRDV2Vla051bWJlck1vbmRheSxcbiAgICBcInhcIjogbnVsbCxcbiAgICBcIlhcIjogbnVsbCxcbiAgICBcInlcIjogZm9ybWF0VVRDWWVhcixcbiAgICBcIllcIjogZm9ybWF0VVRDRnVsbFllYXIsXG4gICAgXCJaXCI6IGZvcm1hdFVUQ1pvbmUsXG4gICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gIH07XG5cbiAgdmFyIHBhcnNlcyA9IHtcbiAgICBcImFcIjogcGFyc2VTaG9ydFdlZWtkYXksXG4gICAgXCJBXCI6IHBhcnNlV2Vla2RheSxcbiAgICBcImJcIjogcGFyc2VTaG9ydE1vbnRoLFxuICAgIFwiQlwiOiBwYXJzZU1vbnRoLFxuICAgIFwiY1wiOiBwYXJzZUxvY2FsZURhdGVUaW1lLFxuICAgIFwiZFwiOiBwYXJzZURheU9mTW9udGgsXG4gICAgXCJlXCI6IHBhcnNlRGF5T2ZNb250aCxcbiAgICBcIkhcIjogcGFyc2VIb3VyMjQsXG4gICAgXCJJXCI6IHBhcnNlSG91cjI0LFxuICAgIFwialwiOiBwYXJzZURheU9mWWVhcixcbiAgICBcIkxcIjogcGFyc2VNaWxsaXNlY29uZHMsXG4gICAgXCJtXCI6IHBhcnNlTW9udGhOdW1iZXIsXG4gICAgXCJNXCI6IHBhcnNlTWludXRlcyxcbiAgICBcInBcIjogcGFyc2VQZXJpb2QsXG4gICAgXCJTXCI6IHBhcnNlU2Vjb25kcyxcbiAgICBcIlVcIjogcGFyc2VXZWVrTnVtYmVyU3VuZGF5LFxuICAgIFwid1wiOiBwYXJzZVdlZWtkYXlOdW1iZXIsXG4gICAgXCJXXCI6IHBhcnNlV2Vla051bWJlck1vbmRheSxcbiAgICBcInhcIjogcGFyc2VMb2NhbGVEYXRlLFxuICAgIFwiWFwiOiBwYXJzZUxvY2FsZVRpbWUsXG4gICAgXCJ5XCI6IHBhcnNlWWVhcixcbiAgICBcIllcIjogcGFyc2VGdWxsWWVhcixcbiAgICBcIlpcIjogcGFyc2Vab25lLFxuICAgIFwiJVwiOiBwYXJzZUxpdGVyYWxQZXJjZW50XG4gIH07XG5cbiAgLy8gVGhlc2UgcmVjdXJzaXZlIGRpcmVjdGl2ZSBkZWZpbml0aW9ucyBtdXN0IGJlIGRlZmVycmVkLlxuICBmb3JtYXRzLnggPSBuZXdGb3JtYXQobG9jYWxlX2RhdGUsIGZvcm1hdHMpO1xuICBmb3JtYXRzLlggPSBuZXdGb3JtYXQobG9jYWxlX3RpbWUsIGZvcm1hdHMpO1xuICBmb3JtYXRzLmMgPSBuZXdGb3JtYXQobG9jYWxlX2RhdGVUaW1lLCBmb3JtYXRzKTtcbiAgdXRjRm9ybWF0cy54ID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlLCB1dGNGb3JtYXRzKTtcbiAgdXRjRm9ybWF0cy5YID0gbmV3Rm9ybWF0KGxvY2FsZV90aW1lLCB1dGNGb3JtYXRzKTtcbiAgdXRjRm9ybWF0cy5jID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlVGltZSwgdXRjRm9ybWF0cyk7XG5cbiAgZnVuY3Rpb24gbmV3Rm9ybWF0KHNwZWNpZmllciwgZm9ybWF0cykge1xuICAgIHJldHVybiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgc3RyaW5nID0gW10sXG4gICAgICAgICAgaSA9IC0xLFxuICAgICAgICAgIGogPSAwLFxuICAgICAgICAgIG4gPSBzcGVjaWZpZXIubGVuZ3RoLFxuICAgICAgICAgIGMsXG4gICAgICAgICAgcGFkLFxuICAgICAgICAgIGZvcm1hdDtcblxuICAgICAgaWYgKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSBkYXRlID0gbmV3IERhdGUoK2RhdGUpO1xuXG4gICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICBpZiAoc3BlY2lmaWVyLmNoYXJDb2RlQXQoaSkgPT09IDM3KSB7XG4gICAgICAgICAgc3RyaW5nLnB1c2goc3BlY2lmaWVyLnNsaWNlKGosIGkpKTtcbiAgICAgICAgICBpZiAoKHBhZCA9IHBhZHNbYyA9IHNwZWNpZmllci5jaGFyQXQoKytpKV0pICE9IG51bGwpIGMgPSBzcGVjaWZpZXIuY2hhckF0KCsraSk7XG4gICAgICAgICAgZWxzZSBwYWQgPSBjID09PSBcImVcIiA/IFwiIFwiIDogXCIwXCI7XG4gICAgICAgICAgaWYgKGZvcm1hdCA9IGZvcm1hdHNbY10pIGMgPSBmb3JtYXQoZGF0ZSwgcGFkKTtcbiAgICAgICAgICBzdHJpbmcucHVzaChjKTtcbiAgICAgICAgICBqID0gaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3RyaW5nLnB1c2goc3BlY2lmaWVyLnNsaWNlKGosIGkpKTtcbiAgICAgIHJldHVybiBzdHJpbmcuam9pbihcIlwiKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3UGFyc2Uoc3BlY2lmaWVyLCBuZXdEYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgdmFyIGQgPSBuZXdZZWFyKDE5MDApLFxuICAgICAgICAgIGkgPSBwYXJzZVNwZWNpZmllcihkLCBzcGVjaWZpZXIsIHN0cmluZyArPSBcIlwiLCAwKTtcbiAgICAgIGlmIChpICE9IHN0cmluZy5sZW5ndGgpIHJldHVybiBudWxsO1xuXG4gICAgICAvLyBUaGUgYW0tcG0gZmxhZyBpcyAwIGZvciBBTSwgYW5kIDEgZm9yIFBNLlxuICAgICAgaWYgKFwicFwiIGluIGQpIGQuSCA9IGQuSCAlIDEyICsgZC5wICogMTI7XG5cbiAgICAgIC8vIENvbnZlcnQgZGF5LW9mLXdlZWsgYW5kIHdlZWstb2YteWVhciB0byBkYXktb2YteWVhci5cbiAgICAgIGlmIChcIldcIiBpbiBkIHx8IFwiVVwiIGluIGQpIHtcbiAgICAgICAgaWYgKCEoXCJ3XCIgaW4gZCkpIGQudyA9IFwiV1wiIGluIGQgPyAxIDogMDtcbiAgICAgICAgdmFyIGRheSA9IFwiWlwiIGluIGQgPyB1dGNEYXRlKG5ld1llYXIoZC55KSkuZ2V0VVRDRGF5KCkgOiBuZXdEYXRlKG5ld1llYXIoZC55KSkuZ2V0RGF5KCk7XG4gICAgICAgIGQubSA9IDA7XG4gICAgICAgIGQuZCA9IFwiV1wiIGluIGQgPyAoZC53ICsgNikgJSA3ICsgZC5XICogNyAtIChkYXkgKyA1KSAlIDcgOiBkLncgKyBkLlUgKiA3IC0gKGRheSArIDYpICUgNztcbiAgICAgIH1cblxuICAgICAgLy8gSWYgYSB0aW1lIHpvbmUgaXMgc3BlY2lmaWVkLCBhbGwgZmllbGRzIGFyZSBpbnRlcnByZXRlZCBhcyBVVEMgYW5kIHRoZW5cbiAgICAgIC8vIG9mZnNldCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCB0aW1lIHpvbmUuXG4gICAgICBpZiAoXCJaXCIgaW4gZCkge1xuICAgICAgICBkLkggKz0gZC5aIC8gMTAwIHwgMDtcbiAgICAgICAgZC5NICs9IGQuWiAlIDEwMDtcbiAgICAgICAgcmV0dXJuIHV0Y0RhdGUoZCk7XG4gICAgICB9XG5cbiAgICAgIC8vIE90aGVyd2lzZSwgYWxsIGZpZWxkcyBhcmUgaW4gbG9jYWwgdGltZS5cbiAgICAgIHJldHVybiBuZXdEYXRlKGQpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVNwZWNpZmllcihkLCBzcGVjaWZpZXIsIHN0cmluZywgaikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbiA9IHNwZWNpZmllci5sZW5ndGgsXG4gICAgICAgIG0gPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICBjLFxuICAgICAgICBwYXJzZTtcblxuICAgIHdoaWxlIChpIDwgbikge1xuICAgICAgaWYgKGogPj0gbSkgcmV0dXJuIC0xO1xuICAgICAgYyA9IHNwZWNpZmllci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICBpZiAoYyA9PT0gMzcpIHtcbiAgICAgICAgYyA9IHNwZWNpZmllci5jaGFyQXQoaSsrKTtcbiAgICAgICAgcGFyc2UgPSBwYXJzZXNbYyBpbiBwYWRzID8gc3BlY2lmaWVyLmNoYXJBdChpKyspIDogY107XG4gICAgICAgIGlmICghcGFyc2UgfHwgKChqID0gcGFyc2UoZCwgc3RyaW5nLCBqKSkgPCAwKSkgcmV0dXJuIC0xO1xuICAgICAgfSBlbHNlIGlmIChjICE9IHN0cmluZy5jaGFyQ29kZUF0KGorKykpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBqO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VQZXJpb2QoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBwZXJpb2RSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5wID0gcGVyaW9kTG9va3VwW25bMF0udG9Mb3dlckNhc2UoKV0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlU2hvcnRXZWVrZGF5KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gc2hvcnRXZWVrZGF5UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQudyA9IHNob3J0V2Vla2RheUxvb2t1cFtuWzBdLnRvTG93ZXJDYXNlKCldLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVdlZWtkYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSB3ZWVrZGF5UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQudyA9IHdlZWtkYXlMb29rdXBbblswXS50b0xvd2VyQ2FzZSgpXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTaG9ydE1vbnRoKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gc2hvcnRNb250aFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLm0gPSBzaG9ydE1vbnRoTG9va3VwW25bMF0udG9Mb3dlckNhc2UoKV0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTW9udGgoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBtb250aFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLm0gPSBtb250aExvb2t1cFtuWzBdLnRvTG93ZXJDYXNlKCldLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfZGF0ZVRpbWUsIHN0cmluZywgaSk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGUoZCwgc3RyaW5nLCBpKSB7XG4gICAgcmV0dXJuIHBhcnNlU3BlY2lmaWVyKGQsIGxvY2FsZV9kYXRlLCBzdHJpbmcsIGkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VMb2NhbGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfdGltZSwgc3RyaW5nLCBpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFNob3J0V2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9zaG9ydFdlZWtkYXlzW2QuZ2V0RGF5KCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0V2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV93ZWVrZGF5c1tkLmdldERheSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFNob3J0TW9udGgoZCkge1xuICAgIHJldHVybiBsb2NhbGVfc2hvcnRNb250aHNbZC5nZXRNb250aCgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE1vbnRoKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX21vbnRoc1tkLmdldE1vbnRoKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UGVyaW9kKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX3BlcmlvZHNbKyhkLmdldEhvdXJzKCkgPj0gMTIpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1Nob3J0V2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9zaG9ydFdlZWtkYXlzW2QuZ2V0VVRDRGF5KCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV93ZWVrZGF5c1tkLmdldFVUQ0RheSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1Nob3J0TW9udGgoZCkge1xuICAgIHJldHVybiBsb2NhbGVfc2hvcnRNb250aHNbZC5nZXRVVENNb250aCgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ01vbnRoKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX21vbnRoc1tkLmdldFVUQ01vbnRoKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDUGVyaW9kKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX3BlcmlvZHNbKyhkLmdldFVUQ0hvdXJzKCkgPj0gMTIpXTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZm9ybWF0OiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgIHZhciBmID0gbmV3Rm9ybWF0KHNwZWNpZmllciArPSBcIlwiLCBmb3JtYXRzKTtcbiAgICAgIGYudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgIHJldHVybiBmO1xuICAgIH0sXG4gICAgcGFyc2U6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgdmFyIHAgPSBuZXdQYXJzZShzcGVjaWZpZXIgKz0gXCJcIiwgbG9jYWxEYXRlKTtcbiAgICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgIHJldHVybiBwO1xuICAgIH0sXG4gICAgdXRjRm9ybWF0OiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgIHZhciBmID0gbmV3Rm9ybWF0KHNwZWNpZmllciArPSBcIlwiLCB1dGNGb3JtYXRzKTtcbiAgICAgIGYudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgIHJldHVybiBmO1xuICAgIH0sXG4gICAgdXRjUGFyc2U6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgdmFyIHAgPSBuZXdQYXJzZShzcGVjaWZpZXIsIHV0Y0RhdGUpO1xuICAgICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3BlY2lmaWVyOyB9O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9O1xufVxuXG52YXIgcGFkcyA9IHtcIi1cIjogXCJcIiwgXCJfXCI6IFwiIFwiLCBcIjBcIjogXCIwXCJ9LFxuICAgIG51bWJlclJlID0gL15cXHMqXFxkKy8sIC8vIG5vdGU6IGlnbm9yZXMgbmV4dCBkaXJlY3RpdmVcbiAgICBwZXJjZW50UmUgPSAvXiUvLFxuICAgIHJlcXVvdGVSZSA9IC9bXFxcXFxcXlxcJFxcKlxcK1xcP1xcfFxcW1xcXVxcKFxcKVxcLlxce1xcfV0vZztcblxuZnVuY3Rpb24gcGFkKHZhbHVlLCBmaWxsLCB3aWR0aCkge1xuICB2YXIgc2lnbiA9IHZhbHVlIDwgMCA/IFwiLVwiIDogXCJcIixcbiAgICAgIHN0cmluZyA9IChzaWduID8gLXZhbHVlIDogdmFsdWUpICsgXCJcIixcbiAgICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gIHJldHVybiBzaWduICsgKGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSArIHN0cmluZyA6IHN0cmluZyk7XG59XG5cbmZ1bmN0aW9uIHJlcXVvdGUocykge1xuICByZXR1cm4gcy5yZXBsYWNlKHJlcXVvdGVSZSwgXCJcXFxcJCZcIik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFJlKG5hbWVzKSB7XG4gIHJldHVybiBuZXcgUmVnRXhwKFwiXig/OlwiICsgbmFtZXMubWFwKHJlcXVvdGUpLmpvaW4oXCJ8XCIpICsgXCIpXCIsIFwiaVwiKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TG9va3VwKG5hbWVzKSB7XG4gIHZhciBtYXAgPSB7fSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbWFwW25hbWVzW2ldLnRvTG93ZXJDYXNlKCldID0gaTtcbiAgcmV0dXJuIG1hcDtcbn1cblxuZnVuY3Rpb24gcGFyc2VXZWVrZGF5TnVtYmVyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gIHJldHVybiBuID8gKGQudyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlV2Vla051bWJlclN1bmRheShkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gIHJldHVybiBuID8gKGQuVSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlV2Vla051bWJlck1vbmRheShkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gIHJldHVybiBuID8gKGQuVyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRnVsbFllYXIoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDQpKTtcbiAgcmV0dXJuIG4gPyAoZC55ID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VZZWFyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQueSA9ICtuWzBdICsgKCtuWzBdID4gNjggPyAxOTAwIDogMjAwMCksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2Vab25lKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IC9eKFopfChbKy1dXFxkXFxkKSg/OlxcOj8oXFxkXFxkKSk/Ly5leGVjKHN0cmluZy5zbGljZShpLCBpICsgNikpO1xuICByZXR1cm4gbiA/IChkLlogPSBuWzFdID8gMCA6IC0oblsyXSArIChuWzNdIHx8IFwiMDBcIikpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTW9udGhOdW1iZXIoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgcmV0dXJuIG4gPyAoZC5tID0gblswXSAtIDEsIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VEYXlPZk1vbnRoKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQuZCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF5T2ZZZWFyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAzKSk7XG4gIHJldHVybiBuID8gKGQubSA9IDAsIGQuZCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlSG91cjI0KGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQuSCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTWludXRlcyhkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLk0gPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNlY29uZHMoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgcmV0dXJuIG4gPyAoZC5TID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VNaWxsaXNlY29uZHMoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDMpKTtcbiAgcmV0dXJuIG4gPyAoZC5MID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VMaXRlcmFsUGVyY2VudChkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBwZXJjZW50UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDEpKTtcbiAgcmV0dXJuIG4gPyBpICsgblswXS5sZW5ndGggOiAtMTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF5T2ZNb250aChkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXREYXRlKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRIb3VyMjQoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0SG91cnMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEhvdXIxMihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRIb3VycygpICUgMTIgfHwgMTIsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXREYXlPZlllYXIoZCwgcCkge1xuICByZXR1cm4gcGFkKDEgKyB0aW1lRGF5LmNvdW50KHRpbWVZZWFyKGQpLCBkKSwgcCwgMyk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1pbGxpc2Vjb25kcyhkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRNaWxsaXNlY29uZHMoKSwgcCwgMyk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1vbnRoTnVtYmVyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldE1vbnRoKCkgKyAxLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TWludXRlcyhkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRNaW51dGVzKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRTZWNvbmRzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFNlY29uZHMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJTdW5kYXkoZCwgcCkge1xuICByZXR1cm4gcGFkKHRpbWVTdW5kYXkuY291bnQodGltZVllYXIoZCksIGQpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0V2Vla2RheU51bWJlcihkKSB7XG4gIHJldHVybiBkLmdldERheSgpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRXZWVrTnVtYmVyTW9uZGF5KGQsIHApIHtcbiAgcmV0dXJuIHBhZCh0aW1lTW9uZGF5LmNvdW50KHRpbWVZZWFyKGQpLCBkKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFllYXIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0RnVsbFllYXIoKSAlIDEwMCwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEZ1bGxZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldEZ1bGxZZWFyKCkgJSAxMDAwMCwgcCwgNCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFpvbmUoZCkge1xuICB2YXIgeiA9IGQuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgcmV0dXJuICh6ID4gMCA/IFwiLVwiIDogKHogKj0gLTEsIFwiK1wiKSlcbiAgICAgICsgcGFkKHogLyA2MCB8IDAsIFwiMFwiLCAyKVxuICAgICAgKyBwYWQoeiAlIDYwLCBcIjBcIiwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mTW9udGgoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDRGF0ZSgpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDSG91cjI0KGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ0hvdXJzKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENIb3VyMTIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDSG91cnMoKSAlIDEyIHx8IDEyLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDRGF5T2ZZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZCgxICsgdXRjRGF5LmNvdW50KHV0Y1llYXIoZCksIGQpLCBwLCAzKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDTWlsbGlzZWNvbmRzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ01pbGxpc2Vjb25kcygpLCBwLCAzKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDTW9udGhOdW1iZXIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENNaW51dGVzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ01pbnV0ZXMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ1NlY29uZHMoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDU2Vjb25kcygpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDV2Vla051bWJlclN1bmRheShkLCBwKSB7XG4gIHJldHVybiBwYWQodXRjU3VuZGF5LmNvdW50KHV0Y1llYXIoZCksIGQpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheU51bWJlcihkKSB7XG4gIHJldHVybiBkLmdldFVUQ0RheSgpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENXZWVrTnVtYmVyTW9uZGF5KGQsIHApIHtcbiAgcmV0dXJuIHBhZCh1dGNNb25kYXkuY291bnQodXRjWWVhcihkKSwgZCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ0Z1bGxZZWFyKCkgJSAxMDAsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENGdWxsWWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENGdWxsWWVhcigpICUgMTAwMDAsIHAsIDQpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENab25lKCkge1xuICByZXR1cm4gXCIrMDAwMFwiO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRMaXRlcmFsUGVyY2VudCgpIHtcbiAgcmV0dXJuIFwiJVwiO1xufVxuIiwiaW1wb3J0IHt1dGNGb3JtYXR9IGZyb20gXCIuL2xvY2FsZVwiO1xuXG5leHBvcnQgdmFyIGlzb1NwZWNpZmllciA9IFwiJVktJW0tJWRUJUg6JU06JVMuJUxaXCI7XG5cbmZ1bmN0aW9uIGZvcm1hdElzb05hdGl2ZShkYXRlKSB7XG4gIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG59XG5cbnZhciBmb3JtYXRJc28gPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZ1xuICAgID8gZm9ybWF0SXNvTmF0aXZlXG4gICAgOiB1dGNGb3JtYXQoaXNvU3BlY2lmaWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgZm9ybWF0SXNvO1xuIiwiaW1wb3J0IHtpc29TcGVjaWZpZXJ9IGZyb20gXCIuL2lzb0Zvcm1hdFwiO1xuaW1wb3J0IHt1dGNQYXJzZX0gZnJvbSBcIi4vbG9jYWxlXCI7XG5cbmZ1bmN0aW9uIHBhcnNlSXNvTmF0aXZlKHN0cmluZykge1xuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHN0cmluZyk7XG4gIHJldHVybiBpc05hTihkYXRlKSA/IG51bGwgOiBkYXRlO1xufVxuXG52YXIgcGFyc2VJc28gPSArbmV3IERhdGUoXCIyMDAwLTAxLTAxVDAwOjAwOjAwLjAwMFpcIilcbiAgICA/IHBhcnNlSXNvTmF0aXZlXG4gICAgOiB1dGNQYXJzZShpc29TcGVjaWZpZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBwYXJzZUlzbztcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMubWF0Y2goLy57Nn0vZykubWFwKGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gXCIjXCIgKyB4O1xuICB9KTtcbn1cbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4vY29sb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcIjFmNzdiNGZmN2YwZTJjYTAyY2Q2MjcyODk0NjdiZDhjNTY0YmUzNzdjMjdmN2Y3ZmJjYmQyMjE3YmVjZlwiKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4vY29sb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcIjM5M2I3OTUyNTRhMzZiNmVjZjljOWVkZTYzNzkzOThjYTI1MmI1Y2Y2YmNlZGI5YzhjNmQzMWJkOWUzOWU3YmE1MmU3Y2I5NDg0M2MzOWFkNDk0YWQ2NjE2YmU3OTY5YzdiNDE3M2E1NTE5NGNlNmRiZGRlOWVkNlwiKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4vY29sb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcIjMxODJiZDZiYWVkNjllY2FlMWM2ZGJlZmU2NTUwZGZkOGQzY2ZkYWU2YmZkZDBhMjMxYTM1NDc0YzQ3NmExZDk5YmM3ZTljMDc1NmJiMTllOWFjOGJjYmRkY2RhZGFlYjYzNjM2Mzk2OTY5NmJkYmRiZGQ5ZDlkOVwiKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4vY29sb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcIjFmNzdiNGFlYzdlOGZmN2YwZWZmYmI3ODJjYTAyYzk4ZGY4YWQ2MjcyOGZmOTg5Njk0NjdiZGM1YjBkNThjNTY0YmM0OWM5NGUzNzdjMmY3YjZkMjdmN2Y3ZmM3YzdjN2JjYmQyMmRiZGI4ZDE3YmVjZjllZGFlNVwiKTtcbiIsImltcG9ydCB7Y3ViZWhlbGl4fSBmcm9tIFwiZDMtY29sb3JcIjtcbmltcG9ydCB7aW50ZXJwb2xhdGVDdWJlaGVsaXhMb25nfSBmcm9tIFwiZDMtaW50ZXJwb2xhdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJwb2xhdGVDdWJlaGVsaXhMb25nKGN1YmVoZWxpeCgzMDAsIDAuNSwgMC4wKSwgY3ViZWhlbGl4KC0yNDAsIDAuNSwgMS4wKSk7XG4iLCJpbXBvcnQge2N1YmVoZWxpeH0gZnJvbSBcImQzLWNvbG9yXCI7XG5pbXBvcnQge2ludGVycG9sYXRlQ3ViZWhlbGl4TG9uZ30gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5cbmV4cG9ydCB2YXIgd2FybSA9IGludGVycG9sYXRlQ3ViZWhlbGl4TG9uZyhjdWJlaGVsaXgoLTEwMCwgMC43NSwgMC4zNSksIGN1YmVoZWxpeCg4MCwgMS41MCwgMC44KSk7XG5cbmV4cG9ydCB2YXIgY29vbCA9IGludGVycG9sYXRlQ3ViZWhlbGl4TG9uZyhjdWJlaGVsaXgoMjYwLCAwLjc1LCAwLjM1KSwgY3ViZWhlbGl4KDgwLCAxLjUwLCAwLjgpKTtcblxudmFyIHJhaW5ib3cgPSBjdWJlaGVsaXgoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odCkge1xuICBpZiAodCA8IDAgfHwgdCA+IDEpIHQgLT0gTWF0aC5mbG9vcih0KTtcbiAgdmFyIHRzID0gTWF0aC5hYnModCAtIDAuNSk7XG4gIHJhaW5ib3cuaCA9IDM2MCAqIHQgLSAxMDA7XG4gIHJhaW5ib3cucyA9IDEuNSAtIDEuNSAqIHRzO1xuICByYWluYm93LmwgPSAwLjggLSAwLjkgKiB0cztcbiAgcmV0dXJuIHJhaW5ib3cgKyBcIlwiO1xufVxuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi9jb2xvcnNcIjtcblxuZnVuY3Rpb24gcmFtcChyYW5nZSkge1xuICB2YXIgbiA9IHJhbmdlLmxlbmd0aDtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gcmFuZ2VbTWF0aC5tYXgoMCwgTWF0aC5taW4obiAtIDEsIE1hdGguZmxvb3IodCAqIG4pKSldO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCByYW1wKGNvbG9ycyhcIjQ0MDE1NDQ0MDI1NjQ1MDQ1NzQ1MDU1OTQ2MDc1YTQ2MDg1YzQ2MGE1ZDQ2MGI1ZTQ3MGQ2MDQ3MGU2MTQ3MTA2MzQ3MTE2NDQ3MTM2NTQ4MTQ2NzQ4MTY2ODQ4MTc2OTQ4MTg2YTQ4MWE2YzQ4MWI2ZDQ4MWM2ZTQ4MWQ2ZjQ4MWY3MDQ4MjA3MTQ4MjE3MzQ4MjM3NDQ4MjQ3NTQ4MjU3NjQ4MjY3NzQ4Mjg3ODQ4Mjk3OTQ3MmE3YTQ3MmM3YTQ3MmQ3YjQ3MmU3YzQ3MmY3ZDQ2MzA3ZTQ2MzI3ZTQ2MzM3ZjQ2MzQ4MDQ1MzU4MTQ1Mzc4MTQ1Mzg4MjQ0Mzk4MzQ0M2E4MzQ0M2I4NDQzM2Q4NDQzM2U4NTQyM2Y4NTQyNDA4NjQyNDE4NjQxNDI4NzQxNDQ4NzQwNDU4ODQwNDY4ODNmNDc4ODNmNDg4OTNlNDk4OTNlNGE4OTNlNGM4YTNkNGQ4YTNkNGU4YTNjNGY4YTNjNTA4YjNiNTE4YjNiNTI4YjNhNTM4YjNhNTQ4YzM5NTU4YzM5NTY4YzM4NTg4YzM4NTk4YzM3NWE4YzM3NWI4ZDM2NWM4ZDM2NWQ4ZDM1NWU4ZDM1NWY4ZDM0NjA4ZDM0NjE4ZDMzNjI4ZDMzNjM4ZDMyNjQ4ZTMyNjU4ZTMxNjY4ZTMxNjc4ZTMxNjg4ZTMwNjk4ZTMwNmE4ZTJmNmI4ZTJmNmM4ZTJlNmQ4ZTJlNmU4ZTJlNmY4ZTJkNzA4ZTJkNzE4ZTJjNzE4ZTJjNzI4ZTJjNzM4ZTJiNzQ4ZTJiNzU4ZTJhNzY4ZTJhNzc4ZTJhNzg4ZTI5Nzk4ZTI5N2E4ZTI5N2I4ZTI4N2M4ZTI4N2Q4ZTI3N2U4ZTI3N2Y4ZTI3ODA4ZTI2ODE4ZTI2ODI4ZTI2ODI4ZTI1ODM4ZTI1ODQ4ZTI1ODU4ZTI0ODY4ZTI0ODc4ZTIzODg4ZTIzODk4ZTIzOGE4ZDIyOGI4ZDIyOGM4ZDIyOGQ4ZDIxOGU4ZDIxOGY4ZDIxOTA4ZDIxOTE4YzIwOTI4YzIwOTI4YzIwOTM4YzFmOTQ4YzFmOTU4YjFmOTY4YjFmOTc4YjFmOTg4YjFmOTk4YTFmOWE4YTFlOWI4YTFlOWM4OTFlOWQ4OTFmOWU4OTFmOWY4ODFmYTA4ODFmYTE4ODFmYTE4NzFmYTI4NzIwYTM4NjIwYTQ4NjIxYTU4NTIxYTY4NTIyYTc4NTIyYTg4NDIzYTk4MzI0YWE4MzI1YWI4MjI1YWM4MjI2YWQ4MTI3YWQ4MTI4YWU4MDI5YWY3ZjJhYjA3ZjJjYjE3ZTJkYjI3ZDJlYjM3YzJmYjQ3YzMxYjU3YjMyYjY3YTM0YjY3OTM1Yjc3OTM3Yjg3ODM4Yjk3NzNhYmE3NjNiYmI3NTNkYmM3NDNmYmM3MzQwYmQ3MjQyYmU3MTQ0YmY3MDQ2YzA2ZjQ4YzE2ZTRhYzE2ZDRjYzI2YzRlYzM2YjUwYzQ2YTUyYzU2OTU0YzU2ODU2YzY2NzU4Yzc2NTVhYzg2NDVjYzg2MzVlYzk2MjYwY2E2MDYzY2I1ZjY1Y2I1ZTY3Y2M1YzY5Y2Q1YjZjY2Q1YTZlY2U1ODcwY2Y1NzczZDA1Njc1ZDA1NDc3ZDE1MzdhZDE1MTdjZDI1MDdmZDM0ZTgxZDM0ZDg0ZDQ0Yjg2ZDU0OTg5ZDU0ODhiZDY0NjhlZDY0NTkwZDc0MzkzZDc0MTk1ZDg0MDk4ZDgzZTliZDkzYzlkZDkzYmEwZGEzOWEyZGEzN2E1ZGIzNmE4ZGIzNGFhZGMzMmFkZGMzMGIwZGQyZmIyZGQyZGI1ZGUyYmI4ZGUyOWJhZGUyOGJkZGYyNmMwZGYyNWMyZGYyM2M1ZTAyMWM4ZTAyMGNhZTExZmNkZTExZGQwZTExY2QyZTIxYmQ1ZTIxYWQ4ZTIxOWRhZTMxOWRkZTMxOGRmZTMxOGUyZTQxOGU1ZTQxOWU3ZTQxOWVhZTUxYWVjZTUxYmVmZTUxY2YxZTUxZGY0ZTYxZWY2ZTYyMGY4ZTYyMWZiZTcyM2ZkZTcyNVwiKSk7XG5cbmV4cG9ydCB2YXIgbWFnbWEgPSByYW1wKGNvbG9ycyhcIjAwMDAwNDAxMDAwNTAxMDEwNjAxMDEwODAyMDEwOTAyMDIwYjAyMDIwZDAzMDMwZjAzMDMxMjA0MDQxNDA1MDQxNjA2MDUxODA2MDUxYTA3MDYxYzA4MDcxZTA5MDcyMDBhMDgyMjBiMDkyNDBjMDkyNjBkMGEyOTBlMGIyYjEwMGIyZDExMGMyZjEyMGQzMTEzMGQzNDE0MGUzNjE1MGUzODE2MGYzYjE4MGYzZDE5MTAzZjFhMTA0MjFjMTA0NDFkMTE0NzFlMTE0OTIwMTE0YjIxMTE0ZTIyMTE1MDI0MTI1MzI1MTI1NTI3MTI1ODI5MTE1YTJhMTE1YzJjMTE1ZjJkMTE2MTJmMTE2MzMxMTE2NTMzMTA2NzM0MTA2OTM2MTA2YjM4MTA2YzM5MGY2ZTNiMGY3MDNkMGY3MTNmMGY3MjQwMGY3NDQyMGY3NTQ0MGY3NjQ1MTA3NzQ3MTA3ODQ5MTA3ODRhMTA3OTRjMTE3YTRlMTE3YjRmMTI3YjUxMTI3YzUyMTM3YzU0MTM3ZDU2MTQ3ZDU3MTU3ZTU5MTU3ZTVhMTY3ZTVjMTY3ZjVkMTc3ZjVmMTg3ZjYwMTg4MDYyMTk4MDY0MWE4MDY1MWE4MDY3MWI4MDY4MWM4MTZhMWM4MTZiMWQ4MTZkMWQ4MTZlMWU4MTcwMWY4MTcyMWY4MTczMjA4MTc1MjE4MTc2MjE4MTc4MjI4MTc5MjI4MjdiMjM4MjdjMjM4MjdlMjQ4MjgwMjU4MjgxMjU4MTgzMjY4MTg0MjY4MTg2Mjc4MTg4Mjc4MTg5Mjg4MThiMjk4MThjMjk4MThlMmE4MTkwMmE4MTkxMmI4MTkzMmI4MDk0MmM4MDk2MmM4MDk4MmQ4MDk5MmQ4MDliMmU3ZjljMmU3ZjllMmY3ZmEwMmY3ZmExMzA3ZWEzMzA3ZWE1MzE3ZWE2MzE3ZGE4MzI3ZGFhMzM3ZGFiMzM3Y2FkMzQ3Y2FlMzQ3YmIwMzU3YmIyMzU3YmIzMzY3YWI1MzY3YWI3Mzc3OWI4Mzc3OWJhMzg3OGJjMzk3OGJkMzk3N2JmM2E3N2MwM2E3NmMyM2I3NWM0M2M3NWM1M2M3NGM3M2Q3M2M4M2U3M2NhM2U3MmNjM2Y3MWNkNDA3MWNmNDA3MGQwNDE2ZmQyNDI2ZmQzNDM2ZWQ1NDQ2ZGQ2NDU2Y2Q4NDU2Y2Q5NDY2YmRiNDc2YWRjNDg2OWRlNDk2OGRmNGE2OGUwNGM2N2UyNGQ2NmUzNGU2NWU0NGY2NGU1NTA2NGU3NTI2M2U4NTM2MmU5NTQ2MmVhNTY2MWViNTc2MGVjNTg2MGVkNWE1ZmVlNWI1ZWVmNWQ1ZWYwNWY1ZWYxNjA1ZGYyNjI1ZGYyNjQ1Y2YzNjU1Y2Y0Njc1Y2Y0Njk1Y2Y1NmI1Y2Y2NmM1Y2Y2NmU1Y2Y3NzA1Y2Y3NzI1Y2Y4NzQ1Y2Y4NzY1Y2Y5Nzg1ZGY5Nzk1ZGY5N2I1ZGZhN2Q1ZWZhN2Y1ZWZhODE1ZmZiODM1ZmZiODU2MGZiODc2MWZjODk2MWZjOGE2MmZjOGM2M2ZjOGU2NGZjOTA2NWZkOTI2NmZkOTQ2N2ZkOTY2OGZkOTg2OWZkOWE2YWZkOWI2YmZlOWQ2Y2ZlOWY2ZGZlYTE2ZWZlYTM2ZmZlYTU3MWZlYTc3MmZlYTk3M2ZlYWE3NGZlYWM3NmZlYWU3N2ZlYjA3OGZlYjI3YWZlYjQ3YmZlYjY3Y2ZlYjc3ZWZlYjk3ZmZlYmI4MWZlYmQ4MmZlYmY4NGZlYzE4NWZlYzI4N2ZlYzQ4OGZlYzY4YWZlYzg4Y2ZlY2E4ZGZlY2M4ZmZlY2Q5MGZlY2Y5MmZlZDE5NGZlZDM5NWZlZDU5N2ZlZDc5OWZlZDg5YWZkZGE5Y2ZkZGM5ZWZkZGVhMGZkZTBhMWZkZTJhM2ZkZTNhNWZkZTVhN2ZkZTdhOWZkZTlhYWZkZWJhY2ZjZWNhZWZjZWViMGZjZjBiMmZjZjJiNGZjZjRiNmZjZjZiOGZjZjdiOWZjZjliYmZjZmJiZGZjZmRiZlwiKSk7XG5cbmV4cG9ydCB2YXIgaW5mZXJubyA9IHJhbXAoY29sb3JzKFwiMDAwMDA0MDEwMDA1MDEwMTA2MDEwMTA4MDIwMTBhMDIwMjBjMDIwMjBlMDMwMjEwMDQwMzEyMDQwMzE0MDUwNDE3MDYwNDE5MDcwNTFiMDgwNTFkMDkwNjFmMGEwNzIyMGIwNzI0MGMwODI2MGQwODI5MGUwOTJiMTAwOTJkMTEwYTMwMTIwYTMyMTQwYjM0MTUwYjM3MTYwYjM5MTgwYzNjMTkwYzNlMWIwYzQxMWMwYzQzMWUwYzQ1MWYwYzQ4MjEwYzRhMjMwYzRjMjQwYzRmMjYwYzUxMjgwYjUzMjkwYjU1MmIwYjU3MmQwYjU5MmYwYTViMzEwYTVjMzIwYTVlMzQwYTVmMzYwOTYxMzgwOTYyMzkwOTYzM2IwOTY0M2QwOTY1M2UwOTY2NDAwYTY3NDIwYTY4NDQwYTY4NDUwYTY5NDcwYjZhNDkwYjZhNGEwYzZiNGMwYzZiNGQwZDZjNGYwZDZjNTEwZTZjNTIwZTZkNTQwZjZkNTUwZjZkNTcxMDZlNTkxMDZlNWExMTZlNWMxMjZlNWQxMjZlNWYxMzZlNjExMzZlNjIxNDZlNjQxNTZlNjUxNTZlNjcxNjZlNjkxNjZlNmExNzZlNmMxODZlNmQxODZlNmYxOTZlNzExOTZlNzIxYTZlNzQxYTZlNzUxYjZlNzcxYzZkNzgxYzZkN2ExZDZkN2MxZDZkN2QxZTZkN2YxZTZjODAxZjZjODIyMDZjODQyMDZiODUyMTZiODcyMTZiODgyMjZhOGEyMjZhOGMyMzY5OGQyMzY5OGYyNDY5OTAyNTY4OTIyNTY4OTMyNjY3OTUyNjY3OTcyNzY2OTgyNzY2OWEyODY1OWIyOTY0OWQyOTY0OWYyYTYzYTAyYTYzYTIyYjYyYTMyYzYxYTUyYzYwYTYyZDYwYTgyZTVmYTkyZTVlYWIyZjVlYWQzMDVkYWUzMDVjYjAzMTViYjEzMjVhYjMzMjVhYjQzMzU5YjYzNDU4YjczNTU3YjkzNTU2YmEzNjU1YmMzNzU0YmQzODUzYmYzOTUyYzAzYTUxYzEzYTUwYzMzYjRmYzQzYzRlYzYzZDRkYzczZTRjYzgzZjRiY2E0MDRhY2I0MTQ5Y2M0MjQ4Y2U0MzQ3Y2Y0NDQ2ZDA0NTQ1ZDI0NjQ0ZDM0NzQzZDQ0ODQyZDU0YTQxZDc0YjNmZDg0YzNlZDk0ZDNkZGE0ZTNjZGI1MDNiZGQ1MTNhZGU1MjM4ZGY1MzM3ZTA1NTM2ZTE1NjM1ZTI1NzM0ZTM1OTMzZTQ1YTMxZTU1YzMwZTY1ZDJmZTc1ZTJlZTg2MDJkZTk2MTJiZWE2MzJhZWI2NDI5ZWI2NjI4ZWM2NzI2ZWQ2OTI1ZWU2YTI0ZWY2YzIzZWY2ZTIxZjA2ZjIwZjE3MTFmZjE3MzFkZjI3NDFjZjM3NjFiZjM3ODE5ZjQ3OTE4ZjU3YjE3ZjU3ZDE1ZjY3ZTE0ZjY4MDEzZjc4MjEyZjc4NDEwZjg4NTBmZjg4NzBlZjg4OTBjZjk4YjBiZjk4YzBhZjk4ZTA5ZmE5MDA4ZmE5MjA3ZmE5NDA3ZmI5NjA2ZmI5NzA2ZmI5OTA2ZmI5YjA2ZmI5ZDA3ZmM5ZjA3ZmNhMTA4ZmNhMzA5ZmNhNTBhZmNhNjBjZmNhODBkZmNhYTBmZmNhYzExZmNhZTEyZmNiMDE0ZmNiMjE2ZmNiNDE4ZmJiNjFhZmJiODFkZmJiYTFmZmJiYzIxZmJiZTIzZmFjMDI2ZmFjMjI4ZmFjNDJhZmFjNjJkZjljNzJmZjljOTMyZjljYjM1ZjhjZDM3ZjhjZjNhZjdkMTNkZjdkMzQwZjZkNTQzZjZkNzQ2ZjVkOTQ5ZjVkYjRjZjRkZDRmZjRkZjUzZjRlMTU2ZjNlMzVhZjNlNTVkZjJlNjYxZjJlODY1ZjJlYTY5ZjFlYzZkZjFlZDcxZjFlZjc1ZjFmMTc5ZjJmMjdkZjJmNDgyZjNmNTg2ZjNmNjhhZjRmODhlZjVmOTkyZjZmYTk2ZjhmYjlhZjlmYzlkZmFmZGExZmNmZmE0XCIpKTtcblxuZXhwb3J0IHZhciBwbGFzbWEgPSByYW1wKGNvbG9ycyhcIjBkMDg4NzEwMDc4ODEzMDc4OTE2MDc4YTE5MDY4YzFiMDY4ZDFkMDY4ZTIwMDY4ZjIyMDY5MDI0MDY5MTI2MDU5MTI4MDU5MjJhMDU5MzJjMDU5NDJlMDU5NTJmMDU5NjMxMDU5NzMzMDU5NzM1MDQ5ODM3MDQ5OTM4MDQ5YTNhMDQ5YTNjMDQ5YjNlMDQ5YzNmMDQ5YzQxMDQ5ZDQzMDM5ZTQ0MDM5ZTQ2MDM5ZjQ4MDM5ZjQ5MDNhMDRiMDNhMTRjMDJhMTRlMDJhMjUwMDJhMjUxMDJhMzUzMDJhMzU1MDJhNDU2MDFhNDU4MDFhNDU5MDFhNTViMDFhNTVjMDFhNjVlMDFhNjYwMDFhNjYxMDBhNzYzMDBhNzY0MDBhNzY2MDBhNzY3MDBhODY5MDBhODZhMDBhODZjMDBhODZlMDBhODZmMDBhODcxMDBhODcyMDFhODc0MDFhODc1MDFhODc3MDFhODc4MDFhODdhMDJhODdiMDJhODdkMDNhODdlMDNhODgwMDRhODgxMDRhNzgzMDVhNzg0MDVhNzg2MDZhNjg3MDdhNjg4MDhhNjhhMDlhNThiMGFhNThkMGJhNThlMGNhNDhmMGRhNDkxMGVhMzkyMGZhMzk0MTBhMjk1MTFhMTk2MTNhMTk4MTRhMDk5MTU5ZjlhMTY5ZjljMTc5ZTlkMTg5ZDllMTk5ZGEwMWE5Y2ExMWI5YmEyMWQ5YWEzMWU5YWE1MWY5OWE2MjA5OGE3MjE5N2E4MjI5NmFhMjM5NWFiMjQ5NGFjMjY5NGFkMjc5M2FlMjg5MmIwMjk5MWIxMmE5MGIyMmI4ZmIzMmM4ZWI0MmU4ZGI1MmY4Y2I2MzA4YmI3MzE4YWI4MzI4OWJhMzM4OGJiMzQ4OGJjMzU4N2JkMzc4NmJlMzg4NWJmMzk4NGMwM2E4M2MxM2I4MmMyM2M4MWMzM2Q4MGM0M2U3ZmM1NDA3ZWM2NDE3ZGM3NDI3Y2M4NDM3YmM5NDQ3YWNhNDU3YWNiNDY3OWNjNDc3OGNjNDk3N2NkNGE3NmNlNGI3NWNmNGM3NGQwNGQ3M2QxNGU3MmQyNGY3MWQzNTE3MWQ0NTI3MGQ1NTM2ZmQ1NTQ2ZWQ2NTU2ZGQ3NTY2Y2Q4NTc2YmQ5NTg2YWRhNWE2YWRhNWI2OWRiNWM2OGRjNWQ2N2RkNWU2NmRlNWY2NWRlNjE2NGRmNjI2M2UwNjM2M2UxNjQ2MmUyNjU2MWUyNjY2MGUzNjg1ZmU0Njk1ZWU1NmE1ZGU1NmI1ZGU2NmM1Y2U3NmU1YmU3NmY1YWU4NzA1OWU5NzE1OGU5NzI1N2VhNzQ1N2ViNzU1NmViNzY1NWVjNzc1NGVkNzk1M2VkN2E1MmVlN2I1MWVmN2M1MWVmN2U1MGYwN2Y0ZmYwODA0ZWYxODE0ZGYxODM0Y2YyODQ0YmYzODU0YmYzODc0YWY0ODg0OWY0ODk0OGY1OGI0N2Y1OGM0NmY2OGQ0NWY2OGY0NGY3OTA0NGY3OTE0M2Y3OTM0MmY4OTQ0MWY4OTU0MGY5OTczZmY5OTgzZWY5OWEzZWZhOWIzZGZhOWMzY2ZhOWUzYmZiOWYzYWZiYTEzOWZiYTIzOGZjYTMzOGZjYTUzN2ZjYTYzNmZjYTgzNWZjYTkzNGZkYWIzM2ZkYWMzM2ZkYWUzMmZkYWYzMWZkYjEzMGZkYjIyZmZkYjQyZmZkYjUyZWZlYjcyZGZlYjgyY2ZlYmEyY2ZlYmIyYmZlYmQyYWZlYmUyYWZlYzAyOWZkYzIyOWZkYzMyOGZkYzUyN2ZkYzYyN2ZkYzgyN2ZkY2EyNmZkY2IyNmZjY2QyNWZjY2UyNWZjZDAyNWZjZDIyNWZiZDMyNGZiZDUyNGZiZDcyNGZhZDgyNGZhZGEyNGY5ZGMyNGY5ZGQyNWY4ZGYyNWY4ZTEyNWY3ZTIyNWY3ZTQyNWY2ZTYyNmY2ZTgyNmY1ZTkyNmY1ZWIyN2Y0ZWQyN2YzZWUyN2YzZjAyN2YyZjIyN2YxZjQyNmYxZjUyNWYwZjcyNGYwZjkyMVwiKSk7XG4iLCJpbXBvcnQgUmVhY3RpdmVNb2RlbCBmcm9tIFwicmVhY3RpdmUtbW9kZWxcIjtcbmltcG9ydCBTVkcgZnJvbSBcIi4uL21peGlucy9zdmdcIjtcbmltcG9ydCBEYXRhIGZyb20gXCIuLi9taXhpbnMvZGF0YVwiO1xuaW1wb3J0IE1hcmdpbiBmcm9tIFwiLi4vbWl4aW5zL21hcmdpblwiO1xuaW1wb3J0IENvbHVtbiBmcm9tIFwiLi4vbWl4aW5zL2NvbHVtblwiO1xuaW1wb3J0IFNjYWxlIGZyb20gXCIuLi9taXhpbnMvc2NhbGVcIjtcblxuaW1wb3J0IHsgZXh0ZW50LCBtYXggfSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCB7IHNjYWxlTGluZWFyLCBzY2FsZVNxcnQgfSBmcm9tIFwiZDMtc2NhbGVcIjtcblxuaW1wb3J0IHsgbG9jYWwgfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENpcmNsZSgpe1xuICByZXR1cm4gUmVhY3RpdmVNb2RlbCgpXG4gICAgLmNhbGwoU1ZHKVxuICAgIC5jYWxsKE1hcmdpbilcbiAgICAuY2FsbChEYXRhKVxuXG4gICAgLmNhbGwoQ29sdW1uLCBcInhcIilcbiAgICAuY2FsbChDb2x1bW4sIFwieVwiKVxuICAgIC5jYWxsKENvbHVtbiwgXCJzaXplXCIpXG5cbiAgICAvLyBUaGUgeCBzY2FsZS5cbiAgICAoXCJ4RG9tYWluXCIsIGZ1bmN0aW9uIChkYXRhLCBhY2Nlc3Nvcil7XG4gICAgICByZXR1cm4gZXh0ZW50KGRhdGEsIGFjY2Vzc29yKTtcbiAgICB9LCBcImRhdGEsIHhBY2Nlc3NvclwiKVxuICAgIChcInhSYW5nZVwiLCBmdW5jdGlvbiAoaW5uZXJXaWR0aCl7XG4gICAgICByZXR1cm4gWzAsIGlubmVyV2lkdGhdO1xuICAgIH0sIFwiaW5uZXJXaWR0aFwiKVxuICAgIC5jYWxsKFNjYWxlLCBcInhcIiwgc2NhbGVMaW5lYXIpXG5cbiAgICAvLyBUaGUgeSBzY2FsZS5cbiAgICAoXCJ5RG9tYWluXCIsIGZ1bmN0aW9uIChkYXRhLCBhY2Nlc3Nvcil7XG4gICAgICByZXR1cm4gZXh0ZW50KGRhdGEsIGFjY2Vzc29yKTtcbiAgICB9LCBcImRhdGEsIHlBY2Nlc3NvclwiKVxuICAgIChcInlSYW5nZVwiLCBmdW5jdGlvbiAoaW5uZXJIZWlnaHQpe1xuICAgICAgcmV0dXJuIFtpbm5lckhlaWdodCwgMF07XG4gICAgfSwgXCJpbm5lckhlaWdodFwiKVxuICAgIC5jYWxsKFNjYWxlLCBcInlcIiwgc2NhbGVMaW5lYXIpXG5cbiAgICAvLyBUaGUgc2l6ZSBzY2FsZS5cbiAgICAoXCJzaXplTWF4XCIsIDIwKVxuICAgIChcInNpemVEb21haW5cIiwgZnVuY3Rpb24gKGRhdGEsIGFjY2Vzc29yKXtcbiAgICAgIHJldHVybiBbMCwgbWF4KGRhdGEsIGFjY2Vzc29yKV07XG4gICAgfSwgXCJkYXRhLCBzaXplQWNjZXNzb3JcIilcbiAgICAoXCJzaXplUmFuZ2VcIiwgZnVuY3Rpb24gKHNpemVNYXgpe1xuICAgICAgcmV0dXJuIFswLCBzaXplTWF4XTtcbiAgICB9LCBcInNpemVNYXhcIilcbiAgICAuY2FsbChTY2FsZSwgXCJzaXplXCIsIHNjYWxlU3FydClcblxuICAgIC8vIFRoaXMgaXMgdGhlIHNpbmdsZSBTVkcgZ3JvdXAgZm9yIHRoZSBzY2F0dGVyIGxheWVyLlxuICAgIChcInNjYXR0ZXJMYXllclwiLCBmdW5jdGlvbiAoZyl7XG5cbiAgICAgIHZhciBzY2F0dGVyTGF5ZXIgPSBnLnNlbGVjdEFsbChcIi5yZWFjdGl2ZS12aXMtc2NhdHRlci1sYXllclwiKVxuICAgICAgICAuZGF0YShbMV0pO1xuXG4gICAgICByZXR1cm4gc2NhdHRlckxheWVyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJyZWFjdGl2ZS12aXMtc2NhdHRlci1sYXllclwiKVxuICAgICAgICAubWVyZ2Uoc2NhdHRlckxheWVyKTtcblxuICAgIH0sIFwiZ1wiKVxuXG4gICAgLy8gVGhpcyBpcyB0aGUgc2VsZWN0aW9uIG9mIG1hbnkgZyBlbGVtZW50cywgY29ycmVzcG9uZGluZyB0byB0aGUgZGF0YS5cbiAgICAoXCJtYXJrc1wiLCBmdW5jdGlvbiAoc2NhdHRlckxheWVyLCBkYXRhLCB4U2NhbGVkLCB5U2NhbGVkLCBzaXplU2NhbGVkKXtcblxuICAgICAgdmFyIHNjYXR0ZXIgPSBzY2F0dGVyTGF5ZXIuc2VsZWN0QWxsKFwiLnJlYWN0aXZlLXZpcy1zY2F0dGVyLW1hcmtcIilcbiAgICAgICAgLmRhdGEoZGF0YSk7XG5cbiAgICAgIHNjYXR0ZXIuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICB2YXIgc2l6ZUxvY2FsID0gbG9jYWwoKTtcblxuICAgICAgdmFyIG1hcmtzID0gc2NhdHRlci5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwicmVhY3RpdmUtdmlzLXNjYXR0ZXItbWFya1wiKVxuICAgICAgICAubWVyZ2Uoc2NhdHRlcilcbiAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCl7XG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4U2NhbGVkKGQpICsgXCIsXCIgKyB5U2NhbGVkKGQpICsgXCIpXCI7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBzaXplTG9jYWwuc2V0KHRoaXMsIHNpemVTY2FsZWQoZCkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICBtYXJrcy5zaXplTG9jYWwgPSBzaXplTG9jYWw7XG5cbiAgICAgIHJldHVybiBtYXJrcztcbiAgICB9LCBcInNjYXR0ZXJMYXllciwgZGF0YSwgeFNjYWxlZCwgeVNjYWxlZCwgc2l6ZVNjYWxlZFwiKTtcbn1cbiIsImltcG9ydCBSZWFjdGl2ZU1vZGVsIGZyb20gXCJyZWFjdGl2ZS1tb2RlbFwiO1xuXG4vLyBNaXhpbnNcbmltcG9ydCBTVkcgICAgZnJvbSBcIi4vbWl4aW5zL3N2Z1wiO1xuaW1wb3J0IE1hcmdpbiBmcm9tIFwiLi9taXhpbnMvbWFyZ2luXCI7XG5pbXBvcnQgRGF0YSAgIGZyb20gXCIuL21peGlucy9kYXRhXCI7XG5pbXBvcnQgQ29sdW1uIGZyb20gXCIuL21peGlucy9jb2x1bW5cIjtcbmltcG9ydCBTY2FsZSAgZnJvbSBcIi4vbWl4aW5zL3NjYWxlXCI7XG5pbXBvcnQgUmVzaXplIGZyb20gXCIuL21peGlucy9yZXNpemVcIjtcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IENpcmNsZSAgZnJvbSBcIi4vY29tcG9uZW50cy9jaXJjbGVcIjtcbmltcG9ydCBTY2F0dGVyIGZyb20gXCIuL2NvbXBvbmVudHMvc2NhdHRlclwiO1xuXG4vLyBUaGlzIG5lZWRzIHRvIGJlIHVzZWQgdG8gY29uc3RydWN0IFJlYWN0aXZlTW9kZWwgaW5zdGFuY2VzLFxuLy8gYmVjYXVzZSBpdCBpcyB0aGUgdmVyc2lvbiB0aGF0J3MgYnVuZGxlZCB3aXRoaW4gUmVhY3RpdmVWaXMuXG4vLyBJZiBhbiBleHRlcm5hbGx5IGxvYWRlZCBpbnN0YW5jZSBvZiB0aGUgUmVhY3RpdmVNb2RlbCBtb2R1bGVcbi8vIChmcm9tIE5QTSkgaXMgdXNlZCwgdGhlIFwiZGlnZXN0XCIgZnVuY3Rpb24gd29uJ3Qgd29yayBjb3JyZWN0bHksXG4vLyBiZWNhdXNlIHRoZSB0d28gbW9kdWxlcyBoYXZlIGRpZmZlcmVudCBkYXRhIGZsb3cgZ3JhcGhzLlxuZXhwb3J0IHZhciBNb2RlbCA9IFJlYWN0aXZlTW9kZWw7XG5cbi8vIEV4cG9zZSBkaWdlc3QgYXQgdGhpcyBsZXZlbCBmb3IgY29udmVuaWVuY2UuXG5leHBvcnQgdmFyIGRpZ2VzdCA9IFJlYWN0aXZlTW9kZWwuZGlnZXN0O1xuXG5leHBvcnQge1xuICBTVkcsXG4gIE1hcmdpbixcbiAgRGF0YSxcbiAgQ29sdW1uLFxuICBTY2FsZSxcbiAgUmVzaXplLFxuXG4gIENpcmNsZSxcbiAgU2NhdHRlclxufTtcbiJdLCJuYW1lcyI6WyJ0aGlzIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDAiLCJlbGVtZW50IiwibWF0Y2hlciIsImFzY2VuZGluZyIsImFzY2VuZGluZ0NvbXBhcmF0b3IiLCJhc2NlbmRpbmdCaXNlY3QiLCJiaXNlY3RvciIsImJpc2VjdFJpZ2h0IiwiZTEwIiwiZTUiLCJlMiIsInRpY2tTdGVwIiwicmFuZ2UiLCJhcnJheSIsIm1hcCIsInNsaWNlIiwiZGVmaW5lIiwicmdiIiwiaHNsIiwiaGNsIiwibGluZWFyIiwiY29uc3RhbnQiLCJ2YWx1ZSIsIm51bWJlciIsImN1YmVoZWxpeCIsImNvbG9yQ3ViZWhlbGl4IiwiY29sb3IiLCJjdWJlaGVsaXhMb25nIiwiZGVpbnRlcnBvbGF0ZUxpbmVhciIsImJpc2VjdCIsImRlaW50ZXJwb2xhdGUiLCJpZGVudGl0eSIsInRpY2tzIiwicmFpc2UiLCJ0MCIsInQxIiwiaW50ZXJ2YWwiLCJkdXJhdGlvblNlY29uZCIsImR1cmF0aW9uTWludXRlIiwiZHVyYXRpb25Ib3VyIiwiZHVyYXRpb25EYXkiLCJkdXJhdGlvbldlZWsiLCJzdW5kYXkiLCJtb25kYXkiLCJ1dGNTdW5kYXkiLCJkZWZhdWx0TG9jYWxlIiwiZm9ybWF0TG9jYWxlIiwidGltZURheSIsInRpbWVZZWFyIiwiQ2lyY2xlIiwic2NhbGVMaW5lYXIiLCJzY2FsZVNxcnQiXSwibWFwcGluZ3MiOiI7Ozs7OztDQUNPLElBQUksY0FBYyxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsR0FBRyxNQUFNLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLElBQUksS0FBSyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUU7O0FBRXJKLEFBQU8sQ0FBQSxTQUFTLG9CQUFvQixDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDakQsQ0FBQSxDQUFDLE9BQU8sTUFBTSxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1B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Q0FBQSxRQUFRLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNuRSxDQUFBLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixDQUFBLE9BQU87QUFDUCxDQUFBLEtBQUs7QUFDTCxDQUFBLEdBQUc7O0FBRUgsQ0FBQSxFQUFFLE9BQU8sSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLENBQUEsQ0FBQzs7QUNiRCwwQkFBdUIsQ0FBQyxLQUFLLEVBQUU7QUFDL0IsQ0FBQSxFQUFFLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxFQUFFLEtBQUssR0FBR0MsU0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUxRCxDQUFBLEVBQUUsS0FBSyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDbEcsQ0FBQSxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDekcsQ0FBQSxNQUFNLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVB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LENBQUMsU0FBUyxFQUFFOztBQUVuQyxDQUFBLEVBQUUsS0FBSyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQzNLLENBQUEsSUFBSSxLQUFLLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNySSxDQUFBLE1BQU0sSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN6QyxDQUFBLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN4QixDQUFBLE9BQU87QUFDUCxDQUFBLEtBQUs7QUFDTCxDQUFBLEdBQUc7O0FBRUgsQ0FBQSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUN0QixDQUFBLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixDQUFBLEdBQUc7O0FBRUgsQ0FBQSxFQUFFLE9BQU8sSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxDQUFBLENBQUM7O0FDakJELHlCQUF1QixHQUFHOztBQUUxQixDQUFBLEVBQUUsS0FBSyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUc7QUFDdkUsQ0FBQSxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDeEYsQ0FBQSxNQUFNLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMzQixDQUFBLFFBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hGLENBQUEsUUFBUSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLENBQUEsT0FBTztBQUNQLENBQUEsS0FBSztBQUNMLENBQUEsR0FBRzs7QUFFSCxDQUFBLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFBLENBQUM7O0FDVkQsd0JBQXVCLENBQUMsT0FBTyxFQUFFO0FBQ2pDLENBQUEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sR0FBRyxTQUFTLENBQUM7O0FBRXBDLENBQUEsRUFBRSxTQUFTLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzdCLENBQUEsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUEsR0FBRzs7QUFFSCxDQUFBLEVBQUUsS0FBSyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDbkcsQ0FBQSxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNySCxDQUFBLE1BQU0sSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzNCLENBQUEsUUFBUSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzVCLENBQUEsT0FBTztBQUNQLENBQUEsS0FBSztBQUNMLENBQUEsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2hDLENBQUEsR0FBRzs7QUFFSCxDQUFBLEVBQUUsT0FBTyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzFELENBQUEsQ0FBQzs7QUFFRCxDQUFBLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekIsQ0FBQSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FB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QUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFCLENBQUEsQ0FBQzs7Q0MzQkQsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQzVCLENBQUEsRUFBRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEMsQ0FBQSxDQUFDOztBQUVELENBQUEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ3pCLENBQUEsRUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsQ0FBQSxDQUFDOztBQUVELENBQUEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ3pCLENBQUEsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNwQixDQUFBLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM3RCxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLENBQUMsU0FBUyxHQUFHO0FBQ3RCLENBQUEsRUFBRSxHQUFHLEVBQUUsU0FBUyxJQUFJLEVBQUU7QUFDdEIsQ0FBQSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLENBQUEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDZixDQUFBLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsQ0FBQSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUEsS0FBSztBQUNMLENBQUEsR0FBRztBQUNILENBQUEsRUFBRSxNQUFNLEVBQUUsU0FB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QUM7QUFDUixDQUFBLEVBQUUsTUFBTSxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzlDLENBQUEsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkssQ0FBQSxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM1RCxDQUFBLFFBQVEsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0RSxDQUFBLFFBQVEsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMxRyxDQUFBLFFBQVEsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkUsQ0FBQSxRQUFRLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNHLENBQUEsUUFBUSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQy9FLENBQUEsUUFBUSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25GLENBQUEsUUFBUSxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUQsQ0FBQSxRQUFRLE1BQU0sS0FBSyxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVELENBQUEsUUFBUSxJQUFJLENBQUM7QUFDYixDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDakIsQ0FBQSxFQUFFLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDOUIsQ0FBQSxFQUFFLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDOUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxHQUFHLENBQUM7QUFDekIsQ0FBQSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZCxDQUFBLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0MsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTQyxRQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO0FBQ3RDLENBQUEsRUFBRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNsRyxDQUFBLENBQUM7O0FBRUQsQUFBTyxDQUFBLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtBQUN0QyxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNkLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2QsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZCxDQUFBLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUMxQixDQUFBLENBQUM7O0FBRURELFNBQU0sQ0FBQyxHQUFHLEVBQUVDLFFBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQy9CLENBQUEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUU7QUFDeEIsQ0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFBLElBQUksT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckUsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRTtBQUN0QixDQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUEsSUFBSSxPQUFPLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRSxDQUFBLEdBQUc7QUFDSCxDQUFBLEVBQUUsR0FBRyxFQUFFLFdBQVc7QUFDbEIsQ0FBQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUEsR0FBRztBQUNILENBQUEsRUFBRSxXQUFXLEVBQUUsV0FBVztBQUMxQixDQUFBLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3pDLENBQUEsV0FBVyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3pDLENBQUEsV0FBVyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3pDLENBQUEsV0FBVyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEQsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxFQUFFLFFBQVEsRUFBRSxXQUFXO0FBQ3ZCLENBQUEsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RSxDQUFBLElBQUksT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUN2QyxDQUFBLFVBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJO0FBQ3BFLENBQUEsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7QUFDcEUsQ0FBQSxVQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUEsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDM0MsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVKLENBQUEsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzFCLENBQUEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzlCLENBQUEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN6QyxDQUFBLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDM0IsQ0FBQSxFQUFFLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDOUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQztBQUN6QixDQUFBLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2QsQ0FBQSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRztBQUNuQixDQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRztBQUNuQixDQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRztBQUNuQixDQUFBLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsQ0FBQSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLENBQUEsTUFBTSxDQUFDLEdBQUcsR0FBRztBQUNiLENBQUEsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFDbkIsQ0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsQ0FBQSxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ1QsQ0FBQSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRCxDQUFBLFNBQVMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLENBQUEsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUM3QyxDQUFBLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLENBQUEsR0FBRyxNQUFNO0FBQ1QsQ0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixDQUFBLEdBQUc7QUFDSCxDQUFBLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTQyxRQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO0FBQ3RDLENBQUEsRUFBRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNsRyxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUU7QUFDL0IsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZCxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNkLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2QsQ0FBQSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDMUIsQ0FBQSxDQUFDOztBQUVERixTQUFNLENBQUMsR0FBRyxFQUFFRSxRQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUMvQixDQUFBLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFO0FBQ3hCLENBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckQsQ0FBQSxJQUFJLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3RCxDQUFBLEdBQUc7QUFDSCxDQUFBLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFO0FBQ3RCLENBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQSxJQUFJLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3RCxDQUFBLEdBQUc7QUFDSCxDQUFBLEVBQUUsR0FBRyxFQUFFLFdBQVc7QUFDbEIsQ0FBQSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHO0FBQzdDLENBQUEsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ2xELENBQUEsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDbEIsQ0FBQSxRQUFRLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUMxQyxDQUFBLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLENBQUEsSUFBSSxPQUFPLElBQUksR0FBRztBQUNsQixDQUFB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LEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoRixDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDdkIsQ0FBQSxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsQ0FBQSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3pDLENBQUEsRUFBRSxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEYsQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTRyxRQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO0FBQ3RDLENBQUEsRUFBRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNsRyxDQUFBLENBQUM7O0FBRUQsQUFBTyxDQUFBLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtBQUN0QyxDQUFBLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNkLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2QsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZCxDQUFBLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUMxQixDQUFBLENBQUM7O0FBRURILFNBQU0sQ0FBQyxHQUFHLEVBQUVHLFFBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQy9CLENBQUEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUU7QUFDeEIsQ0FBQSxJQUFJLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BGLENBQUEsR0FBRztBQUNILENBQUEsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLEVBQUU7QUFDdEIsQ0FBQSxJQUFJLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BGLENB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QUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkUsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxFQUFFLEdBQUcsRUFBRSxXQUFXO0FBQ2xCLENBQUEsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTztBQUN4RCxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkIsQ0FBQSxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEQsQ0FBQSxRQUFRLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxQixDQUFBLFFBQVEsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsQ0FBQSxJQUFJLE9BQU8sSUFBSSxHQUFHO0FBQ2xCLENBQUEsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDM0MsQ0FBQSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMzQyxDQUFBLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNoQyxDQUFBLE1BQU0sSUFBSSxDQUFDLE9BQU87QUFDbEIsQ0FBQSxLQUFLLENBQUM7QUFDTixDQUFBLEdBQUc7QUFDSCxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FDNURKLG9CQUF1QixDQUFDLENBQUMsRUFBRTtBQUMzQixDQUFBLEVBQUUsT0FBTyxXQUFXO0FBQ3BCLENBQUEsSUFBSSxPQUFPLENBQUMsQ0FBQztBQUNiLENBQUEsR0FBRyxDQUFDO0FBQ0osQ0FBQSxDQUFDOztDQ0ZELFNBQVNJLFFBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RCLENBQUEsRUFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFO0FBQ3JCLENBQUEsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUEsR0FBRyxDQUFDO0FBQ0osQ0FBQSxDQUFDOztBQUVELENBQUEsU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDOUIsQ0FBQSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUU7QUFDNUUsQ0FBQSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxDQUFBLEdBQUcsQ0FBQztBQUNKLENBQUEsQ0FBQzs7QUFFRCxBQUFPLENBQUEsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMxQixDQUFBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixDQUFBLEVBQUUsT0FBTyxDQUFDLEdBQUdBLFFBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBR0MsVUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0csQ0FBQSxDQUFDOztBQUVELEFBQU8sQ0FBQSxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDekIsQ0FBQSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuRCxDQUFBLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHQSxVQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRSxDQUFBLEdBQUcsQ0FBQztBQUNKLENBQUEsQ0FBQzs7QUFFRCxBQUFlLENBQUEsU0FBUyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0QyxDQUFBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixDQUFBLEVBQUUsT0FBTyxDQUFDLEdBQUdELFFBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUdDLFVBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUEsQ0FBQzs7QUN2QkQsV0FBZSxDQUFDLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNyQyxDQUFBLEVBQUUsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV2QixDQUFBLEVBQUUsU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtBQUMzQixDQUFBLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENB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QUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUU7QUFDOUIsQ0FBQSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMzQixDQUFBLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMzQixDQUFBLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLENBQUEsS0FBSztBQUNMLENBQUEsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3ZDLENBQUEsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNCLENBQUEsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkIsQ0FBQSxLQUFLLE1BQU07QUFDWCxDQUFBLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLENBQUEsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUVDLGFBQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLENBQUEsS0FBSztBQUNMLENBQUEsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztBQUN2QixDQUFBLEdBQUc7O0FBRUgsQ0FBQTtBQUNBLENBQUEsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3JCLENBQUEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FB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LFNBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRTtBQUM5RCxDQUFBLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ25ELENBQUEsTUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUEsTUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRWIsQ0FBQTtBQUNBLENBQUEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDN0IsQ0FBQSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEMsQ0FBQSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEMsQ0FBQSxHQUFHOztBQUVILENBQUEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNsQixDQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELENBQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQSxHQUFHOztBQUVILENBQUEsRUFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFO0FBQ3JCLENBQUEsSUFBSSxJQUFJLENBQUMsR0FBR1EsYUFBTSxDQUFD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VyxDQUFDLE1BQU0sQ0FBQztBQUM3QixDQUFBLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVc7QUFDOUIsQ0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUM1RCxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDcEUsQ0FBQSxRQUFRLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLENBQUEsQ0FBQzs7QUNiRCx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzlCLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLENBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN4QixDQUFBLEVBQUUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixDQUFBLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixDQUFBLEVBQUUsT0FBTyxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXO0FBQzNFLENBQUEsUUFBUSxXQUFXLENBQUMsTUFBTSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDdEgsQ0FBQSxRQUFRLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0UsQ0FBQSxDQUFDOztBQ05ELG1CQUFlO0FBQ2YsQ0FBQSxFQUFFLEVBQUUsRUFBRSxhQUFhO0FBQ25CLENBQUEsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN0RCxDQUFBLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3hELENBQUEsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRTtBQUNyQyxDQUFBLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ3pELENBQUEsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDcEQsQ0FBQSxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFD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LENBQUE7QUFDQSxDQUFBLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsS0FBSyxHQUFHLEdBQUcsQ0FBQzs7QUFFcEYsQ0FBQSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ25CLENBQUEsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQixDQUFBLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbkIsQ0FBQSxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3ZCLENBQUEsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNuQixDQUFBLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDckIsQ0FBQSxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLENBQUEsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM3QixDQUFBLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbkIsQ0FBQSxDQUFDOztBQUVELENBQUEsZUFBZSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsV0FBVztBQUNoRCxDQUFBLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSTtBQUNsQixDQUFBLFFBQVEsSUFBSSxDQUFDLEtBQUs7QUFDbEIsQ0FBQSxRQUFRLElBQUksQ0FBQyxJQUFJO0FBQ2pCLENBQUEsUUFBUSxJQUFJLENBQUMsTUFBTTtBQUNuQixDQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDOUIsQ0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxF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QyxXQUFXLEVBQUUsR0FBRyxFQUFFO0FBQ3JILENBQUEsUUFBUSxNQUFNLEdBQUcsTUFBTSxLQUFLLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDOztBQUU3RSxDQUFBO0FBQ0EsQ0FBQTtBQUNBLENBQUE7QUFDQSxDQUFBLElBQUksSUFBSSxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztBQUN0QyxDQUFBLFFBQVEsV0FBVyxHQUFHLENBQUMsSUFBSSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZELENBQUE7QUFDQSxDQUFBO0FBQ0EsQ0FBQTtBQUNBLENBQUE7QUFDQSxDQUFBLElBQUksU0FBUyxHQUFHLFNBQVMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuRCxDQUFBLFVBQVUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNwRSxDQUFBLFVBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQzs7QUFFL0MsQ0FBQSxJQUFJLFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUMzQixDQUFBLE1BQU0sSUFBSSxXQUFXLEdBQUcsTUFBTTtBQUM5QixDQUFBLFVBQVUsV0FBVyxHQUFHLE1BQU07QUFDOUIsQ0FBQSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVsQixDQUFBLE1BQU0sSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO0FBQ3hCLENBQUEsUUFBUSxXQUFXLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLFdB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QUFNO0FBQ3BCLENBQUEsYUFBYTtBQUNiLENBQUEsV0FBVztBQUNYLENBQUEsU0FBUztBQUNULENBQUEsT0FBTzs7QUFFUCxDQUFBO0FBQ0EsQ0FBQSxNQUFNLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUV6RCxDQUFBO0FBQ0EsQ0FBQSxNQUFNLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTTtBQUN6RSxDQUFBLFVBQVUsT0FBTyxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVuRixDQUFBO0FBQ0EsQ0FBQSxNQUFNLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsRUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUU5SCxDQUFBO0FBQ0EsQ0FBQSxNQUFNLFFBQVEsS0FBSztBQUNuQixDQUFBLFFBQVEsS0FBSyxHQUFHLEVBQUUsT0FBTyxXQUFXLEdBQUcsS0FBSyxHQUFHLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDckUsQ0FBQSxRQUFRLEtBQUssR0FBRyxFQUFFLE9BQU8sV0FBVyxHQUFHLE9BQU8sR0FBRyxLQUFLLEdBQUcsV0FBVyxDQUFDO0FBQ3JFLENBQUEsUUFBUSxLQUFLLEdBQUcsRUFBRSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQVcsR0FBRyxLQUFLLEdBQUcsV0FBVyxHQUFH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QUFFLFNBQVMsRUFBRTtBQUNsRCxDQUFBLEVBQUUsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN2QixDQUFBLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN0QyxDQUFBLE1BQU0sSUFBSSxHQUFHcEIsVUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzlELENBQUEsTUFBTSxTQUFTLENBQUM7QUFDaEIsQ0FBQSxFQUFFLFNBQVMsR0FBRyxlQUFlLENBQUMsU0FBUyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDcEUsQ0FBQSxFQUFFLFFBQVEsU0FBUyxDQUFDLElBQUk7QUFDeEIsQ0FBQSxJQUFJLEtBQUssR0FBRyxFQUFFO0FBQ2QsQ0FBQSxNQUFNLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUQsQ0FBQSxNQUFNLElBQUksU0FBUyxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzSCxDQUFBLE1BQU0sT0FBTyxZQUFZLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLENBQUEsS0FBSztBQUNMLENBQUEsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLENBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQztBQUNiLENBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQztBQUNiLENBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQztBQUNiLENBQUEsSUFBSSxLQUFLLEdBQUcsRUFBRTtBQUNk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QUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUEsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixDQUFBLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQSxHQUFHO0FBQ0gsQ0FBQSxFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELENBQUEsQ0FBQzs7QUFFRCxDQUFBLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRTtBQUNwQixDQUFBLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRTtBQUM3QixDQUFBLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsQ0FBQSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLENBQUEsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFBLEdBQUc7QUFDSCxDQUFBLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxD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QUUxRCxDQUFBLE1BQU0sT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdEIsQ0FBQSxRQUFRLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7QUFDNUMsQ0FBQSxVQUFVLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxDQUFBLFVBQVUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekYsQ0FBQSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDM0MsQ0FBQSxVQUFVLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN6RCxDQUFBLFVBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixDQUFBLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsQ0FBQSxTQUFTO0FBQ1QsQ0FBQSxPQUFPOztBQUVQLENBQUEsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQSxNQUFNLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QixDQUFBLEtBQUssQ0FBQztBQUNOLENBQUEsR0FBRzs7QUFFSCxDQUFBLEVBQUUsU0FBUyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtBQUN4QyxDQUFBLElBQUksT0FBTyxTQUFTLE1BQU0sRUFBRTtBQUM1QixDQUFBLE1BQU0sSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUMzQixDQUFBLFVBQVUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUQsQ0FBQSxNQUFNLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUM7O0FBRTFDLENBQUE7QUFDQSxDQUFBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRTlDLENBQUE7QUFDQSxDQUFBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7QUFDaEMsQ0FBQSxRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxDQUFBLFFBQVEsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEcsQ0FBQSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLENBQUEsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxH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QUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQy9FLENBQUEsQ0FBQzs7QUFFRCxDQUFBLFNBQVMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7QUFDeEMsQ0FBQSxFQUFFLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEQsQ0FBQSxDQUFDOztBQUVELENBQUEsU0FBUyxlQUFlLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7QUFDdkMsQ0FBQSxFQUFFLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUEsQ0FBQzs7QUFFRCxDQUFBLFNBQVMsY0FBYyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQ3RDLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLFdBQVcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUNuQyxDQUFBLEVBQUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxDQUFBLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQSxDQUFDOztBQUVELENBQUEsU0FBUyxZQUFZLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7QUFDcEMsQ0FBQSxFQUFFLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUEsQ0FBQzs7QUFFRCxDQUFBLFNBQVMsWUFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQ3BDLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLGlCQUFpQixDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQ3pDLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFBLENBQUM7O0FBRUQsQ0FBQSxTQUFTLG1CQUFtQixDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQzNDLENBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0s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