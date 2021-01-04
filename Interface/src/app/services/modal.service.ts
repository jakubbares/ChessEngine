import {ChangeGameModal} from "../components/change-game.component";
import {Injectable} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class ModalService {
  constructor(
    private modalService: NgbModal
  ) {
  }

  openGamesDialog(): void {
    const modalRef = this.modalService.open(ChangeGameModal, {size: "lg", windowClass: 'enter-name-modal'});
  }

}
