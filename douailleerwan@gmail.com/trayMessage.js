//  GNOME Shell Extension Shader
//  Copyright (C) 2016 douaille
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
//  Douaille Erwan <douailleerwan@gmail.com>

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';

export class TrayMessage {
  constructor(subject, text) {
    let source = new MessageTray.Source(
      "Shader applet", 
      'utilities-Shader'
    );
    Main.messageTray.add(source);

    let notification = new MessageTray.Notification(source, subject, text);
    notification.setTransient(true);
    source.notify(notification);
  }
}