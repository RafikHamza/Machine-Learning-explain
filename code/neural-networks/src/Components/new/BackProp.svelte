<script>
  import NetworkBackProp from "./NetworkBackProp.svelte";
  import { onMount } from "svelte";
  import {
    networkBp,
    stepIndexBp,
    bpStage,
    bpbind,
    drawErrorCircle,
    bpSlope,
    bpIntercept,
    fillRule,
    strokeRule,
    bpWeights,
  } from "../../store";
  import katexify from "../../katexify";

  $networkBp = [2, 2, 1, 1];

  const animationDuration = 500;

  const target2event = {
    0: () => {
      $stepIndexBp = 0;
      $fillRule = 0;
      $strokeRule = 0;
      $bpStage = 0.2;
      $bpSlope = 0;
      $bpIntercept = 0.75;
      animation0();
    },

    1: () => {
      $bpStage = 1;
      $fillRule = 1;
      $strokeRule = 1;
    },
    2: () => {
      $bpSlope = 0;
      $bpIntercept = 0.55;
      $bpStage = 2;
      animation2();
    },
    3: () => {
      $bpSlope = 0;
      $bpIntercept = 0.55;
      $stepIndexBp = 2;
      $bpStage = 1;
      animation3();
    },
    4: () => {
      //   $bpIntercept += 0.1;
      // $bpSlope += -0.35;
      $bpSlope = -0.35;
      $bpIntercept = 0.65;
      $stepIndexBp = 2;
      $bpStage = 1;
      animation4(); // Call the function immediately
      setTimeout(animation4, animationDuration * 2.2);
    },
  };

  function fireEvent(entryIndex) {
    if (entryIndex in target2event) {
      target2event[entryIndex]();
    }
  }

  function animation1() {
    $strokeRule = 0;
    setTimeout(() => {
      $strokeRule = 1;
    }, animationDuration);
  }
  function animation0() {
    $drawErrorCircle = false;
    $fillRule = 0;
    $strokeRule = 0;
    let animationSelections = [];

    const selector = `animateMotion#animatePathForwardBp1`;
    const selection = $bpbind.querySelectorAll(selector);
    animationSelections.push({ selection: selection });
    // trigger animation
    animationSelections.forEach((element) => {
      setTimeout(() => {
        element.selection.forEach((selection) => {
          selection.beginElement();
        });
      }, 100);
    });
    // draw circle at end of animation
    setTimeout(() => {
      $fillRule = 1;
    }, 3 * animationDuration);
  }

  function animation2() {
    let animationSelections = [];

    const selector = `animateMotion#animatePathBackward3`;
    const selection = $bpbind.querySelectorAll(selector);
    animationSelections.push({ selection: selection });
    animationSelections.forEach((element) => {
      setTimeout(() => {
        element.selection.forEach((selection) => {
          selection.beginElement();
        });
      }, 100);
    });

    setTimeout(() => {
      $fillRule = 2;
      $strokeRule = 2;
      updateWeights();
    }, 3 * animationDuration);
  }

  function animation3() {
    if ($bpSlope > -1.046) {
      let animationSelections = [];

      const selector1 = `animateMotion#animatePathForwardBp1`;
      const selection1 = $bpbind.querySelectorAll(selector1);
      animationSelections.push({ selection: selection1 });
      const selector = `animateMotion#animatePathBackward3`;
      const selection = $bpbind.querySelectorAll(selector);
      animationSelections.push({ selection: selection });
      // trigger animation
      animationSelections.forEach((element, i) => {
        setTimeout(() => {
          element.selection.forEach((selection) => {
            selection.beginElement();
          });
        }, i * 3 * animationDuration);
      });
      setTimeout(() => {
        $fillRule = 3;
        $strokeRule = 3;
        //     $bpIntercept += 0.1;
        // $bpSlope += -0.3;
        $bpSlope = -0.3;
        $bpIntercept = 0.56;
        $strokeRule += 1;
        $fillRule += 1;
        updateWeights();
        // updateMetrics();
      }, 6 * animationDuration);
    } else {
      return;
    }
  }
  function animation4() {
    if ($bpSlope > -1.046) {
      let animationSelections = [];

      const selector1 = `animateMotion#animatePathForwardBp1`;
      const selection1 = $bpbind.querySelectorAll(selector1);
      animationSelections.push({ selection: selection1 });
      const selector = `animateMotion#animatePathBackward3`;
      const selection = $bpbind.querySelectorAll(selector);
      animationSelections.push({ selection: selection });
      // trigger animation
      animationSelections.forEach((element, i) => {
        setTimeout(() => {
          element.selection.forEach((selection) => {
            selection.beginElement();
          });
        }, i * 3 * animationDuration);
      });
      setTimeout(() => {
        $fillRule = 3;
        $strokeRule = 3;
        updateMetrics();
      }, 6 * animationDuration);
    } else {
      return;
    }
  }

  function restartAnimation3() {
    $bpSlope = 0;
    $bpIntercept = 0.55;
    $strokeRule += 1;
    $fillRule += 1;
    updateWeights();
    animation3();
  }

  function restartAnimation4() {
    $bpSlope = -0.3;
    $bpIntercept = 0.56;

    $strokeRule += 1;
    $fillRule += 1;
    updateWeights();
    animation4();
    setTimeout(animation4, animationDuration * 2.2);
  }

  function updateWeights() {
    bpWeights.update((values) => {
      return values.map((value) => {
        const randomChange = Math.floor(Math.random() * 8); // generate a random integer between 0 and 5
        const randomDirection = Math.random() < 0.5 ? -1 : 1; // randomly choose whether to add or subtract
        return Math.max(
          1,
          Math.min(14, value + randomChange * randomDirection)
        ); // ensure the value stays within the range of 1 to 10
      });
    });
  }

  function updateMetrics() {
    $bpIntercept += 0.1;
    $bpSlope += -0.3;
    // update these to trigger color updates without forced remount
    $strokeRule += 1;
    $fillRule += 1;
    updateWeights();
  }

  onMount(() => {
    // store elements to track
    const sections = [...document.querySelectorAll(".step-bp")];

    // observe elements to track
    sections.forEach((section) => {
      observer.observe(section);
    });
  });

  // options for intersection observer
  const options = {
    threshold: 0.7,
  };

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // check if visible or not
      if (entry.isIntersecting) {
        // resolve stage in graph
        const entryIndex = entry.target.getAttribute("data-index");
        if (entryIndex in target2event) {
          fireEvent(entryIndex);
        }
      }
    });
  }, options);
