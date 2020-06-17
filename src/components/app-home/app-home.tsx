import { Component, h } from "@stencil/core";

@Component({
  tag: "app-home",
  styleUrl: "app-home.css"
})
export class AppHome {
  public cards = [];

  componentWillLoad() {
    this.cards = ["Fiction", "Biography", "Classic", "Horror", "History"];
  }

  render() {
    return [
      <ion-content class="ion-padding">
        <h1>Category</h1>
        {this.cards.map(card => (
          <app-card-transition>
            <span slot="card-title">{card}</span>
            <span slot="card-content">
              <img src="assets/florencia-viadana-unsplash.jpg" />
              <p>This card utilises the <strong>FLIP</strong> (First, Last, Invert, Play) concept to expand to a full screen size (and shrink back to its regular size) only using <strong>transforms</strong> for the animation.</p>
              <p>It also makes use of other interesting concepts from the Ionic Animations API like animation grouping, beforeStyles, afterStyles, afterAddWrite, and more.</p>
            </span>
          </app-card-transition>
        ))}
      </ion-content>
    ];
  }
}
