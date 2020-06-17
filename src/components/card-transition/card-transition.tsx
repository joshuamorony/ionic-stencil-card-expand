import { Component, Element, h } from "@stencil/core";
import { createAnimation, Animation } from "@ionic/core";

@Component({
  tag: "app-card-transition",
  styleUrl: "card-transition.css",
  shadow: true
})
export class CardTransition {
  @Element() hostElement: HTMLElement;

  private state: "initial" | "transitioning" | "expanded" = "initial";
  public card: HTMLIonCardElement;
  public titleElement: HTMLIonCardTitleElement;
  public closeElement: HTMLIonButtonElement;
  public contentElement: HTMLIonCardContentElement;

  public toggleTitleAnimation: Animation;
  public visibleWhenOpenAnimations: Animation;

  componentDidLoad() {
    this.card = this.hostElement.shadowRoot.querySelector("ion-card");
    this.titleElement = this.hostElement.shadowRoot.querySelector("ion-card-title");
    this.closeElement = this.hostElement.shadowRoot.querySelector("ion-card-header ion-button");
    this.contentElement = this.hostElement.shadowRoot.querySelector("ion-card-content");

    this.toggleTitleAnimation = createAnimation()
      .addElement(this.titleElement)
      .duration(200)
      .fill("forwards")
      .easing("ease-in-out")
      .fromTo("opacity", "1", "0")
      .fromTo("transform", "translateX(0)", "translateX(-10px)");

    this.visibleWhenOpenAnimations = createAnimation()
      .duration(200)
      .fill("forwards")
      .easing("ease-in-out");

    const toggleContentAnimation = createAnimation()
      .addElement(this.contentElement)
      .fromTo("opacity", "0", "1")
      .fromTo("transform", "translateX(10px)", "translateX(0)");

    const toggleCloseAnimation = createAnimation()
      .addElement(this.closeElement)
      .fromTo("opacity", "0", "0.8")
      .fromTo("transform", "translateX(10px)", "translateX(0)");

    this.visibleWhenOpenAnimations.addAnimation([toggleContentAnimation, toggleCloseAnimation])

  }

  toggleCard() {
    if (this.state === "initial") {
      this.open();
    }

    if (this.state === "expanded") {
      this.close();
    }
  }

  async open() {

    this.state = "transitioning";
    this.toggleTitleAnimation.direction("normal");

    await this.toggleTitleAnimation.play();
    await this.expandCard();
    return this.state = "expanded";
  }

  async close() {

    this.state = "transitioning";
    this.toggleTitleAnimation.direction("normal");
    this.visibleWhenOpenAnimations.direction("reverse");

    await Promise.all([this.toggleTitleAnimation.play(), this.visibleWhenOpenAnimations.play()]);
    await this.shrinkCard();

    return this.state = "initial";
  }

  async expandCard() {

    // Get initial position
    const first = this.card.getBoundingClientRect();

    // Apply class to expand to final position
    this.card.classList.add("expanded-card");

    // Get final position
    const last = this.card.getBoundingClientRect();

    const invert = {
      x: first.left - last.left,
      y: first.top - last.top,
      scaleX: first.width / last.width,
      scaleY: first.height / last.height
    };

    // Start from inverted position and transform to final position
    const expandAnimation: Animation = createAnimation()
      .addElement(this.card)
      .duration(300)
      .beforeStyles({
        ["transform-origin"]: "0 0",
      })
      .afterStyles({
        ["overflow"]: "scroll"
      })
      .beforeAddWrite(() => {
        this.hostElement.style.zIndex = "2";
      })
      .easing("ease-in-out")
      .fromTo(
        "transform",
        `translate(${invert.x}px, ${invert.y}px) scale(${invert.scaleX}, ${invert.scaleY})`,
        `translateY(0) scale(1, 1)`
      );

    expandAnimation.onFinish(() => {
      this.toggleTitleAnimation.direction("reverse");
      this.visibleWhenOpenAnimations.direction("normal");
      this.toggleTitleAnimation.play();
      this.visibleWhenOpenAnimations.play();
    });

    await expandAnimation.play();
  }

  async shrinkCard() {

    // Get initial position
    const first = this.card.getBoundingClientRect();

    // Reset styles
    this.card.classList.remove("expanded-card");

    // Get final position
    const last = this.card.getBoundingClientRect();

    const invert = {
      x: first.left - last.left,
      y: first.top - last.top,
      scaleX: first.width / last.width,
      scaleY: first.height / last.height
    };

    const shrinkAnimation: Animation = createAnimation()
      .addElement(this.card)
      .duration(300)
      .beforeClearStyles(["overflow"])
      .afterAddWrite(() => {
        this.hostElement.style.zIndex = "1";
      })
      .easing("ease-in-out")
      .fromTo(
        "transform",
        `translate(${invert.x}px, ${invert.y}px) scale(${invert.scaleX}, ${invert.scaleY})`,
        `translateY(0) scale(1, 1)`
      );

    shrinkAnimation.onFinish(() => {
      this.toggleTitleAnimation.direction("reverse");
      this.toggleTitleAnimation.play();
    });

    await shrinkAnimation.play();
  }

  render() {
    return (
      <div class="card-placeholder">
        <ion-card
          button={true}
          onClick={() => {
            this.toggleCard();
          }}
        >
          <ion-card-header>
            <ion-card-title>
              <slot name="card-title"></slot>
            </ion-card-title>
            <ion-button fill="clear">
              <ion-icon name="close" slot="icon-only" color="light"></ion-icon>
            </ion-button>
          </ion-card-header>
          <ion-card-content>
            <slot name="card-content"></slot>
          </ion-card-content>
        </ion-card>
      </div>
    );
  }
}