</script>

<div id="backpropagation-section">
  <h1 class="body-header">Backpropagation: How Networks Learn</h1>
  <hr />
  <p class="body-text">
    Now that we've grasped the concept of activation functions and their role in
    neural networks, it's time to understand how these networks learn. The magic
    behind this learning process is a technique known as backpropagation.
    <br /><br />
    Backpropagation is an algorithm used during the training of neural networks.
    <span class="bold"
      >The goal of backpropagation is to update the weights so that the Neural
      Network makes better predictions.</span
    >
    Specifically, backpropagation will calculate the gradient of the loss function
    with respect to the weights of the network, updating the weights layer-by-layer
    to minimize the network's prediction error.
    <br /><br />
    To make the process as clear as possible, let's visualize it step-by-step.
    <br /><br />
  </p>
  <br />
  <br />
  <div id="container">
    <section>
      <div class="scrolly-container-backprop">
        <div class="charts-container-backprop">
          <div class="chart-holder-backprop">
            <NetworkBackProp />
          </div>
        </div>
        <div class="steps-container-backprop">
          <div class="step-bp" data-index="0">
            <div class="step-content-bp">
              <h2>Forward Pass</h2>
              <hr />
              <br />

              <p>
                During the forward pass, input data is fed through a neural
                network's layers to produce a prediction. This process involves
                calculating the weighted sums and applying activation functions
                for each neuron in each layer.
                <br /><br />
                We can see that the classification boundary for our current network
                (the two-colored background region) isn't great.
              </p>
              <br />
              <button class="step-button" on:click={() => animation0()}
                >Replay Animation</button
              >
            </div>
          </div>
          <div class="step-bp" data-index="1">
            <div class="step-content-bp">
              <h2>Error</h2>
              <hr />
              <br />

              <p>
                The error, also known as loss, measures the difference between
                the neural network's predicted output and the actual target
                values. By minimizing this error, the neural network learns to
                improve its predictions during training.
                <br /><br />
                Notice those extra big circles in the chart, the ones that are colored
                differently than their background? Those are the values that were
                falsely predicted. The goal of backpropagation is to update the model's
                weights so that it learns to predict with less error.
              </p>
              <br />
              <button class="step-button" on:click={() => animation1()}
                >Replay Animation</button
              >
            </div>
          </div>
          <div class="step-bp" data-index="2">
            <div class="step-content-bp">
              <h2>Backward Pass</h2>
              <hr />
              <br />
              <p>
                In the backward pass, the error is propagated back through the
                network, starting from the output layer, to adjust the weights
                and biases of each neuron. This weight adjustment process,
                guided by the gradients of the error with respect to the
                weights, aims to minimize the overall error of the network.
                (This process uses the Chain Rule from calculus to update the
                weights layer-by-layer, but we won't go into detail here.)
                <br /><br />
                In our example, the width of the lines connecting each neuron represent
                the weights of the network. The weights will be adjusted to reduce
                the prediction error of our Neural network.
              </p>
              <br />
              <button class="step-button" on:click={() => animation2()}
                >Replay Animation</button
              >
            </div>
          </div>
          <div class="step-bp" data-index="3">
            <div class="step-content-bp">
              <h2>BackPropagation</h2>
              <hr />
              <br />

              <p>
                Predictions flow forward through the network in the forward
                pass, and errors flow backwards through the network, adjusting
                weights along the way. <span class="bold"
                  >This process is know as Backpropagation.</span
                >
                <br /><br />
                Backpropagation is a supervised learning algorithm used in neural
                networks that optimizes their weights and biases through iterative
                forward and backward passes. By computing the gradients of the error
                with respect to the weights, backpropagation enables the network
                to learn and improve its predictions.
                <br />
              </p>
              <br />
              <button class="step-button" on:click={() => restartAnimation3()}
                >Replay Animation</button
              >
            </div>
          </div>
          <div class="step-bp" data-index="4">
            <div class="step-content-bp">
              <h2>More BackPropagation...</h2>
              <hr />
              <br />
              <p>
                Backpropagation doesn't occur just once! For a typical neural
                network, backpropagation is repeated hundreds, if not thousands,
                of times. To keep things simple, we animate only a couple more
                runs of backprop here.
                <br /><br />

                <span class="bold"
                  >The key thing to note is that, at each run, the network's
                  weights are updated in a manner that improves our model's
                  performance!</span
                >. To see this directly, you can observe how the classification
                region (the background colors) correspond correctly to the
                circles.
              </p>
              <br />
              <button class="step-button" on:click={() => restartAnimation4()}
                >Replay Animation</button
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <br />
    <h3 class="body-header">Backprop & Gradient Descent</h3>
    <hr />
    <p class="body-text">
      We just went over backpropagation, the process by which Neural Networks
      try to find the optimal weights for the given prediction task (optimal
      here meaning the weights that result in the lowest error value).
      <br /><br />
      It's important to note that this process is not perfect! Many issues may occur
      when training a neural network, even a network as simple as above. To learn
      more, continue reading!

      <br /><br />
    </p>
    <br /><br /><br />
  </div>
</div>

<style>
  #backpropagation-section {
    padding-top: 5rem;
    padding-left: 1rem;
    /* background-color: var(--darksquidink); */
    color: var(--white);
    background: radial-gradient(
      ellipse at center,
      var(--darksquidink) 60%,
      var(--squidink) 100%
    );
  }
  .body-header,
  .body-text {
    color: var(--paper);
  }
  .step-button {
    cursor: pointer;
    padding: 10px 16px;
  }

  .step-button:hover {
    color: var(--bg);
    background-color: var(--squidink);
    border: 1px solid var(--bg);
  }

  section {
    padding-bottom: 5rem;
    /* background-color: var(--darksquidink); */
    color: var(--white);
    max-width: 1200px;
    margin: auto;
  }

  .scrolly-container-backprop {
    text-align: center;
    display: flex;
    margin-top: 0;
    padding-top: 0;
    flex-direction: row-reverse;
    padding-left: 1rem;
  }

  .charts-container-backprop {
    position: sticky;
    top: 25%;
    width: 70%;
    height: 50vh;
    margin-right: 2%;
    /* border: 2px solid green; */
    flex: 0 0 60%; /* This item will take up 70% of the container-backprop's width */
  }

  .steps-container-backprop {
    /* border: 2px solid red; */
    width: 100%;
  }

  .chart-holder-backprop {
    width: 100%;
    height: 100%;
    max-height: 750px;
  }

  .step-bp {
    position: relative;
    scroll-snap-align: center;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 90vh;
    display: flex;
    place-items: center;
    justify-content: flex-start;
    padding: 1rem;
    padding-right: 1.4rem;
  }
  .step-bp {
    height: 100vh;
  }

  .step-content-bp {
    text-align: left;
    font-size: var(--size-default);
    font-family: var(--font-light);
    padding-left: 1.5rem;
    /* background-color: var(--darksquidink); */
    padding: 20px;
    border: 5px solid white;
  }

  .step-content-bp > h2 {
    font-family: var(--font-heavy);
    text-transform: uppercase;
    font-size: var(--size-default);
    color: var(--paper);
  }

  .step-content-bp > p {
    font-size: var(--size-default);
    font-family: var(--font-light);
    color: var(--paper);
  }

  .step-content-bp > hr {
    width: 100%;
    margin: 5px auto;
    border: 1px solid var(--stone);
    opacity: 0.6;
  }

  hr {
    border: 1px solid var(--stone);
  }

  @media screen and (max-width: 950px) {
    .scrolly-container-backprop {
      display: block;
      top: 30%;
      width: 99%;
      padding-left: 0;
    }

    .charts-container-backprop {
      position: sticky;
      top: 25%;
      width: 100%;
      height: 50vh;
      margin-right: 0;
    }

    .step-bp {
      height: 120vh;
      padding: 0;
      padding-right: 0;
      margin-bottom: 50vh;
    }

    .step-content-bp {
      text-align: left;
      font-size: var(--size-default);
      font-family: var(--font-light);
      background-color: #161e2ddc;
      padding-left: 0;
      padding: 10px;
      line-height: 1.1;
      border: 3px solid white;
    }

    .steps-container-backprop {
      pointer-events: none;
    }
    .charts-container-backprop {
      top: 25%;
      width: 100%;
      height: 45vh;
      margin-right: 0%;
      flex: 0 0 100%;
    }
  }
</style>
